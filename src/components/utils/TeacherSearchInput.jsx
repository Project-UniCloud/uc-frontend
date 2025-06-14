import { useState } from "react";
import { useLecturerSearch } from "@/hooks/useLecturerSearch";

export default function TeacherSearchInput({
  value = [],
  label = "Prowadzący*",
  disabled = false,
  onSelect,
  onRemove,
}) {
  const [query, setQuery] = useState("");
  const { results: options, loading } = useLecturerSearch(query);

  const handleSelect = (lect) => {
    const chosen = {
      id: lect.userId,
      fullName: `${lect.firstName} ${lect.lastName}`,
    };
    onSelect?.(chosen);
    setQuery("");
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>

      <div className="flex flex-wrap gap-1 mb-1">
        {value.map((name, i) => (
          <span
            key={value[i]}
            className="flex items-center bg-gray-200 px-2 py-1 rounded-full text-sm"
          >
            {name}
            <button
              type="button"
              // onClick={() => onRemove?.()}
              className="ml-1 text-gray-500 hover:text-black"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={disabled}
        placeholder="Wyszukaj prowadzącego"
        className="w-full border border-gray-300 rounded px-3 py-2"
      />

      {query && options.length > 0 && (
        <ul className="border border-gray-300 rounded mt-1 max-h-40 overflow-auto">
          {options.map((lect) => (
            <li
              key={lect.userId}
              onClick={() => handleSelect(lect)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {lect.firstName} {lect.lastName}
            </li>
          ))}
        </ul>
      )}

      {loading && <p className="text-sm text-gray-500 mt-1">Ładowanie…</p>}
    </div>
  );
}
