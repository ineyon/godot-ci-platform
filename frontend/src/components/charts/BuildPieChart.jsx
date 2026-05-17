function BuildPieChart({ builds = [] }) {
  const success = builds.filter(b => b.conclusion === "success").length
  const failed = builds.filter(b => b.conclusion === "failure").length
  const total = builds.length

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-[#8b949e] text-sm">No builds yet</p>
      </div>
    )
  }

  const r = 40
  const cx = 60
  const cy = 60
  const circ = 2 * Math.PI * r
  const successDash = (success / total) * circ
  const failedDash = (failed / total) * circ

  return (
    <div className="flex items-center gap-6">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#21262d" strokeWidth="16" />
        {success > 0 && (
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="#5a98b1"
            strokeWidth="16"
            strokeDasharray={`${successDash} ${circ}`}
            strokeDashoffset={circ / 4}
            style={{ transform: "rotate(-90deg)", transformOrigin: "60px 60px" }}
          />
        )}
        {failed > 0 && (
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="#f04033"
            strokeWidth="16"
            strokeDasharray={`${failedDash} ${circ}`}
            strokeDashoffset={circ / 4 - successDash}
            style={{ transform: "rotate(-90deg)", transformOrigin: "60px 60px" }}
          />
        )}
        <text x={cx} y={cy + 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          {total}
        </text>
      </svg>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#5a98b1]" />
          <span className="text-[#8b949e] text-xs">Success: <span className="text-white">{success}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#f04033]" />
          <span className="text-[#8b949e] text-xs">Failed: <span className="text-white">{failed}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#21262d]" />
          <span className="text-[#8b949e] text-xs">Total: <span className="text-white">{total}</span></span>
        </div>
      </div>
    </div>
  )
}

export default BuildPieChart
