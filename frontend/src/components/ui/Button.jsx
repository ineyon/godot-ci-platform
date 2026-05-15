function Button({ children, onClick, variant = "primary", className = "", disabled = false }) {
  const styles = {
    primary: "bg-[#f04033] hover:bg-[#d63529] text-white",
    secondary: "bg-[#5a98b1] hover:bg-[#4a88a1] text-white",
    outline: "border border-[#f04033] text-[#f04033] hover:bg-[#f04033] hover:text-white",
    ghost: "border border-[#30363d] text-[#8b949e] hover:border-[#5a98b1] hover:text-[#5a98b1]",
    danger: "bg-transparent border border-red-800 text-red-400 hover:bg-red-900/20",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${styles[variant]} ${disabled ? "opacity-40 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
