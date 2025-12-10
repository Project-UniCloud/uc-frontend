import { useState, useRef } from "react";
import { X } from "lucide-react";
import { FaRegTrashAlt } from "react-icons/fa";
import Hint from "./Hint";

export default function TeacherSearchInput({
  value = [],
  label = "Prowadzący*",
  disabled = true,
  disabledOnlyList = true,
  onSelect,
  onRemove,
  useLecturerSearch,
  hint = "",
}) {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const { results: options, loading } = useLecturerSearch(query);
  const [isFocused, setIsFocused] = useState(false);

  const handleSelect = (lect) => {
    const chosen = {
      id: lect.userId,
      firstName: `${lect.firstName}`,
      lastName: `${lect.lastName}`,
      fullName: `${lect.firstName} ${lect.lastName}`,
      login: `${lect.login}`,
      email: `${lect.email}`,
    };
    onSelect?.(chosen);
    setQuery("");
  };

  const visibleTags = value.slice(0, 2);
  const hiddenCount = value.length - visibleTags.length;

  const keyFor = (teacher, idx) =>
    teacher?.id ??
    teacher?.login ??
    teacher?.email ??
    `${teacher?.firstName}-${teacher?.lastName}-${idx}`;

  return (
    <div className="mb-4 relative">
      <div className="flex items-center gap-2">
        {label && (
          <>
            <label className="block text-sm font-medium">{label}</label>
            <Hint hint={hint} />
          </>
        )}
      </div>
      <div className="flex flex-wrap gap-1 z-0">
        {visibleTags.map((teacher, i) => (
          <span
            key={keyFor(teacher, i)}
            className="flex items-center bg-gray-200 px-2 py-1 rounded-full text-sm"
          >
            {teacher.fullName}
            <button
              type="button"
              disabled={disabledOnlyList}
              onClick={() => onRemove?.(teacher.id)}
              className={`ml-1 text-gray-500 ${
                disabledOnlyList ? "" : "hover:text-black cursor-pointer"
              }
              `}
            >
              <X className="w-4" />
            </button>
          </span>
        ))}
        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="px-2 py-1 text-sm text-purple hover:underline cursor-pointer"
          >
            +{hiddenCount} więcej
          </button>
        )}
      </div>
      {showAll && (
        <div className="absolute top-0 left-0 z-30 mt-1 w-64 lg:w-89 bg-white border rounded shadow-lg p-2">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Wszyscy prowadzący</span>
            <button
              type="button"
              onClick={() => setShowAll(false)}
              className="text-gray-500 hover:text-black cursor-pointer"
            >
              <X />
            </button>
          </div>
          <ul className="max-h-40 overflow-auto">
            {value.map((teacher, i) => (
              <li
                key={keyFor(teacher, i)}
                className="flex justify-between py-1"
              >
                <span>
                  {teacher.firstName} {teacher.lastName} ({teacher.login})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onRemove?.(teacher.id);
                    if (hiddenCount === 1) setShowAll(false);
                  }}
                  className="text-red hover:text-red-800 text-sm cursor-pointer"
                >
                  <FaRegTrashAlt />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div
        className={`${!disabled ? "h-10 overflow-visible" : "h-0 invisible"} `}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setShowAll(false);
          }}
          disabled={disabled}
          placeholder="Wyszukaj prowadzącego"
          className={`w-full border border-gray-300 rounded px-3 py-2 `}
        />{" "}
      </div>

      {query && options.length > 0 && !disabled && isFocused && (
        <ul className="absolute z-50 border border-gray-300 rounded mt-1 max-h-40 overflow-auto bg-white">
          {options.map((lect, i) => (
            <li
              key={lect.userId ?? lect.login ?? lect.email ?? i}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(lect);
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {lect.firstName} {lect.lastName} ({lect.login})
            </li>
          ))}
        </ul>
      )}
      {loading && <p className="text-sm text-gray-500 mt-1">Ładowanie…</p>}
    </div>
  );
}
