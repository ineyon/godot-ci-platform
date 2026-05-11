function BuildList({ builds }) {
  if (!builds || builds.length === 0) {
    return <p className="text-gray-500">There is no builds yet.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {builds.map(build => (
        <div key={build.id} className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white font-bold">{build.commit}</p>
              <p className="text-gray-400 text-sm">{build.created_at}</p>
            </div>
            <span className={`text-lg ${build.conclusion === "success" ? "text-green-400" : "text-red-400"}`}>
              {build.conclusion === "success" ? "success" : "failed"}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BuildList