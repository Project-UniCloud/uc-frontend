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
import { useState, useEffect } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/utils/permissions";
import { usePathname } from "next/navigation";

export default function Sidebar({ userRole }) {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { checkAccess } = usePermissions(userRole);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <div
        className="hidden md:w-52 lg:w-60  bg-purple md:flex flex-col justify-between p-4 text-white"
        suppressHydrationWarning
      >
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
            {isMounted && checkAccess(PERMISSIONS.DASHBOARD) && (
              <SidebarItem
                icon={<FiGrid />}
                label="Przegląd"
                itemPath="/dashboard"
              />
            )}

            {isMounted && checkAccess(PERMISSIONS.GROUPS) && (
              <SidebarItem
                icon={<FiUsers />}
                label="Grupy"
                itemPath="/groups"
              />
            )}
            {isMounted && checkAccess(PERMISSIONS.NOTIFICATIONS) && (
              <SidebarItem icon={<FiBell />} label="Logi" itemPath="/logs" />
            )}

            {isMounted && checkAccess(PERMISSIONS.LECTURERS) && (
              <SidebarItem
                icon={<PiChalkboardTeacherLight />}
                label="Prowadzący"
                itemPath="/list-lecturers"
              />
            )}
            {isMounted && checkAccess(PERMISSIONS.DRIVERS) && (
              <SidebarItem
                icon={<PiSlidersHorizontalLight />}
                label="Sterowniki"
                itemPath="/drivers"
              />
            )}
          </nav>
        </div>

        <div className="flex flex-col gap-4 text-sm">
          <SidebarItem
            icon={<MdOutlineBugReport />}
            label="Zgłoś błąd"
            itemPath="https://michalluczak.atlassian.net/servicedesk/customer/portals"
          />
          <SidebarItem
            icon={<FiLogOut />}
            label="Wyloguj"
            onClick={() => setIsLogoutOpen(true)}
          />
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-purple text-white px-2 py-2">
        <nav className="flex items-center justify-around gap-2 text-[10px]">
          {isMounted && checkAccess(PERMISSIONS.DASHBOARD) && (
            <Link href="/dashboard">
              <button
                type="button"
                aria-label="Przegląd"
                className={
                  "flex flex-col items-center gap-1 px-2 py-1 rounded-md transition-all " +
                  (pathname === "/dashboard"
                    ? "bg-white text-black"
                    : "hover:bg-white hover:text-black")
                }
              >
                <span className="text-lg">
                  <FiGrid />
                </span>
                <span>Przegląd</span>
              </button>
            </Link>
          )}

          {isMounted && checkAccess(PERMISSIONS.GROUPS) && (
            <Link href="/groups">
              <button
                type="button"
                aria-label="Grupy"
                className={
                  "flex flex-col items-center gap-1 px-2 py-1 rounded-md transition-all " +
                  (pathname === "/groups"
                    ? "bg-white text-black"
                    : "hover:bg-white hover:text-black")
                }
              >
                <span className="text-lg">
                  <FiUsers />
                </span>
                <span>Grupy</span>
              </button>
            </Link>
          )}

          {isMounted && checkAccess(PERMISSIONS.NOTIFICATIONS) && (
            <Link href="/logs">
              <button
                type="button"
                aria-label="Logi"
                className={
                  "flex flex-col items-center gap-1 px-2 py-1 rounded-md transition-all " +
                  (pathname === "/logs"
                    ? "bg-white text-black"
                    : "hover:bg-white hover:text-black")
                }
              >
                <span className="text-lg">
                  <FiBell />
                </span>
                <span>Logi</span>
              </button>
            </Link>
          )}

          {isMounted && checkAccess(PERMISSIONS.LECTURERS) && (
            <Link href="/list-lecturers">
              <button
                type="button"
                aria-label="Prowadzący"
                className={
                  "flex flex-col items-center gap-1 px-2 py-1 rounded-md transition-all " +
                  (pathname === "/list-lecturers"
                    ? "bg-white text-black"
                    : "hover:bg-white hover:text-black")
                }
              >
                <span className="text-lg">
                  <PiChalkboardTeacherLight />
                </span>
                <span>Prowadzący</span>
              </button>
            </Link>
          )}

          {isMounted && checkAccess(PERMISSIONS.DRIVERS) && (
            <Link href="/drivers">
              <button
                type="button"
                aria-label="Sterowniki"
                className={
                  "flex flex-col items-center gap-1 px-2 py-1 rounded-md transition-all " +
                  (pathname === "/drivers"
                    ? "bg-white text-black"
                    : "hover:bg-white hover:text-black")
                }
              >
                <span className="text-lg">
                  <PiSlidersHorizontalLight />
                </span>
                <span>Sterowniki</span>
              </button>
            </Link>
          )}

          <a
            href="https://michalluczak.atlassian.net/servicedesk/customer/portals"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              type="button"
              aria-label="Zgłoś błąd"
              className="flex flex-col items-center gap-1 px-2 py-1 rounded-md transition-all hover:bg-white hover:text-black"
            >
              <span className="text-lg">
                <MdOutlineBugReport />
              </span>
              <span>Błąd</span>
            </button>
          </a>

          <button
            type="button"
            aria-label="Wyloguj"
            className="flex flex-col items-center gap-1 px-2 py-1 rounded-md transition-all hover:bg-white hover:text-black"
            onClick={() => setIsLogoutOpen(true)}
          >
            <span className="text-lg">
              <FiLogOut />
            </span>
            <span>Wyloguj</span>
          </button>
        </nav>
      </div>

      <LogoutModal isOpen={isLogoutOpen} setIsOpen={setIsLogoutOpen} />
    </>
  );
}
