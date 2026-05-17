function StatsCard({ stats = null, loading = false }) {
  const items = [
    { label: "Downloads", key: "downloads_count", icon: "↓" },
    { label: "Views",     key: "views_count",     icon: "👁" },
    { label: "Purchases", key: "purchases_count", icon: "$" },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {items.map(({ label }) => (
          <div key={label} className="rounded-xl p-5 text-center" style={{ backgroundColor: "#0d1117", border: "1px solid #21262d" }}>
            <p className="text-3xl font-bold text-[#8b949e] animate-pulse">—</p>
            <p className="text-xs text-[#8b949e] mt-1">{label}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map(({ label, key, icon }) => (
        <div key={label} className="rounded-xl p-5 text-center" style={{ backgroundColor: "#0d1117", border: "1px solid #21262d" }}>
          <p className="text-3xl font-bold text-white">
            {stats ? (stats[key] ?? 0).toLocaleString() : "—"}
          </p>
          <p className="text-xs text-[#8b949e] mt-1">{label}</p>
        </div>
      ))}
    </div>
  )
}

export default StatsCard
