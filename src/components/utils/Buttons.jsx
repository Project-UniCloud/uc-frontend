export function Button({
  children,
  type = "button",
  onClick,
  className = "",
  color = "bg-purple",
  textColor = "text-white",
  label,
  center,
  ...props
}) {
  return (
    <div>
      {label && <span className="block text-sm font-medium mb-1">{label}</span>}
      <button
        type={type}
        onClick={onClick}
        className={`${color} hover:opacity-70  ${textColor} text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer w-full justify-center  ${className}`}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}
