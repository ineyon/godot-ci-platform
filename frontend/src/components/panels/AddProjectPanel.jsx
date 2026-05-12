import { useState } from "react"
import Panel from "../ui/Panel"
import Button from "../ui/Button"

const API = "http://localhost:8000"

function AddProjectPanel({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    github_token: "",
    github_repo: "",
    itch_username: "",
    itch_game_id: "",
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(false)

  const fields = [
    { key: "name", label: "Project Name", type: "text" },
    { key: "github_token", label: "GitHub Token", type: "password" },
    { key: "github_repo", label: "GitHub Repository (user/repo)", type: "text" },
    { key: "itch_username", label: "itch.io Username", type: "text" },
    { key: "itch_game_id", label: "itch.io Game ID", type: "text" },
  ]

  // фронтенд валідація
  const validateForm = () => {
    const newErrors = {}

    if (!form.name.trim()) {
      newErrors.name = "Project name is required"
    }

    if (!form.github_token.trim()) {
      newErrors.github_token = "GitHub token is required"
    } else if (!form.github_token.startsWith("ghp_") && !form.github_token.startsWith("github_pat_")) {
      newErrors.github_token = "Token should start with ghp_ or github_pat_"
    }

    if (!form.github_repo.trim()) {
      newErrors.github_repo = "Repository is required"
    } else if (!form.github_repo.includes("/")) {
      newErrors.github_repo = "Format should be: username/repository"
    }

    if (!form.itch_username.trim()) {
      newErrors.itch_username = "itch.io username is required"
    }

    if (!form.itch_game_id.trim()) {
      newErrors.itch_game_id = "itch.io game ID is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    // спочатку фронтенд валідація
    if (!validateForm()) return

    // потім бекенд валідація через GitHub API
    setValidating(true)
    try {
      const res = await fetch(`${API}/api/projects/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

      if (!res.ok) {
        const data = await res.json()
        setErrors({ github_repo: data.detail })
        setValidating(false)
        return
      }
    } catch {
      setErrors({ github_repo: "Could not connect to server" })
      setValidating(false)
      return
    }
    setValidating(false)

    // все ок - додаємо проєкт
    setLoading(true)
    await onAdd(form)
    setLoading(false)
  }

  const isBasicValid = form.name && form.github_token && form.github_repo

  return (
    <Panel onClose={onClose}>
      <h2 className="text-2xl font-bold mb-6">New Project</h2>

      <div className="flex flex-col gap-3">
        {fields.map(({ key, label, type }) => (
          <div key={key}>
            <label className="text-xs text-gray-400 mb-1 block">{label}</label>
            <input
              type={type}
              value={form[key]}
              onChange={(e) => {
                setForm({ ...form, [key]: e.target.value })
                if (errors[key]) setErrors({ ...errors, [key]: null })
              }}
              className={
                "w-full border rounded-xl px-4 py-2 text-sm outline-none transition-colors " +
                (errors[key]
                  ? "border-[#f04033] focus:border-[#f04033]"
                  : "border-gray-200 focus:border-[#5a98b1]")
              }
            />
            {errors[key] && (
              <p className="text-[#f04033] text-xs mt-1">{errors[key]}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button
          variant="secondary"
          onClick={handleSubmit}
          disabled={!isBasicValid || loading || validating}
          className={!isBasicValid ? "opacity-50 cursor-not-allowed" : ""}
        >
          {validating ? "Validating..." : loading ? "Adding..." : "Add Project"}
        </Button>
      </div>
    </Panel>
  )
}

export default AddProjectPanel