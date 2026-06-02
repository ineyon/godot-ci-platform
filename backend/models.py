from pydantic import BaseModel
from typing import List, Optional

class Project(BaseModel): # основна модель проекту, саме в такому вигляді він зберігається в projects.json
    id: Optional[str] = None           # uuid, генерується автоматично при створенні
    name: str                           # назва проекту для відображення в UI
    github_token: str                   # PAT токен для роботи з репо гри
    github_repo: str                    # репо у форматі "user/repo"
    itch_username: str                  # юзернейм на itch.io
    itch_game_id: str                   # slug гри на itch.io (те що в URL)
    butler_api_key: Optional[str] = None  # API ключ itch.io, він же butler credentials
    godot_version: Optional[str] = None  # версія годота, підтягується при Connect з project.godot
    auto_deploy: bool = False           # поки не використовується, задел на майбутнє
    export_targets: List[str] = ["Web"] # платформи для експорту, поки теж не юзається активно
