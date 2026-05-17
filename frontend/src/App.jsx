import { useState, useEffect, useRef } from "react"
import HomePage from "./pages/HomePage"
import AddProjectPanel from "./components/panels/AddProjectPanel"
import ProjectPage from "./pages/ProjectPage"

const API = "http://localhost:8000"

function App() {
  const [projects, setProjects] = useState([])
  const [currentPage, setCurrentPage] = useState("home")
  const [selectedProject, setSelectedProject] = useState(null)
  const [showAddPanel, setShowAddPanel] = useState(false)
  // зберігаємо id останнього білду для кожного проєкту щоб показувати нотифікацію
  const lastBuildIds = useRef({})
  const [notifications, setNotifications] = useState({})

  useEffect(() => {
    fetchProjects()
  }, [])

  // перевіряємо нові білди для всіх проєктів кожні 30 сек
  useEffect(() => {
    if (projects.length === 0) return
    const checkBuilds = async () => {
      const newNotifications = { ...notifications }
      for (const project of projects) {
        try {
          const res = await fetch(`${API}/api/projects/${project.id}/builds`)
          if (!res.ok) continue
          const builds = await res.json()
          if (builds.length === 0) continue
          const latestId = builds[0].id
          if (lastBuildIds.current[project.id] && lastBuildIds.current[project.id] !== latestId) {
            newNotifications[project.id] = true
          }
          if (!lastBuildIds.current[project.id]) {
            lastBuildIds.current[project.id] = latestId
          }
        } catch {
          // ігноруємо
        }
      }
      setNotifications(newNotifications)
    }
    const interval = setInterval(checkBuilds, 30000)
    return () => clearInterval(interval)
  }, [projects])

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
    // скидаємо нотифікацію коли зайшли на сторінку проєкту
    setNotifications(prev => ({ ...prev, [project.id]: false }))
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

  // додаємо нотифікації до проєктів
  const projectsWithNotifications = projects.map(p => ({
    ...p,
    has_notification: !!notifications[p.id],
  }))

  return (
    <div>
      {currentPage === "home" && (
        <HomePage
          projects={projectsWithNotifications}
          onSelectProject={handleSelectProject}
          onAddProject={() => setShowAddPanel(true)}
          onRefresh={fetchProjects}
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
