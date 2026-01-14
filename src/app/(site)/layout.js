import Sidebar from "@/components/main/Sidebar";
import Navbar from "@/components/main/Navbar";
import { ToastContainer, Bounce } from "react-toastify";
import { headers } from "next/headers";
import { RolesProvider } from "@/contexts/RolesContext";

export default async function MainLayout({ children }) {
  const headerList = await headers();
  const userRole = headerList.get("x-user-role") || "";

  return (
    <RolesProvider userRole={userRole}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar userRole={userRole} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="p-6 flex-1 overflow-auto mt-1">
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              transition={Bounce}
            />
            {children}
          </main>
        </div>
      </div>
    </RolesProvider>
  );
}
