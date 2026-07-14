import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";

export default function DashboardLayout({ title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F5F6FA] overflow-hidden">

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">

        {/* Topbar */}
        <Topbar
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page Content */}
        <main
          className="
            flex-1
            overflow-y-auto
            overflow-x-hidden
            p-4
            sm:p-6
            lg:p-8
          "
        >
          <Outlet />
        </main>

      </div>

    </div>
  );
}