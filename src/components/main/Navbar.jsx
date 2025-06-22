"use client";
import { FiArrowLeft } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useNamePath } from "@/lib/utils/getNamePath";
import Link from "next/link";

export default function Navbar({ back }) {
  const pageName = useNamePath();

  return (
    <div className="flex items-center shadow-xs shadow-gray-500 justify-between px-6 py-3 bg-white h-16">
      <div className="flex items-center gap-2 text-black text-2xl font-bold">
        {back && <FiArrowLeft className="text-lg" />}
        <span>{pageName}</span>
      </div>

      <div className="cursor-pointer">
        {/* <Link href="/profile"> */}
        <button
          type="button"
          disabled
          className="cursor-not-allowed bg-transparent border-none p-0"
        >
          <FaUserCircle className="text-3xl text-gray-400 cursor-not-allowed" />
        </button>
        {/* </Link> */}
      </div>
    </div>
  );
}
