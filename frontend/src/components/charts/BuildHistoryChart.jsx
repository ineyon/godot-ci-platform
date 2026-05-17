function StatusBadge({ conclusion, status }) {
  const val = conclusion || status
  const styles = {
    success: "bg-[#5a98b1]/10 text-[#5a98b1] border border-[#5a98b1]/30",
    failure: "bg-[#f04033]/10 text-[#f04033] border border-[#f04033]/30",
    in_progress: "bg-yellow-900/20 text-yellow-400 border border-yellow-800/30",
  }
  const labels = {
    success: "Success",
    failure: "Failure",
    in_progress: "Running",
  }
  return (
    <span className={"text-xs px-2 py-0.5 rounded-full " + (styles[val] || "bg-[#21262d] text-[#8b949e] border border-[#30363d]")}>
      {labels[val] || val || "Pending"}
    </span>
  )
}

function BuildHistoryChart({ builds = [], loading = false }) {
  if (loading) {
    return <p className="text-sm text-[#8b949e]">Loading...</p>
  }

  if (builds.length === 0) {
    return <p className="text-sm text-[#8b949e]">No builds yet</p>
  }

  return (
    <div className="flex flex-col gap-1">
      {builds.map(build => (
        <a
          key={build.id}
          href={build.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors"
          style={{ borderBottom: "1px solid #21262d" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#161b22"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          <div className="flex items-center gap-3">
            <StatusBadge conclusion={build.conclusion} status={build.status} />
            <div>
              <p className="text-sm text-white truncate max-w-xs">{build.commit}</p>
              <p className="text-xs text-[#8b949e]">{new Date(build.created_at).toLocaleString()}</p>
            </div>
          </div>
          <span className="text-xs text-[#8b949e]">{build.name}</span>
        </a>
      ))}
    </div>
  )
}

export default BuildHistoryChart
