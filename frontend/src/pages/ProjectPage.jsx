import { useState, useEffect } from "react"
import Button from "../components/ui/Button"
import SettingsPanel from "../components/panels/SettingsPanel"
import UpdatePanel from "../components/panels/UpdatePanel"
import BuildPieChart from "../components/charts/BuildPieChart"
import BuildHistoryChart from "../components/charts/BuildHistoryChart"
import StatsCard from "../components/charts/StatsCard"
import PlatformChart from "../components/charts/PlatformChart"
import GameAnalyticsChart from "../components/charts/GameAnalyticsChart"
import VersionHistoryList from "../components/charts/VersionHistoryList"

const API = "http://localhost:8000"

const cardStyle = {
  backgroundColor: "#0d1117",
  border: "1px solid #21262d",
}

// SVG іконки щоб не тягнути бібліотеку
function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function ItchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 245 220" fill="currentColor">
      <path d="M31.99 2.01C21.24 8.38 0 37.4 0 43.2v10.8c0 13.7 12.84 25.7 24.43 25.7 13.97 0 25.63-11.45 25.63-25.17 0 13.72 11.26 25.17 25.23 25.17 13.97 0 25.23-11.45 25.23-25.17 0 13.72 11.64 25.17 25.6 25.17h.25c13.97 0 25.6-11.45 25.6-25.17 0 13.72 11.27 25.17 25.24 25.17 13.97 0 25.23-11.45 25.23-25.17 0 13.72 11.66 25.17 25.63 25.17 11.6 0 24.43-12 24.43-25.7V43.2c0-5.8-21.24-34.82-31.99-41.19C231.56.4 182.12 0 122.5 0 62.88 0 13.44.4 31.99 2.01z" />
      <path d="M212.75 94.2c-6.23.5-12.48.76-18.77.78-15.82 0-29.12-4.55-39.28-12.63-9.98 8.08-23.32 12.63-38.95 12.63-15.65 0-28.97-4.55-38.95-12.63-10.16 8.08-23.46 12.63-39.28 12.63-6.3-.02-12.54-.28-18.77-.78L13.57 220h228.86L212.75 94.2zM152 196H92v-32h60v32zm0-52H92v-32h60v32z" />
    </svg>
  )
}

function StatusBadge({ conclusion, status }) {
  const val = conclusion || status
  const styles = {
    success: "bg-[#5a98b1]/10 text-[#5a98b1] border border-[#5a98b1]/30",
    failure: "bg-[#f04033]/10 text-[#f04033] border border-[#f04033]/30",
    in_progress: "bg-yellow-900/20 text-yellow-400 border border-yellow-800/30",
  }
  const labels = { success: "Success", failure: "Failure", in_progress: "Running" }
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
  const [itchStats, setItchStats] = useState(null)
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    fetchBuilds()
    fetchItchStats()
    const interval = setInterval(() => {
      fetchBuilds()
      fetchItchStats()
    }, 30000)
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

  const fetchItchStats = async () => {
    setLoadingStats(true)
    try {
      const res = await fetch(`${API}/api/projects/${project.id}/itch-stats`)
      if (res.ok) {
        const data = await res.json()
        setItchStats(data)
      }
    } catch {
      // itch stats optional — не показуємо помилку
    }
    setLoadingStats(false)
  }

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

        {/* ліва колонка */}
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

            <div style={{ borderTop: "1px solid #21262d", paddingTop: "12px" }} className="flex gap-3">
              <a
                href={"https://github.com/" + project.github_repo}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[#8b949e] hover:text-white transition-colors text-sm"
                title="GitHub"
              >
                <GitHubIcon />
                <span>GitHub</span>
              </a>
              <a
                href={"https://" + project.itch_username + ".itch.io/" + project.itch_game_id}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[#8b949e] hover:text-[#f04033] transition-colors text-sm"
                title="itch.io"
              >
                <ItchIcon />
                <span>itch.io</span>
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

          {/* builds pie */}
          <div className="rounded-xl p-5" style={cardStyle}>
            <p className="text-xs text-[#8b949e] mb-3 uppercase tracking-wider">Builds Overview</p>
            <BuildPieChart builds={builds} />
          </div>

          {/* activity chart */}
          <div className="rounded-xl p-5" style={cardStyle}>
            <p className="text-xs text-[#8b949e] mb-3 uppercase tracking-wider">Build Activity (14d)</p>
            <GameAnalyticsChart builds={builds} />
          </div>

          {/* platform chart */}
          {itchStats?.uploads?.length > 0 && (
            <div className="rounded-xl p-5" style={cardStyle}>
              <p className="text-xs text-[#8b949e] mb-3 uppercase tracking-wider">Platform Sizes</p>
              <PlatformChart uploads={itchStats.uploads} />
            </div>
          )}
        </div>

        {/* права колонка */}
        <div className="col-span-2 flex flex-col gap-4">

          {/* itch stats */}
          <StatsCard stats={itchStats} loading={loadingStats} />

          {/* build history */}
          <div className="rounded-xl p-5 flex-1" style={cardStyle}>
            <p className="text-xs text-[#8b949e] mb-4 uppercase tracking-wider">Build History</p>
            <BuildHistoryChart builds={builds} loading={loadingBuilds} />
          </div>

          {/* version history */}
          {itchStats?.uploads?.length > 0 && (
            <div className="rounded-xl p-5" style={cardStyle}>
              <p className="text-xs text-[#8b949e] mb-4 uppercase tracking-wider">Version History</p>
              <VersionHistoryList uploads={itchStats.uploads} />
            </div>
          )}
        </div>
      </div>

      {/* кнопки внизу */}
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
