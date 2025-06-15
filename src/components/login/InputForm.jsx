"use client";

import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function InputForm({
  placeholder,
  label,
  type,
  name,
  error,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  function handleShowPassword() {
    setShowPassword((prev) => !prev);
  }

  return (
    <div className="mb-4">
      <label className="text-xs font-medium text-[#333333]">{label}</label>
      <div className="relative">
        <input
          name={name}
          type={showPassword ? "text" : type}
          placeholder={placeholder}
          className="w-full mt-1 p-2 rounded bg-gray-100 pr-10 placeholder:text-[#808080] text-black placeholder:text-sm"
          data-cy={`input-${name}`}
          {...props}
        />
        {type == "password" && (
          <span
            className="absolute right-3 top-3 text-gray-400 cursor-pointer"
            onClick={handleShowPassword}
          >
            {showPassword ? (
              <MdVisibilityOff size={24} />
            ) : (
              <MdVisibility size={24} />
            )}
          </span>
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
