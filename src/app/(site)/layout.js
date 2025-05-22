import Sidebar from "@/components/main/Sidebar";
import Navbar from "@/components/main/Navbar";
import { Suspense } from "react";

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6  flex-1">{children}</main>
      </div>
    </div>
  );
}
