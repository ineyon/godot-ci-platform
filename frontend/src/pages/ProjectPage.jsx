import { useState } from "react"
import Button from "../components/ui/Button"
import SettingsPanel from "../components/panels/SettingsPanel"
import UpdatePanel from "../components/panels/UpdatePanel"

function ProjectPage({ project, onBack, onSave, onDelete }) {
  const [showSettings, setShowSettings] = useState(false)
  const [showUpdate, setShowUpdate] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* top line */}
      <div
        className="h-1 w-full"
        style={{ background: "linear-gradient(to right, #f04033, #5a98b1)" }}
      />

      {/* header */}
      <div className="px-10 py-6 flex items-center justify-between border-b border-gray-100">
        <h1 className="font-bold text-xl tracking-tight">// Godot CI</h1>
        <Button variant="outline" onClick={onBack}>All Projects</Button>
      </div>

      {/* content */}
      <div className="px-10 py-8 grid grid-cols-3 gap-8">

        {/* left column */}
        <div className="col-span-1 flex flex-col gap-6">

          {/* info block */}
          <div className="border border-gray-100 rounded-2xl p-6 flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <img
                src={project.icon_url || "/images/godot-default.png"}
                alt={project.name}
                className="w-16 h-16 object-cover rounded-xl"
              />
              <div>
                <h2 className="font-bold text-xl">{project.name}</h2>
                {project.godot_version && (
                  <span className="text-sm text-gray-400">Godot {project.godot_version}</span>
                )}
              </div>
            </div>

            <hr className="border-gray-100" />

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

          {/* last push */}
          <div className="border border-gray-100 rounded-2xl p-6">
            <p className="text-xs text-gray-400 mb-2">LAST PUSH</p>
            <p className="text-sm font-medium text-gray-700">No data yet</p>
          </div>

          {/* workflows */}
          <div className="border border-gray-100 rounded-2xl p-6">
            <p className="text-xs text-gray-400 mb-2">WORKFLOWS</p>
            <p className="text-sm text-gray-500">No workflows yet</p>
          </div>
        </div>

        {/* right column */}
        <div className="col-span-2 flex flex-col gap-6">

          {/* stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Downloads", value: "—" },
              { label: "Views", value: "—" },
              { label: "Builds", value: "—" },
            ].map(({ label, value }) => (
              <div key={label} className="border border-gray-100 rounded-2xl p-6 text-center">
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-400 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* build history */}
          <div className="border border-gray-100 rounded-2xl p-6">
            <p className="text-xs text-gray-400 mb-4">BUILD HISTORY</p>
            <p className="text-sm text-gray-500">No builds yet</p>
          </div>

          {/* comments */}
          <div className="border border-gray-100 rounded-2xl p-6">
            <p className="text-xs text-gray-400 mb-4">RECENT COMMENTS</p>
            <p className="text-sm text-gray-500">No comments yet</p>
          </div>
        </div>
      </div>

      {/* bottom right buttons */}
      <div className="fixed bottom-8 right-8 flex gap-3">
        <Button variant="secondary" onClick={() => setShowUpdate(true)}>Update</Button>
        <Button variant="outline" onClick={() => setShowSettings(true)}>Settings</Button>
      </div>

      {showSettings && (
        <SettingsPanel
          project={project}
          onClose={() => setShowSettings(false)}
          onSave={(form) => {
            onSave(form)
            setShowSettings(false)
          }}
          onDelete={() => {
            onDelete()
            setShowSettings(false)
          }}
        />
      )}
      {showUpdate && (
        <UpdatePanel
            project={project}
            onClose={() => setShowUpdate(false)}
            onUpdate={async (form) => {
            console.log("update", form)
            setShowUpdate(false)
            }}
        />
        )}
    </div>
  )
}

export default ProjectPage