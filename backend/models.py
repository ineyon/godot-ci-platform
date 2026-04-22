from pydantic import BaseModel #автовалідатор даних з фронта на бек
from typing import Optional

class Project(BaseModel):
    id: Optional[str] = None
    name: str
    github_token: str
    github_repo: str
    itch_username: str
    itch_game_id: str
    godot_version: Optional[str] = None
    export_targets: list = ["Web", "Windows"]