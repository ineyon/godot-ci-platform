import Panel from "./Panel"
import Button from "./Button"

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <Panel onClose={onCancel}>
      <h2 className="text-xl font-bold mb-3 text-white">Are you sure?</h2>
      <p className="text-[#8b949e] text-sm mb-6">{message}</p>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm}>Delete</Button>
      </div>
    </Panel>
  )
}

export default ConfirmDialog
