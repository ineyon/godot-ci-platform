import { useState, useEffect } from "react"
import ProjectList from "./components/ProjectList"
import AddProjectForm from "./components/AddProjectForm"
import BuildList from "./components/BuildList"

const API = "http://localhost:8000"

function App() {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [builds, setBuilds] = useState([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    const res = await fetch(`${API}/api/projects`)
    const data = await res.json()
    setProjects(data)
  }

  const handleAdd = async (form) => {
    await fetch(`${API}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
    setShowForm(false)
    fetchProjects()
  }

  const handleDelete = async (id) => {
    await fetch(`${API}/api/projects/${id}`, { method: "DELETE" })
    if (selectedProject?.id === id) {
      setSelectedProject(null)
      setBuilds([])
    }
    fetchProjects()
  }

  const handleSelect = async (project) => {
    setSelectedProject(project)
    const res = await fetch(`${API}/api/projects/${project.id}/builds`)
    const data = await res.json()
    setBuilds(data)
  }

  const handleTriggerBuild = async () => {
    await fetch(`${API}/api/projects/${selectedProject.id}/trigger-build`, {
      method: "POST"
    })
    alert("Build Started!")
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-purple-400 mb-8">
        Godot CI Platform
      </h1>

      <div className="grid grid-cols-2 gap-8">
        {}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Projects</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
            >
              {showForm ? "Cancel" : "+ Add"}
            </button>
          </div>

          {showForm && (
            <div className="mb-4">
              <AddProjectForm onAdd={handleAdd} />
            </div>
          )}

          <ProjectList
            projects={projects}
            onSelect={handleSelect}
            onDelete={handleDelete}
          />
        </div>

        {}
        <div>
          {selectedProject ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedProject.name}</h2>
                <button
                  onClick={handleTriggerBuild}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Start Build
                </button>
              </div>
              <BuildList builds={builds} />
            </>
          ) : (
            <p className="text-gray-500">Select your project on left</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App