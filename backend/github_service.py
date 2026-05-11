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
    
    return {"message": "Build triggered!"}

