function ProjectList({ projects, onSelect, onDelete }) {
  if (projects.length === 0) {
    return (
      <p className="text-gray-500">There is no projects yet. Lets add a new one!</p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {projects.map(project => (
        <div
          key={project.id}
          className="bg-gray-800 rounded-lg p-4 flex justify-between items-center"
        >
          <div>
            <h3 className="text-white font-bold">{project.name}</h3>
            <p className="text-gray-400 text-sm">{project.github_repo}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onSelect(project)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
            >
              Open
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProjectList