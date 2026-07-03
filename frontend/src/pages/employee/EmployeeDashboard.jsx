import emptyPicture from '../../assets/empty-picture.png';
import notificationImage from '../../assets/notification.png';
import capImage from '../../assets/topi1.png';

export default function EmployeeDashboard() {
  return (
    <div>
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900">
        Dashboard Overview
      </h1>

      <p className="mt-2 text-gray-500">
        Welcome back. Here's what's happening with your learning profile.
      </p>

      {/* Main Grid */}
      <div className="mt-8 grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">

        {/* LEFT */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">

          <img
            src={emptyPicture}
            alt="No training"
            className="w-[82%] mx-auto rounded-2xl"
          />

          <h2 className="text-center text-2xl font-bold text-gray-900 mt-8">
            No Training Assigned Yet
          </h2>

          <p className="text-center text-gray-500 mt-4 leading-8 max-w-xl mx-auto">
            You currently do not have any assigned training courses.
            Please wait for HR or your Department Manager to assign training.
            In the meantime, feel free to explore our self-paced catalog.
          </p>

          <div className="flex justify-center mt-8">
            <button className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-full font-medium transition">
              Request Training →
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          {/* Notifications */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-gray-900">
                Notifications
              </h3>

              <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-lg text-sm">
                0 New
              </span>
            </div>

            <img
              src={notificationImage}
              alt="Notification"
              className="w-20 mx-auto"
            />

            <h4 className="text-center text-lg font-semibold text-gray-800 mt-4">
              No new notifications
            </h4>

            <p className="text-center text-gray-500 mt-2 text-sm">
              We'll alert you when there's an update to your training schedule.
            </p>

          </div>

          {/* Certificates */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

            <h3 className="text-xl font-bold text-gray-900 mb-5">
              Certificates
            </h3>

            <img
              src={capImage}
              alt="Certificates"
              className="w-16 h-16 mx-auto object-contain"
            />

            <p className="text-center text-gray-700 mt-4 font-medium">
              Start learning to earn your first certificate
            </p>

            <button className="text-brand-500 font-semibold mt-4 w-full">
              View available credentials
            </button>

          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-gray-900">
                Leaderboard
              </h3>

              <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                COMING SOON
              </span>
            </div>

            <div className="bg-gray-100 rounded-full px-5 py-3 text-center text-gray-600 text-sm">
              Leaderboard is currently empty
            </div>

            <div className="mt-5 space-y-3">
              <div className="h-3 bg-gray-100 rounded-full"></div>
              <div className="h-3 bg-gray-100 rounded-full"></div>
              <div className="h-3 bg-gray-100 rounded-full"></div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}