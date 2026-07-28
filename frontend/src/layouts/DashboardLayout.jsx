import { Outlet } from 'react-router-dom'

import Sidebar from '../components/common/Sidebar'
import Topbar from '../components/common/Topbar'

export default function DashboardLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Sidebar selalu ditampilkan */}
      <div className="h-screen w-[260px] min-w-[260px] shrink-0">
        <Sidebar />
      </div>

      {/* Main application area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Topbar selalu ditampilkan */}
        <div className="shrink-0">
          <Topbar />
        </div>

        {/* Page content */}
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="min-h-full p-4 sm:p-5 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}