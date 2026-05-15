import { useState, useEffect } from "react"
import Button from "../components/ui/Button"
import SettingsPanel from "../components/panels/SettingsPanel"
import UpdatePanel from "../components/panels/UpdatePanel"

const API = "http://localhost:8000"

function PieChart({ success, failed, total }) {
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-[#8b949e] text-sm">No builds yet</p>
      </div>
    )
  }

  const successPct = (success / total) * 100
  const failedPct = (failed / total) * 100
  const r = 40
  const cx = 60
  const cy = 60
  const circ = 2 * Math.PI * r

  const successDash = (successPct / 100) * circ
  const failedDash = (failedPct / 100) * circ
  const successOffset = 0
  const failedOffset = -successDash

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

const cardStyle = {
  backgroundColor: "#0d1117",
  border: "1px solid #21262d",
}

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

function ProjectPage({ project, onBack, onSave, onDelete }) {
  const [showSettings, setShowSettings] = useState(false)
  const [showUpdate, setShowUpdate] = useState(false)
  const [builds, setBuilds] = useState([])
  const [lastPush, setLastPush] = useState(null)
  const [loadingBuilds, setLoadingBuilds] = useState(true)

  useEffect(() => {
    fetchBuilds()
    const interval = setInterval(fetchBuilds, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchBuilds = async () => {
    setLoadingBuilds(true)
    try {
      const res = await fetch(`${API}/api/projects/${project.id}/builds`)
      const data = await res.json()
      setBuilds(data)
      if (data.length > 0) setLastPush(data[0])
    } catch {
      console.error("Failed to fetch builds")
    }
    setLoadingBuilds(false)
  }

  const successBuilds = builds.filter(b => b.conclusion === "success").length
  const failedBuilds = builds.filter(b => b.conclusion === "failure").length

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#010409" }}>
      {/* top line */}
      <div className="h-0.5 w-full" style={{ background: "linear-gradient(to right, #f04033, #5a98b1)" }} />

      {/* header */}
      <div className="px-10 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid #21262d" }}>
        <h1 className="font-bold text-lg tracking-tight text-white">// Godot CI</h1>
        <Button variant="ghost" onClick={onBack}>All Projects</Button>
      </div>

      {/* content */}
      <div className="px-10 py-8 grid grid-cols-3 gap-6">

        {/* left column */}
        <div className="col-span-1 flex flex-col gap-4">

          {/* info block */}
          <div className="rounded-xl p-5 flex flex-col gap-3" style={cardStyle}>
            <div className="flex items-center gap-3">
              <img
                src={project.icon_url || "/images/godot-default.png"}
                alt={project.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div>
                <h2 className="font-semibold text-lg text-white">{project.name}</h2>
                {project.godot_version && (
                  <span className="text-xs text-[#8b949e]">Godot {project.godot_version}</span>
                )}
              </div>
            </div>

            <div style={{ borderTop: "1px solid #21262d", paddingTop: "12px" }} className="flex flex-col gap-2">
              <a
                href={"https://github.com/" + project.github_repo}
                target="_blank"
                rel="noreferrer"
                className="text-[#5a98b1] text-sm hover:underline"
              >
                GitHub →
              </a>
              <a
                href={"https://" + project.itch_username + ".itch.io/" + project.itch_game_id}
                target="_blank"
                rel="noreferrer"
                className="text-[#f04033] text-sm hover:underline"
              >
                itch.io →
              </a>
            </div>
          </div>

          {/* last push */}
          <div className="rounded-xl p-5" style={cardStyle}>
            <p className="text-xs text-[#8b949e] mb-3 uppercase tracking-wider">Last Push</p>
            {lastPush ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-white truncate">{lastPush.commit}</p>
                <p className="text-xs text-[#8b949e]">{new Date(lastPush.created_at).toLocaleString()}</p>
                <StatusBadge conclusion={lastPush.conclusion} status={lastPush.status} />
              </div>
            ) : (
              <p className="text-sm text-[#8b949e]">No data yet</p>
            )}
          </div>

          {/* builds chart */}
          <div className="rounded-xl p-5" style={cardStyle}>
            <p className="text-xs text-[#8b949e] mb-3 uppercase tracking-wider">Builds Overview</p>
            <PieChart success={successBuilds} failed={failedBuilds} total={builds.length} />
          </div>
        </div>

        {/* right column */}
        <div className="col-span-2 flex flex-col gap-4">

          {/* stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Downloads", value: "—" },
              { label: "Views", value: "—" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl p-5 text-center" style={cardStyle}>
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-xs text-[#8b949e] mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* build history */}
          <div className="rounded-xl p-5 flex-1" style={cardStyle}>
            <p className="text-xs text-[#8b949e] mb-4 uppercase tracking-wider">Build History</p>
            {loadingBuilds ? (
              <p className="text-sm text-[#8b949e]">Loading...</p>
            ) : builds.length === 0 ? (
              <p className="text-sm text-[#8b949e]">No builds yet</p>
            ) : (
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
            )}
          </div>

          {/* comments */}
          <div className="rounded-xl p-5" style={cardStyle}>
            <p className="text-xs text-[#8b949e] mb-4 uppercase tracking-wider">Recent Comments</p>
            <p className="text-sm text-[#8b949e]">No comments yet</p>
          </div>
        </div>
      </div>

      {/* bottom right buttons */}
      <div className="fixed bottom-8 right-8 flex gap-2">
        <Button variant="secondary" onClick={() => setShowUpdate(true)}>Update</Button>
        <Button variant="ghost" onClick={() => setShowSettings(true)}>Settings</Button>
      </div>

      {showSettings && (
        <SettingsPanel
          project={project}
          onClose={() => setShowSettings(false)}
          onSave={(form) => { onSave(form); setShowSettings(false) }}
          onDelete={() => { onDelete(); setShowSettings(false) }}
        />
      )}

      {showUpdate && (
        <UpdatePanel project={project} onClose={() => setShowUpdate(false)} />
      )}
    </div>
  )
}

export default ProjectPage
