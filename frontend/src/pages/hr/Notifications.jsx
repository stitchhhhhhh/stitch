import NotificationStats from "../../components/hr/notifications/NotificationStats";
import NotificationCard from "../../components/hr/notifications/NotificationCard";
import DeadlinePanel from "../../components/hr/notifications/DeadlinePanel";
import ApprovalPanel from "../../components/hr/notifications/ApprovalPanel";
import AlertAutomation from "../../components/hr/notifications/AlertAutomation";

export default function Notifications() {
  return (
    <div className="space-y-6">

      <NotificationStats />

      <div className="grid grid-cols-12 gap-6">

        <div className="col-span-8 space-y-5">

          <div className="flex justify-between items-center">

            <h2 className="text-2xl font-semibold">
              Recent Activity
            </h2>

            <div className="text-sm">
              <button className="text-[#2F3FE4] font-semibold">
                Mark all as read
              </button>

              <span className="mx-2 text-gray-300">|</span>

              <button className="text-gray-500">
                Clear all
              </button>
            </div>

          </div>

          <NotificationCard
            type="new"
            title="New Course Submission: AI Essentials"
            description="Jordan Smith has completed the 'Advanced AI for Enterprise' course and is requesting certification review."
            time="2 hours ago"
            category="General Training"
            badge="New"
          />

          <NotificationCard
            type="pending"
            title="Budget Proposal for Q3 Training"
            description="A new departmental training budget proposal has been drafted by the Engineering lead for your approval."
            time="5 hours ago"
            category="Reports"
            badge="Pending"
          />

          <NotificationCard
            type="success"
            title="LMS Security Update Completed"
            description="The scheduled maintenance for the LMS database is now complete. All user data has been synchronized."
            time="Yesterday"
            category="System"
            badge="Resolved"
          />

        </div>

        <div className="col-span-4 space-y-5">

          <DeadlinePanel />

          <ApprovalPanel />

          <AlertAutomation />

        </div>

      </div>

    </div>
  );
}