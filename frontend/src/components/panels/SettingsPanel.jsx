import { useState } from "react"
import Panel from "../ui/Panel"
import Button from "../ui/Button"
import ConfirmDialog from "../ui/ConfirmDialog"

function SettingsPanel({ project, onClose, onSave, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false)

  const [form, setForm] = useState({
    name: project.name || "",
    github_token: project.github_token || "",
    github_repo: project.github_repo || "",
    itch_username: project.itch_username || "",
    itch_game_id: project.itch_game_id || "",
    butler_api_key: project.butler_api_key || "",
  })

  const fields = [
    { key: "name", label: "Project Name", type: "text" },
    { key: "github_token", label: "GitHub Token", type: "password" },
    { key: "github_repo", label: "GitHub Repository (user/repo)", type: "text" },
    { key: "itch_username", label: "itch.io Username", type: "text" },
    { key: "itch_game_id", label: "itch.io Game ID", type: "text" },
    { key: "butler_api_key", label: "Butler API Key (itch.io)", type: "password" },
  ]

  return (
    <Panel onClose={onClose}>
      <h2 className="text-xl font-bold mb-5 text-white">Settings</h2>

      <div className="flex flex-col gap-3">
        {fields.map(({ key, label, type }) => (
          <div key={key}>
            <label className="text-xs text-[#8b949e] mb-1 block">{label}</label>
            <input
              type={type}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full border border-[#30363d] focus:border-[#5a98b1] rounded-lg px-3 py-2 text-sm outline-none transition-colors text-white"
              style={{ backgroundColor: "#0d1117" }}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-5">
        <button
          onClick={() => setShowConfirm(true)}
          className="text-red-400 hover:text-red-300 text-sm transition-colors"
        >
          Delete Project
        </button>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="secondary" onClick={() => onSave(form)}>Save</Button>
        </div>
      </div>

      {showConfirm && (
        <ConfirmDialog
          message="This will permanently delete the project and all its data."
          onConfirm={onDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </Panel>
  )
}

export default SettingsPanel
