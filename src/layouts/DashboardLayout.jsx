import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';

export default function DashboardLayout({ title }) {
  return (
    <div className="flex h-screen bg-[#F5F6FA] overflow-hidden">

      {/* Sidebar */}
      <div className="w-[260px] min-w-[260px]">
        <Sidebar />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Topbar title={title} />

        <main className="p-8">
          <Outlet />
        </main>
      </div>

    </div>
  );
}