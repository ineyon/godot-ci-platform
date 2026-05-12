function ProjectCard({ project, onClick }) {
  const icon = project.icon_url || "/images/godot-default.png"

  return (
    <div
      onClick={() => onClick(project)}
      className="relative cursor-pointer rounded-2xl overflow-hidden h-48 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 bg-white flex items-center"
    >
      <div className="h-full w-48 flex-shrink-0 relative overflow-hidden">
        <img
            src={icon}
            alt={project.name}
            className="h-full w-full object-cover scale-125 -translate-x-10"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white" />
        </div>

      <div className="flex-1 px-4 flex flex-col justify-between h-full py-4 ">
        <div>
          <h3 className="font-bold text-lg text-gray-900">{project.name}</h3>
          {project.version && (
            <p className="text-gray-400 text-sm">version {project.version}</p>
          )}
        </div>
        <div>
          {project.godot_version && (
            <p className="text-gray-500 text-sm">Godot ver. {project.godot_version}</p>
          )}
        </div>
      </div>

      {project.has_notification && (
        <div className="absolute top-3 right-3 w-3 h-3 bg-[#f04033] rounded-full animate-pulse" />
      )}
    </div>
  )
}

export default ProjectCard