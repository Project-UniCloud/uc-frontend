"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarItem({
  icon,
  label,
  itemPath,
  logout = false,
  disabled = false,
  ...props
}) {
  let isActive = false;
  if (itemPath) {
    const pathname = usePathname();
    isActive = pathname === itemPath;
  }

  const content = (
    <button
      disabled={disabled}
      className={
        `w-full flex items-center gap-3 text-[12px] p-1.5 rounded-md transition-all 
         ${isActive && "bg-white text-black shadow-md"}

         } ` +
        (disabled
          ? "opacity-50 cursor-not-allowed "
          : "cursor-pointer hover:bg-white hover:text-black")
      }
      {...props}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );

  return itemPath ? <Link href={itemPath}>{content}</Link> : content;
}
