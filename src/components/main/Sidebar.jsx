"use client";
import Image from "next/image";
import {
  FiGrid,
  FiUsers,
  FiBell,
  FiDollarSign,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import {
  PiChalkboardTeacherLight,
  PiSlidersHorizontalLight,
} from "react-icons/pi";
import { MdOutlineBugReport } from "react-icons/md";
import SidebarItem from "./SidebarItem";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="hidden md:w-52 lg:w-60 h-screen bg-purple md:flex flex-col justify-between p-4 text-white">
      <div>
        <Link href="/dashboard">
          <Image
            src="/logo_nobg.png"
            alt="Unicloud Logo"
            width={200}
            height={0}
            className="mb-4 w-auto"
            priority
          />
        </Link>

        <p className="text-xs uppercase mb-4 tracking-wider">Menu główne</p>

        <nav className="flex flex-col gap-4 text-sm">
          <SidebarItem
            icon={<FiGrid />}
            label="Przegląd"
            itemPath="/dashboard"
          />
          <SidebarItem icon={<FiUsers />} label="Grupy" itemPath="/groups" />
          <SidebarItem
            icon={<FiBell />}
            label="Powiadomienia"
            itemPath="/notifications"
          />
          <SidebarItem
            icon={<FiDollarSign />}
            label="Finanse"
            itemPath="/finances"
          />
          <SidebarItem
            icon={<PiChalkboardTeacherLight />}
            label="Prowadzący"
            itemPath="/list-lecturers"
          />
          <SidebarItem
            icon={<PiSlidersHorizontalLight />}
            label="Sterowniki"
            itemPath="/drivers"
          />
        </nav>
      </div>

      <div className="flex flex-col gap-4 text-sm">
        <SidebarItem
          icon={<MdOutlineBugReport />}
          label="Zgłoś błąd"
          itemPath="/report-bug"
        />
        <SidebarItem
          icon={<FiSettings />}
          label="Ustawienia"
          itemPath="/settings"
        />
        <SidebarItem icon={<FiLogOut />} label="Wyloguj" />
      </div>
    </div>
  );
}
