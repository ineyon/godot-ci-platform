from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware #для реакта безпека
from models import Project # наш проектік
from storage import load_projects, add_project, get_project, delete_project, update_project # функції для роботи з стореджом
from github_service import get_builds, trigger_build, get_godot_version, create_workflow
from fastapi import FastAPI, HTTPException
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

@app.post("api/projects/{project_id}/connect")  #підключаємо проект гри з репо гіта
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
        project["github_repo"],
        project["itch_username"],
        project["itch_game_id"]
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

@app.post("/api/projects/validate")
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