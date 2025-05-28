export function Button({
  children,
  type = "button",
  onClick,
  className = "",
  color = "bg-purple",
  textColor = "text-white",
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${color} hover:opacity-70 ${textColor} text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
