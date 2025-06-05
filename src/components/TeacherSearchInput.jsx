import { useState } from "react";
import { useLecturerSearch } from "@/hooks/useLecturerSearch";

export default function TeacherSearchInput({
  value = "",
  label = "Prowadzący*",
}) {
  const [teacherQuery, setTeacherQuery] = useState(value);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const { results: lecturerOptions, loading: isSearching } =
    useLecturerSearch(teacherQuery);

  const handleSelect = (lecturer) => {
    const chosen = {
      userId: lecturer.userId,
      label: `${lecturer.firstName} ${lecturer.lastName}`,
    };
    setSelectedTeacher(chosen);
    setTeacherQuery("");
  };

  return (
    <>
      <div className="relative mb-4">
        <label htmlFor="teacher" className="block text-sm font-medium mb-1">
          {label}
        </label>
        <input
          type="text"
          id="teacher"
          name="teacherDisplay"
          required
          autoComplete="off"
          placeholder="Wpisz nazwisko prowadzącego"
          value={selectedTeacher?.label || teacherQuery}
          onChange={(e) => {
            setTeacherQuery(e.target.value);
            setSelectedTeacher(null);
          }}
          className="w-full border border-gray-400 rounded-lg px-3 py-2"
        />
        {teacherQuery && lecturerOptions.length > 0 && !selectedTeacher && (
          <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-auto shadow-lg">
            {lecturerOptions.map((lecturer) => (
              <li
                key={lecturer.userId}
                onClick={() => handleSelect(lecturer)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {lecturer.firstName} {lecturer.lastName}
              </li>
            ))}
          </ul>
        )}
        {isSearching && (
          <p className="text-sm text-gray-500 mt-1">Ładowanie...</p>
        )}
      </div>
      <input
        type="hidden"
        name="teacher"
        value={selectedTeacher?.userId || ""}
      />
    </>
  );
}
