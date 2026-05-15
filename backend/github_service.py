from github import Github

def get_builds(github_token: str, github_repo: str):
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

def trigger_build(github_token: str, github_repo: str):
    g = Github(github_token)
    repo = g.get_repo(github_repo)
    
    workflow = repo.get_workflow("build.yml")
    workflow.create_dispatch(ref="main")
    
    return {"message": "Build triggered"}

def get_godot_version(github_token: str, github_repo: str):
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
    
    return "4.6.2"

def setup_secrets(github_token: str, github_repo: str, itch_username: str, itch_game_id: str, butler_api_key: str):
    g = Github(github_token)
    repo = g.get_repo(github_repo)
    
    repo.create_secret("ITCH_USERNAME", itch_username)
    repo.create_secret("ITCH_GAME_ID", itch_game_id)
    repo.create_secret("BUTLER_API_KEY", butler_api_key)
    
    return {"message": "Secrets configured!"}

def create_workflow(github_token: str, github_repo: str):
    g = Github(github_token)
    repo = g.get_repo(github_repo)
    
    with open(".github/workflows/build.yml", "r") as f:
        build_content = f.read()
    
    with open(".github/workflows/deploy.yml", "r") as f:
        deploy_content = f.read()
    
    for path, content in [
        (".github/workflows/build.yml", build_content),
        (".github/workflows/deploy.yml", deploy_content),
    ]:
        try:
            file = repo.get_contents(path)
            repo.update_file(
                path=path,
                message="Update CI/CD workflow",
                content=content,
                sha=file.sha
            )
        except:
            repo.create_file(
                path=path,
                message="Add CI/CD workflow",
                content=content
            )
    
    return {"message": "Workflows created!"}

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