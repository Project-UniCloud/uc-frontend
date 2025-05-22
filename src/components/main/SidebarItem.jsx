"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function SidebarItem({
  icon,
  label,
  itemPath,
  logout = false,
  ...props
}) {
  let isActive = false;
  if (itemPath) {
    const pathname = usePathname();
    isActive = pathname === itemPath;
  }

  const content = (
    <button
      className={
        `w-full flex items-center gap-3 cursor-pointer text-[12px] p-1.5 rounded-md transition-all duration-400 ease-in-out hover:bg-white hover:text-black hover:shadow-md hover:shadow-gray-800 ` +
        (isActive ? "bg-white text-black shadow-md shadow-gray-800" : "")
      }
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );

  return itemPath ? <Link href={itemPath}>{content}</Link> : content;
}
