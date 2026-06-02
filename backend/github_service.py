from github import Github
import os

# абсолютний шлях до кореня проекту — щоб читати воркфлови незалежно звідки запущений uvicorn
_BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def get_builds(github_token: str, github_repo: str): # тягнемо останні 10 ранів з усіх воркфлоів репо
    g = Github(github_token)
    repo = g.get_repo(github_repo)
    runs = repo.get_workflow_runs()
    result = []
    for run in list(runs)[:10]:
        result.append({
            "id": run.id,
            "name": run.name,
            "status": run.status,
            "conclusion": run.conclusion,
            "created_at": str(run.created_at),
            "commit": run.head_commit.message,
            "url": run.html_url
        })
    return result

def trigger_build(github_token: str, github_repo: str): # ручний запуск build.yml по гілці main
    g = Github(github_token)
    repo = g.get_repo(github_repo)
    workflow = repo.get_workflow("build.yml")
    workflow.create_dispatch(ref="main")
    return {"message": "Build triggered"}

def get_godot_version(github_token: str, github_repo: str): # читаємо project.godot з репо гри і парсимо версію движка
    g = Github(github_token)
    repo = g.get_repo(github_repo)
    try:
        file = repo.get_contents("project.godot")
        content = file.decoded_content.decode("utf-8")
        for line in content.split("\n"):
            if "config/features" in line:
                version = line.split('"')[1]
                return version
    except:
        pass
    return "4.6.2" # дефолт якщо не знайшли

def setup_secrets(github_token: str, github_repo: str, itch_username: str, itch_game_id: str, butler_api_key: str): # записуємо секрети в репо гри через GitHub API щоб воркфлови могли деплоїть на itch
    g = Github(github_token)
    repo = g.get_repo(github_repo)
    repo.create_secret("ITCH_USERNAME", itch_username)
    repo.create_secret("ITCH_GAME_ID", itch_game_id)
    repo.create_secret("BUTLER_API_KEY", butler_api_key)
    return {"message": "Secrets configured!"}

def create_workflow(github_token: str, github_repo: str): # читаємо наші шаблони воркфлоів і пушимо їх в репо гри
    g = Github(github_token)
    repo = g.get_repo(github_repo)

    build_path = os.path.join(_BASE, ".github", "workflows", "build.yml")
    deploy_path = os.path.join(_BASE, ".github", "workflows", "deploy.yml")

    with open(build_path, "r") as f:
        build_content = f.read()
    with open(deploy_path, "r") as f:
        deploy_content = f.read()

    for path, content in [
        (".github/workflows/build.yml", build_content),
        (".github/workflows/deploy.yml", deploy_content),
    ]:
        try:
            file = repo.get_contents(path)
            if file.decoded_content.decode("utf-8").strip() == content.strip():
                continue # вміст однаковий — не пушимо, щоб не смітити порожніми комітами
            repo.update_file(path=path, message="Update CI/CD workflow", content=content, sha=file.sha)
        except:
            repo.create_file(path=path, message="Add CI/CD workflow", content=content)

    return {"message": "Workflows created!"}

def get_commits(github_token: str, github_repo: str, limit: int = 20): # тягнемо останні коміти, беремо тільки перший рядок повідомлення
    g = Github(github_token)
    repo = g.get_repo(github_repo)
    result = []
    for commit in list(repo.get_commits())[:limit]:
        result.append({
            "sha": commit.sha[:7],
            "message": commit.commit.message.split("\n")[0],
            "author": commit.commit.author.name,
            "date": str(commit.commit.author.date),
            "url": commit.html_url
        })
    return result

def trigger_deploy(github_token: str, github_repo: str, version: str, description: str): # ручний запуск deploy.yml з версією і описом як інпути
    g = Github(github_token)
    repo = g.get_repo(github_repo)
    workflow = repo.get_workflow("deploy.yml")
    workflow.create_dispatch(
        ref="main",
        inputs={"version": version, "description": description}
    )
    return {"message": "Deploy triggered!"}
