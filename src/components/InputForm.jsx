export default function InputForm({
  label,
  placeholder,
  type = "text",
  name,
  error,
  ...props
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          className="w-full border border-gray-400 rounded-lg px-3 py-2 font-semibold text-gray-500"
          {...props}
        />
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
