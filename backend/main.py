from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware #для реакта безпека
from models import Project # наш проектік
from storage import load_projects, add_project, get_project, delete_project, update_project # функції для роботи з стореджом
from github_service import get_builds, trigger_build, get_godot_version, create_workflow, trigger_deploy, setup_secrets, get_commits
import httpx
from github import Github

app = FastAPI() # создаєм екземпляр фаст апішки

app.add_middleware( #настроєчки корса
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/") # єслі ми даєм запит на главну сторінку то пускаєм функцію рут
def root():
    return {"message": "Godot CI Platform API"}

@app.get("/api/health") # та сама тема тільки для статуса
def health():
    return {"status": "ok"}

@app.get("/api/projects") #тута просто ендпоінти для роботи з проектами, получать, добавлять, сейвить, видалять
def get_projects():
    return load_projects()

@app.post("/api/projects")  # додаємо проект
def create_project(project: Project):
    return add_project(project.model_dump())

@app.get("/api/projects/{project_id}") # отримати один проект
def get_one_project(project_id: str):
    project = get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.delete("/api/projects/{project_id}") # видаляємо проект
def remove_project(project_id: str):
    project = get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    delete_project(project_id)
    return {"message": "Project deleted"}

@app.get("/api/projects/{project_id}/builds") #отримуємо 10 останніх білдів проекту так як в github service їх кількість стоїть 10 (треба буде глянуть чи цього не буде замало, якщо що то зробити більшим список)
def get_project_builds(project_id: str):
    project = get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return get_builds(project["github_token"], project["github_repo"])

@app.post("/api/projects/{project_id}/trigger-build") #трігерим білд вручну по мейну
def trigger_project_build(project_id : str):
    project = get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return trigger_build(project["github_token"], project["github_repo"])

@app.post("/api/projects/{project_id}/connect")  #підключаємо проект гри з репо гіта
def connect_project(project_id: str):
    project = get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    godot_version = get_godot_version(  #отримуємо версію годота в проекті
        project["github_token"], 
        project["github_repo"]
        )

    result = create_workflow(   #створюємо завдання на білд та отримуємо результат
        project["github_token"], 
        project["github_repo"]
        )
    
    return{     #вивід результатів
        "massage": "Project connected",
        "godot_version": godot_version,
        "workflow": result
    }

@app.put("/api/projects/{project_id}")
def edit_project(project_id: str, project: Project):
    updated = update_project(project_id, project.model_dump())
    if not updated:
        raise HTTPException(status_code=404, detail="Project not found")
    return updated

@app.post("/api/projects/validate") #валідація гіта
def validate_project(project: Project):
    print(f"Token: {project.github_token[:10]}...")
    print(f"Repo: {project.github_repo}")
    try:
        g = Github(project.github_token)
        repo = g.get_repo(project.github_repo)
        return {"valid": True, "repo_name": repo.full_name}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=400, detail="Invalid token or repository. Check your credentials.")
    
@app.post("/api/projects/{project_id}/deploy")
def deploy_project(project_id: str, data: dict):
    project = get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return trigger_deploy(
        project["github_token"],
        project["github_repo"],
        data.get("version", "1.0.0"),
        data.get("description", "")
    )


@app.get("/api/projects/{project_id}/commits")  # останні коміти з репо гри
def get_project_commits(project_id: str, limit: int = 20):
    project = get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return get_commits(project["github_token"], project["github_repo"], limit)


@app.get("/api/projects/{project_id}/itch-stats")
async def get_itch_stats(project_id: str):
    project = get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # butler_api_key — це і є itch.io API key, той самий що в настройках
    api_key = project.get("butler_api_key", "")
    if not api_key:
        raise HTTPException(status_code=400, detail="API key not set")

    itch_username = project.get("itch_username", "")
    itch_game_id = project.get("itch_game_id", "")

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            headers = {"Authorization": f"Bearer {api_key}"}

            # 1. Інфо про гру — через itch.io API
            # game_id може бути числовим id або slug (user/game)
            # спробуємо через my-games спочатку
            my_games_resp = await client.get(
                "https://api.itch.io/profile/games",
                headers=headers
            )

            game_data = {}
            uploads = []

            if my_games_resp.status_code == 200:
                games = my_games_resp.json().get("games", [])
                # знаходимо нашу гру по slug або id
                for g in games:
                    if (str(g.get("id")) == str(itch_game_id) or
                        g.get("url", "").rstrip("/").endswith(f"/{itch_game_id}")):
                        game_data = g
                        break

                if game_data:
                    # 2. Uploads для знайденої гри
                    game_numeric_id = game_data.get("id")
                    uploads_resp = await client.get(
                        f"https://api.itch.io/games/{game_numeric_id}/uploads",
                        headers=headers
                    )
                    if uploads_resp.status_code == 200:
                        raw = uploads_resp.json().get("uploads", [])
                        uploads = [
                            {
                                "id": u.get("id"),
                                "filename": u.get("filename"),
                                "size": u.get("size"),
                                "type": u.get("type"),
                                "platforms": u.get("platforms", {}),
                                "created_at": u.get("created_at"),
                            }
                            for u in raw
                        ]

            return {
                "title": game_data.get("title"),
                "url": game_data.get("url") or f"https://{itch_username}.itch.io/{itch_game_id}",
                "views_count": game_data.get("views_count"),
                "downloads_count": game_data.get("downloads_count"),
                "purchases_count": game_data.get("purchases_count"),
                "published": game_data.get("published"),
                "min_price": game_data.get("min_price"),
                "cover_url": game_data.get("cover_url"),
                "uploads": uploads,
            }

        except httpx.RequestError as e:
            raise HTTPException(status_code=502, detail=f"Network error: {str(e)}")
def setup_project_secrets(project_id: str):
    project = get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return setup_secrets(
        project["github_token"],
        project["github_repo"],
        project["itch_username"],
        project["itch_game_id"],
        project.get("butler_api_key", "")
    )