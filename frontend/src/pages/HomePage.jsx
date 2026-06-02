import { useEffect, useRef } from "react"
import ProjectCard from "../components/ProjectCard"
import Button from "../components/ui/Button"

const API = "http://localhost:8000"

function HomePage({ projects, onSelectProject, onAddProject, onRefresh }) {
  const prevBuildsRef = useRef({})

  // автооновлення кожні 30 сек
  useEffect(() => {
    const interval = setInterval(() => {
      if (onRefresh) onRefresh()
    }, 30000)
    return () => clearInterval(interval)
  }, [onRefresh])

  // перевіряємо нові білди для кожного проєкту
  // (логіка нотифікацій живе в App.jsx через lastBuildId)

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#010409" }}>
      {/* sticky header */}
      <div className="sticky top-0 z-10" style={{ backgroundColor: "#010409" }}>
        <div className="h-0.5 w-full" style={{ background: "linear-gradient(to right, #f04033, #5a98b1)" }} />
        <div className="px-10 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid #21262d" }}>
          <h1 className="font-bold text-lg tracking-tight text-white">// Godot CI</h1>
          {projects.length > 0 && (
            <Button onClick={onAddProject}>Add Project</Button>
          )}
        </div>
      </div>

      {/* content */}
      <div className="px-10 py-8">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
            <p className="text-[#8b949e]">No projects yet</p>
            <Button onClick={onAddProject}>Add new project</Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-[#8b949e] text-sm">Your Projects</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {projects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={onSelectProject}
                />
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  )
}

export default HomePage
