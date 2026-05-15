import ProjectCard from "../components/ProjectCard"
import Button from "../components/ui/Button"

function HomePage({ projects, onSelectProject, onAddProject }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#010409" }}>
      {/* top gradient line */}
      <div
        className="h-0.5 w-full"
        style={{ background: "linear-gradient(to right, #f04033, #5a98b1)" }}
      />

      {/* header */}
      <div
        className="px-10 py-5 flex items-center justify-between"
        style={{ borderBottom: "1px solid #21262d" }}
      >
        <h1 className="font-bold text-lg tracking-tight text-white">// Godot CI</h1>
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

      {/* add button */}
      {projects.length > 0 && (
        <button
          onClick={onAddProject}
          className="fixed bottom-8 right-8 w-11 h-11 rounded-xl text-white text-xl shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center"
          style={{ backgroundColor: "#5a98b1" }}
        >
          +
        </button>
      )}
    </div>
  )
}

export default HomePage
