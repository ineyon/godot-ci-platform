from fastapi.testclient import TestClient # сімуліруєм фронт шоб провірить бек
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app # імпортим сюда наш бек

client = TestClient(app) # робим клієнта

def test_root():
    response = client.get("/") # прочекуєм сторінки і записуєм в джсончік відповіді якщо все гуд
    assert response.status_code == 200
    assert response.json() == {"message": "Godot CI Platform API"}

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}