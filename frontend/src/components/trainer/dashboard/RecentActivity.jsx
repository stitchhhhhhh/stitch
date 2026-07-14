import { activities } from "./dashboardData";
import {
  CheckCircle2,
  AlertTriangle,
  Rocket,
} from "lucide-react";

export default function RecentActivity() {
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <CheckCircle2
            size={22}
            className="text-green-500"
          />
        );

      case "warning":
        return (
          <AlertTriangle
            size={22}
            className="text-red-500"
          />
        );

      default:
        return (
          <Rocket
            size={22}
            className="text-[#3046D3]"
          />
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 h-full">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold text-[#253B80]">
          Recent Activity
        </h2>

        <button className="text-[#3046D3] font-semibold">
          View All
        </button>

      </div>

      <div className="space-y-6">

        {activities.map((item) => (

          <div
            key={item.id}
            className="flex gap-4"
          >

            <div className="mt-1">
              {getIcon(item.type)}
            </div>

            <div>

              <h3 className="font-semibold">
                {item.title}
              </h3>

              <p className="text-sm text-gray-500">
                {item.time}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}