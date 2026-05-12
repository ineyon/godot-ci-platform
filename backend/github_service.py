from github import Github

def get_builds(github_token: str, github_repo: str):
    g = Github(github_token)
    repo = g.get_repo(github_repo)
    
    runs = repo.get_workflow_runs() #отримуємо 10 останніх workflow з гіта
    
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

def trigger_build(github_token: str, github_repo: str): #примусово запускаємо воркфлоу
    g = Github(github_token) 
    repo = g.get_repo(github_repo)
    
    workflow = repo.get_workflow("build.yml")
    workflow.create_dispatch(ref="main")
    
    return {"message": "Build triggered"}

def get_godot_version(github_token: str, github_repo: str): #отримуємо версію годота для білду з версії проекту для надійності
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
    
    return "4.2.1"

def create_workflow(github_token: str, github_repo: str, itch_username: str, itch_game_id: str): #створюємо воркфлоу для білда
    g = Github(github_token)
    repo = g.get_repo(github_repo)
    
    with open("../godot-ci-platform/.github/workflows/build.yml", "r") as f:
        workflow_content = f.read()
    
    try:
        file = repo.get_contents(".github/workflows/build.yml")
        repo.update_file(
            path=".github/workflows/build.yml",
            message="Update CI/CD workflow",
            content=workflow_content,
            sha=file.sha
        )
    except:
        repo.create_file(
            path=".github/workflows/build.yml",
            message="Add CI/CD workflow",
            content=workflow_content
        )
    
    return {"message": "Workflow created!"}

def trigger_deploy(github_token: str, github_repo: str, version: str, description: str):
    g = Github(github_token)
    repo = g.get_repo(github_repo)
    
    workflow = repo.get_workflow("deploy.yml")
    workflow.create_dispatch(
        ref="main",
        inputs={
            "version": version,
            "description": description
        }
    )
    
    return {"message": "Deploy triggered!"}