import { useState } from "react"

function AddProjectForm({ onAdd }) {
  const [form, setForm] = useState({
    name: "",
    github_token: "",
    github_repo: "",
    itch_username: "",
    itch_game_id: "",
  })

  const handleSubmit = () => {
    if (!form.name || !form.github_token || !form.github_repo) return
    onAdd(form)
    setForm({ name: "", github_token: "", github_repo: "", itch_username: "", itch_game_id: "" })
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 flex flex-col gap-3">
      <h2 className="text-white font-bold text-xl mb-2">Add Project</h2>
      
      {[
        { key: "name", label: "Project Name" },
        { key: "github_token", label: "GitHub Token" },
        { key: "github_repo", label: "GitHub Repo" },
        { key: "itch_username", label: "itch.io username" },
        { key: "itch_game_id", label: "itch.io game id" },
      ].map(({ key, label }) => (
        <input
          key={key}
          type={key === "github_token" ? "password" : "text"}
          placeholder={label}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="bg-gray-700 text-white rounded px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
        />
      ))}

      <button
        onClick={handleSubmit}
        className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-bold mt-2"
      >
        Add
      </button>
    </div>
  )
}

export default AddProjectForm