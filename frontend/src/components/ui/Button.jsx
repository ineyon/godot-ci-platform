function Button({ children, onClick, variant = "primary", className = "" }) {
  const styles = {
    primary: "bg-[#f04033] hover:bg-[#d63529] text-white",
    secondary: "bg-[#5a98b1] hover:bg-[#4a88a1] text-white",
    outline: "border-2 border-[#f04033] text-[#f04033] hover:bg-[#f04033] hover:text-white",
    danger: "bg-red-100 hover:bg-red-200 text-red-600",
  }

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button