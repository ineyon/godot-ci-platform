import { useState, useEffect } from "react"
import HomePage from "./pages/HomePage"
import AddProjectPanel from "./components/panels/AddProjectPanel"
import ProjectPage from "./pages/ProjectPage"

const API = "http://localhost:8000"

function App() {
  const [projects, setProjects] = useState([])
  const [currentPage, setCurrentPage] = useState("home")
  const [selectedProject, setSelectedProject] = useState(null)
  const [showAddPanel, setShowAddPanel] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API}/api/projects`)
      const data = await res.json()
      setProjects(data)
    } catch (err) {
      console.error("Failed to fetch projects:", err)
    }
  }

  const handleSelectProject = (project) => {
    setSelectedProject(project)
    setCurrentPage("project")
  }

  const handleAdd = async (form) => {
    await fetch(`${API}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
    setShowAddPanel(false)
    fetchProjects()
  }

  const handleSaveProject = async (id, form) => {
  await fetch(`${API}/api/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form)
  })
  fetchProjects()
  }

  const handleDeleteProject = async (id) => {
  await fetch(`${API}/api/projects/${id}`, { method: "DELETE" })
  setCurrentPage("home")
  setSelectedProject(null)
  fetchProjects()
  }

  return (
    <div>
      {currentPage === "home" && (
        <HomePage
          projects={projects}
          onSelectProject={handleSelectProject}
          onAddProject={() => setShowAddPanel(true)}
        />
      )}

      {currentPage === "project" && selectedProject && (
        <ProjectPage
          project={selectedProject}
          onBack={() => setCurrentPage("home")}
          onSave={(form) => handleSaveProject(selectedProject.id, form)}
          onDelete={() => handleDeleteProject(selectedProject.id)}
        />
      )}

      {showAddPanel && (
        <AddProjectPanel
          onClose={() => setShowAddPanel(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  )
}

export default App