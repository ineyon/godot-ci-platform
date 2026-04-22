from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware #для реакта безпека
from models import Project # наш проектік
from storage import load_projects, add_project, get_project, delete_project # функції для роботи з стореджом

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

@app.post("/api/projects")
def create_project(project: Project):
    return add_project(project.model_dump())

@app.get("/api/projects/{project_id}")
def get_one_project(project_id: str):
    project = get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.delete("/api/projects/{project_id}")
def remove_project(project_id: str):
    project = get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    delete_project(project_id)
    return {"message": "Project deleted"}