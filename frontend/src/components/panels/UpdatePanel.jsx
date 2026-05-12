import { useState } from "react"
import Panel from "../ui/Panel"
import Button from "../ui/Button"

const API = "http://localhost:8000"

function UpdatePanel({ project, onClose }) {
  const [form, setForm] = useState({
    version: project.godot_version || "1.0.0",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API}/api/projects/${project.id}/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version: form.version,
          description: form.description,
        })
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.detail || "Deploy failed")
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)

    } catch {
      setError("Could not connect to server")
    }

    setLoading(false)
  }

  return (
    <Panel onClose={onClose}>
      <h2 className="text-2xl font-bold mb-6">Deploy Update</h2>

      {success ? (
        <div className="text-center py-6">
          <p className="text-4xl mb-3">🚀</p>
          <p className="text-green-500 font-bold">Deploy triggered!</p>
          <p className="text-gray-400 text-sm mt-1">Check GitHub Actions for progress</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Game Version</label>
              <input
                type="text"
                value={form.version}
                onChange={(e) => setForm({ ...form, version: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#5a98b1] transition-colors"
                placeholder="1.0.0"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Update Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#5a98b1] transition-colors resize-none"
                placeholder="What changed in this update?"
              />
            </div>

            {error && (
              <p className="text-[#f04033] text-sm">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button
              variant="secondary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Deploying..." : "Deploy Update"}
            </Button>
          </div>
        </>
      )}
    </Panel>
  )
}

export default UpdatePanel