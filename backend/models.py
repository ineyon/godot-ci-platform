from pydantic import BaseModel
from typing import List, Optional

class Project(BaseModel):
    id: Optional[str] = None
    name: str
    github_token: str
    github_repo: str
    itch_username: str
    itch_game_id: str
    godot_version: Optional[str] = None
    auto_deploy: bool = False
    export_targets: List[str] = ["Web", "Windows"]