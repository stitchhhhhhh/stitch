import { TrendingUp } from "lucide-react";

export default function EngagementCard() {
  return (
    <div className="bg-[#2F3FE4] rounded-3xl p-8 text-white h-full flex flex-col justify-center">

      <p className="text-lg opacity-90">
        Engagement Rate
      </p>

      <h1 className="text-5xl font-bold mt-5">
        92.4%
      </h1>

      <div className="flex items-center gap-2 mt-6">

        <TrendingUp size={18} />

        <span>
          +5.2% vs last quarter
        </span>

      </div>

    </div>
  );
}