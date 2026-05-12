import ProjectCard from "../components/ProjectCard"
import Button from "../components/ui/Button"

function HomePage({ projects, onSelectProject, onAddProject }) {
  return (
    <div className="min-h-screen bg-white">
      <div
        className="h-1 w-full"
        style={{ background: "linear-gradient(to right, #f04033, #5a98b1)" }}
      />


      <div className="px-10 py-6 flex items-center justify-between border-b border-gray-100">
        <h1 className="font-bold text-xl tracking-tight">// Godot CI</h1>
      </div>

      <div className="px-10 py-8">
        {projects.length === 0 ? (
          
          <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
            <p className="text-gray-400 text-lg">There are no projects yet :(</p>
            <Button onClick={onAddProject}>Add new project</Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500 text-sm">Your Projects</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
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

      {projects.length > 0 && (
        <button
          onClick={onAddProject}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-2xl bg-[#5a98b1] hover:bg-[#4a88a1] text-white text-2xl shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center"
        >
          +
        </button>
      )}
    </div>
  )
}

export default HomePage