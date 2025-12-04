import Hint from "./Hint";

export function Button({
  children,
  type = "button",
  onClick,
  className = "",
  color = "bg-purple",
  textColor = "text-white",
  label,
  center,
  hint = "",
  disabled = false,
  ...props
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        {label && (
          <>
            <span className="block text-sm font-medium ">{label}</span>
            <Hint hint={hint} />
          </>
        )}
      </div>

      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${color} ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:opacity-70 cursor-pointer"
        }  ${textColor} text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 w-full justify-center`}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}
