const PLATFORM_COLORS = {
  windows: "#5a98b1",
  linux:   "#f04033",
  html5:   "#a371f7",
  osx:     "#56d364",
}

const PLATFORM_LABELS = {
  windows: "Windows",
  linux:   "Linux",
  html5:   "Web",
  osx:     "macOS",
}

function formatBytes(bytes) {
  if (!bytes) return "—"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

function detectPlatform(upload) {
  // спочатку дивимось на platforms об'єкт (може бути {} для butler-завантажень)
  const keys = Object.keys(upload.platforms || {}).filter(k => upload.platforms[k])
  if (keys.length > 0) return keys[0]
  // якщо platforms порожній — пробуємо вгадати по імені файлу
  const name = (upload.filename || "").toLowerCase()
  if (name.includes("win") || name.endsWith(".exe")) return "windows"
  if (name.includes("linux") || name.endsWith(".x86_64")) return "linux"
  if (name.includes("mac") || name.includes("osx")) return "osx"
  if (name.includes("web") || name.includes("html")) return "html5"
  return upload.type || "html5"
}

function PlatformChart({ uploads = [] }) {
  if (!uploads || uploads.length === 0) {
    return (
      <div className="flex items-center justify-center h-20">
        <p className="text-[#8b949e] text-sm">No uploads found</p>
      </div>
    )
  }

  const maxSize = Math.max(...uploads.map(u => u.size || 0), 1)

  return (
    <div className="flex flex-col gap-3">
      {uploads.map((upload) => {
        const platform = detectPlatform(upload)
        const color = PLATFORM_COLORS[platform] || "#8b949e"
        const label = PLATFORM_LABELS[platform] || platform
        const pct = ((upload.size || 0) / maxSize) * 100

        return (
          <div key={upload.id} className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white">{label}</span>
              <span className="text-xs text-[#8b949e]">{formatBytes(upload.size)}</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ backgroundColor: "#21262d" }}>
              <div
                className="h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PlatformChart
