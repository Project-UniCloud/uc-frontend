export default function InputForm({
  label,
  placeholder,
  type = "text",
  step = "1",
  min,
  max,
  name,
  error,
  colors = "border-gray-400 text-gray-500",
  center,
  ...props
}) {
  const numberAttrs = type === "number" ? { step, min, max } : {};
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        <input
          {...numberAttrs}
          name={name}
          type={type}
          placeholder={placeholder}
          className={`w-full border rounded-lg px-3 py-2 font-semibold ${colors} ${
            center && "text-center"
          }`}
          {...props}
        />
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
