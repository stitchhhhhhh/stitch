import { useEffect, useState } from "react";
import {
  Outlet,
  useLocation,
} from "react-router-dom";
import {
  Menu,
  X,
} from "lucide-react";

import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const location = useLocation();

  /*
   * Tutup sidebar secara otomatis saat user
   * memilih menu dan berpindah halaman.
   */
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  /*
   * Mencegah halaman belakang ikut scroll
   * ketika drawer sedang terbuka.
   */
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Sidebar desktop */}
      <aside className="hidden h-screen shrink-0 lg:block">
        <Sidebar />
      </aside>

      {/* Mobile/sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/40"
          />

          {/* Drawer */}
          <aside className="relative z-10 h-full w-[280px] max-w-[85vw] animate-[slideIn_0.2s_ease-out] bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation menu"
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-gray-600 shadow-sm transition hover:bg-gray-100"
            >
              <X size={22} />
            </button>

            <div className="h-full overflow-y-auto">
              <Sidebar />
            </div>
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header untuk browser kecil/setengah */}
        <header className="flex h-16 shrink-0 items-center border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-gray-100"
          >
            <Menu size={25} />
          </button>

          <div className="ml-3">
            <h1 className="text-base font-bold text-gray-900">
              Learning Company
            </h1>

            <p className="text-xs text-gray-400">
              Learning Management System
            </p>
          </div>
        </header>

        {/* Topbar desktop */}
        <div className="hidden shrink-0 lg:block">
          <Topbar />
        </div>

        {/* Page content */}
        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="min-h-full p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}