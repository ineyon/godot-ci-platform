function Panel({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="rounded-xl shadow-2xl p-8 w-full max-w-md relative"
        style={{ backgroundColor: "#161b22", border: "1px solid #30363d" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8b949e] hover:text-white text-lg transition-colors"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}

export default Panel
