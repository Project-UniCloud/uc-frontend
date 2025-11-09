import Sidebar from "@/components/main/Sidebar";
import Navbar from "@/components/main/Navbar";
import { ToastContainer, Bounce } from "react-toastify";

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
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
  );
}
