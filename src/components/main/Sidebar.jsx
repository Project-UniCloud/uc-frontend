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
import { LogoutModal } from "@/components/logout/LogoutModal";
import { useState } from "react";

export default function Sidebar() {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  return (
    <>
      <div className="hidden md:w-52 lg:w-60  bg-purple md:flex flex-col justify-between p-4 text-white">
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
              disabled
            />
            <SidebarItem
              icon={<FiDollarSign />}
              label="Finanse"
              itemPath="/finances"
              disabled
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
            itemPath="https://michalluczak.atlassian.net/servicedesk/customer/portals"
          />
          <SidebarItem
            icon={<FiSettings />}
            label="Ustawienia"
            itemPath="/settings"
            disabled
          />
          <SidebarItem
            icon={<FiLogOut />}
            label="Wyloguj"
            onClick={() => setIsLogoutOpen(true)}
          />
        </div>
      </div>
      <LogoutModal isOpen={isLogoutOpen} setIsOpen={setIsLogoutOpen} />
    </>
  );
}
