import {
  Users,
  BadgeCheck,
  Award,
  GraduationCap,
} from "lucide-react";

const stats = [
  {
    title: "Total Employees",
    value: "1,240",
    sub: "+2.4% from last month",
    icon: Users,
  },
  {
    title: "Completion Rate",
    value: "84%",
    sub: "",
    icon: BadgeCheck,
    progress: 84,
  },
  {
    title: "Active Learners",
    value: "912",
    sub: "73% of total workforce",
    icon: GraduationCap,
  },
  {
    title: "Certificates Issued",
    value: "450",
    sub: "12% increase YOY",
    icon: Award,
  },
];

export default function AnalyticsStats() {
  return (
    <div className="grid grid-cols-4 gap-6">

      {stats.map((item) => {

        const Icon = item.icon;

        return (

          <div
            key={item.title}
            className="bg-white rounded-3xl p-6 shadow-sm"
          >

            <div className="flex justify-between">

              <div>

                <p className="text-gray-500">
                  {item.title}
                </p>

                <h2 className="text-3xl font-bold mt-4">
                  {item.value}
                </h2>

                <p className="text-xs text-[#2F3FE4] mt-2 font-semibold">
                  {item.sub}
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] flex items-center justify-center">

                <Icon
                  size={22}
                  className="text-[#2F3FE4]"
                />

              </div>

            </div>

            {item.progress && (

              <div className="mt-6">

                <div className="w-full bg-gray-200 rounded-full h-2">

                  <div
                    className="bg-[#2F3FE4] h-2 rounded-full"
                    style={{
                      width: `${item.progress}%`,
                    }}
                  />

                </div>

              </div>

            )}

          </div>

        );

      })}

    </div>
  );
}