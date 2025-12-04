import { Tooltip } from "react-tooltip";
import { FaQuestion } from "react-icons/fa";
import { useId } from "react";

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
  hint,
  ...props
}) {
  const numberAttrs = type === "number" ? { step, min, max } : {};

  const tooltipId = `tooltip-${useId()}`;
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <label className="block text-sm font-medium">{label}</label>
        {hint && (
          <a
            data-tooltip-id={tooltipId}
            data-tooltip-content={hint}
            className="text-gray-300 hover:text-gray-600"
          >
            <FaQuestion className="w-2" />
          </a>
        )}
      </div>
      {hint && (
        <Tooltip
          arrowColor="black"
          border="1px solid gray"
          className="border-radius: 10px"
          id={tooltipId}
          style={{
            borderRadius: 10,
            backgroundColor: "#f3f4f6",
            color: "#000000",
            whiteSpace: "pre-line",
            maxWidth: "220px",
            wordBreak: "break-word",
          }}
        />
      )}
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
