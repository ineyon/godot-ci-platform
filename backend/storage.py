import json
import uuid
import os

STORAGE_FILE = "projects.json" 

def load_projects():# читає файлік з проектами та вертає нам проектікі
    if not os.path.exists(STORAGE_FILE):
        return []
    with open(STORAGE_FILE, "r") as f:
        return json.load(f)

def save_projects(projects):# тут сейвим проект
    with open(STORAGE_FILE, "w") as f:
        json.dump(projects, f, indent=2)

def add_project(project: dict): #тут грузим всі проекти і додаєм новий і сейвим
    projects = load_projects()
    project["id"] = str(uuid.uuid4()) # генерація айдішніка на проект
    projects.append(project)
    save_projects(projects)
    return project

def get_project(project_id: str):# тут шукаєм по айді проект
    projects = load_projects()
    for p in projects:
        if p["id"] == project_id:
            return p
    return None

def delete_project(project_id: str):#ну тут удаляєм, все понятно
    projects = load_projects()
    projects = [p for p in projects if p["id"] != project_id]
    save_projects(projects)