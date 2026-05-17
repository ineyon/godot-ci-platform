function formatBytes(bytes) {
  if (!bytes) return "—"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

function VersionHistoryList({ uploads = [] }) {
  if (!uploads || uploads.length === 0) {
    return (
      <p className="text-sm text-[#8b949e]">No versions uploaded yet</p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {uploads.map((upload) => (
        <div
          key={upload.id}
          className="flex items-center justify-between px-3 py-2 rounded-lg"
          style={{ backgroundColor: "#0d1117", border: "1px solid #21262d" }}
        >
          <div className="flex flex-col">
            <span className="text-sm text-white">{upload.filename}</span>
            <span className="text-xs text-[#8b949e]">
              {upload.created_at ? new Date(upload.created_at).toLocaleDateString() : "—"}
            </span>
          </div>
          <span className="text-xs text-[#8b949e]">{formatBytes(upload.size)}</span>
        </div>
      ))}
    </div>
  )
}

export default VersionHistoryList
