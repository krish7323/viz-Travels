function Button({ children, type = "button", onClick, variant = "primary", style }) {
  const baseStyle = "px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg";
  const variants = {
    primary: "bg-blueacc text-white hover:bg-blue-600",
    success: "bg-green-600 text-white hover:bg-green-500",
    outline: "border border-gray-500 text-gray-300 hover:bg-gray-800",
    danger: "bg-red-900/40 border border-red-700 text-red-200 hover:bg-red-900/80",
    cyan: "bg-cyan text-navy hover:bg-cyan/80"
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant]}`} style={style}>
      {children}
    </button>
  );
}

export default Button;