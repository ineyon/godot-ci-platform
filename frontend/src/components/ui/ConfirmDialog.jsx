import Panel from "./Panel"
import Button from "./Button"

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <Panel onClose={onCancel}>
      <h2 className="text-xl font-bold mb-3">Are you sure?</h2>
      <p className="text-gray-500 text-sm mb-6">{message}</p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button
          onClick={onConfirm}
          className="bg-[#f04033] hover:bg-[#d63529] text-white"
        >
          Delete
        </Button>
      </div>
    </Panel>
  )
}

export default ConfirmDialog