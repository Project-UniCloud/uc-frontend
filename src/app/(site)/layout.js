import Sidebar from "@/components/main/Sidebar";
import Navbar from "@/components/main/Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="p-6 flex-1 overflow-auto mt-1">{children}</main>
      </div>
    </div>
  );
}
