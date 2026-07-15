import {
  CheckCircle2,
  BookOpen,
  Award,
  MessageCircle,
} from "lucide-react";

const activities = [
  {
    icon: CheckCircle2,
    user: "John Doe",
    action: "completed",
    target: "Cyber Security 101",
    time: "2 minutes ago",
  },
  {
    icon: BookOpen,
    user: "Sarah Williams",
    action: "enrolled in",
    target: "Leadership Essentials",
    time: "15 minutes ago",
  },
  {
    icon: Award,
    user: "Michael Chen",
    action: "earned",
    target: "Project Management Expert badge",
    time: "1 hour ago",
  },
  {
    icon: MessageCircle,
    user: "Emily Blunt",
    action: "posted a review for",
    target: "Public Speaking 2.0",
    time: "2 hours ago",
  },
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">

      <h2 className="text-xl font-semibold mb-8">
        Recent Employee Activity
      </h2>

      <div className="space-y-8">

        {activities.map((item, index) => {

          const Icon = item.icon;

          return (
            <div
              key={index}
              className="flex gap-4"
            >

              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">

                <Icon
                  size={22}
                  className="text-[#2F3FE4]"
                />

              </div>

              <div>

                <p className="text-gray-800 leading-relaxed">

                  <span className="font-semibold">
                    {item.user}
                  </span>{" "}

                  {item.action}{" "}

                  <span className="text-[#2F3FE4] font-semibold">
                    {item.target}
                  </span>

                </p>

                <p className="text-gray-500 text-sm mt-1">
                  {item.time}
                </p>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}