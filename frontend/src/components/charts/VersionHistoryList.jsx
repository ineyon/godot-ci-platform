const API = "http://localhost:8000"

function formatBytes(bytes) {
  if (!bytes) return "—"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

function DownloadButton({ projectId, uploadId }) {
  return (
    <a
      href={`${API}/api/projects/${projectId}/uploads/${uploadId}/download`}
      target="_blank"
      rel="noreferrer"
      className="text-[#8b949e] hover:text-[#5a98b1] transition-colors"
      title="Download"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </a>
  )
}

function VersionHistoryList({ uploads = [], projectId }) {
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
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#8b949e]">{formatBytes(upload.size)}</span>
            {projectId && <DownloadButton projectId={projectId} uploadId={upload.id} />}
          </div>
        </div>
      ))}
    </div>
  )
}

export default VersionHistoryList
