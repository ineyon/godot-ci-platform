function ProjectCard({ project, onClick }) {
  const icon = project.icon_url || "/images/godot-default.png"

  return (
    <div
      onClick={() => onClick(project)}
      className="relative cursor-pointer rounded-xl overflow-hidden h-40 flex items-center transition-all duration-300 group"
      style={{
        backgroundColor: "#161b22",
        border: "1px solid #30363d",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#5a98b1"
        e.currentTarget.style.boxShadow = "0 0 20px rgba(90, 152, 177, 0.15)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#30363d"
        e.currentTarget.style.boxShadow = "none"
      }}
    >
      {/* icon left */}
      <div className="h-full w-40 flex-shrink-0 relative overflow-hidden">
        <img
          src={icon}
          alt={project.name}
          className="h-full w-full object-cover scale-125 -translate-x-8"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, transparent, #161b22)" }}
        />
      </div>

      {/* content right */}
      <div className="flex-1 px-4 flex flex-col justify-between h-full py-4">
        <div>
          <h3 className="font-semibold text-base text-white">{project.name}</h3>
          {project.version && (
            <p className="text-[#8b949e] text-xs mt-0.5">v{project.version}</p>
          )}
        </div>
        <div>
          {project.godot_version && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "#21262d", color: "#8b949e", border: "1px solid #30363d" }}
            >
              Godot {project.godot_version}
            </span>
          )}
        </div>
      </div>

      {/* notification dot */}
      {project.has_notification && (
        <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#f04033] rounded-full" />
      )}
    </div>
  )
}

export default ProjectCard
