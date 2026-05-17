function GameAnalyticsChart({ builds = [] }) {
  if (builds.length === 0) {
    return (
      <div className="flex items-center justify-center h-16">
        <p className="text-[#8b949e] text-sm">No build data</p>
      </div>
    )
  }

  // групуємо білди по днях (останні 14 днів)
  const days = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }

  const countByDay = {}
  days.forEach(d => { countByDay[d] = 0 })
  builds.forEach(b => {
    const day = b.created_at?.slice(0, 10)
    if (day && countByDay[day] !== undefined) countByDay[day]++
  })

  const counts = days.map(d => countByDay[d])
  const maxCount = Math.max(...counts, 1)

  return (
    <div className="flex items-end gap-1 h-16">
      {days.map((day, i) => {
        const count = counts[i]
        const height = Math.max((count / maxCount) * 100, count > 0 ? 8 : 2)
        return (
          <div
            key={day}
            className="flex-1 rounded-sm transition-all duration-300 relative group"
            style={{
              height: `${height}%`,
              backgroundColor: count > 0 ? "#5a98b1" : "#21262d",
              minHeight: "2px",
            }}
          >
            {/* tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:flex flex-col items-center">
              <div className="bg-[#161b22] border border-[#30363d] rounded px-2 py-1 text-xs text-white whitespace-nowrap">
                {day.slice(5)}: {count} build{count !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default GameAnalyticsChart
