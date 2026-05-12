import { useState } from "react"
import Panel from "../ui/Panel"
import Button from "../ui/Button"

function UpdatePanel({ project, onClose, onUpdate }) {
  const [form, setForm] = useState({
    name: project.name || "",
    description: "",
    update_description: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    await onUpdate(form)
    setLoading(false)
  }

  return (
    <Panel onClose={onClose}>
      <h2 className="text-2xl font-bold mb-6">Push Update</h2>

      <div className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Project Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#5a98b1] transition-colors"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#5a98b1] transition-colors resize-none"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Update Description</label>
          <textarea
            value={form.update_description}
            onChange={(e) => setForm({ ...form, update_description: e.target.value })}
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#5a98b1] transition-colors resize-none"
            placeholder="What changed in this update?"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="secondary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Deploying..." : "Deploy Update"}
        </Button>
      </div>
    </Panel>
  )
}

export default UpdatePanel