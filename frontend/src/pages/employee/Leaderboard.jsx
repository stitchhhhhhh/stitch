import {
  stats,
  topThree,
} from "../../components/employee/leaderboard/leaderboardData";

import LeaderboardStatCard from "../../components/employee/leaderboard/LeaderboardStatCard";
import TimeFilter from "../../components/employee/leaderboard/TimeFilter";
import TopThreeCard from "../../components/employee/leaderboard/TopThreeCard";
import ProgressSection from "../../components/employee/leaderboard/ProgressSection";
import LatestAwards from "../../components/employee/leaderboard/LatestAwards";
import RankingTable from "../../components/employee/leaderboard/RankingTable";

export default function Leaderboard() {
  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-4xl font-bold text-[#253B80]">
          Leaderboard
        </h1>

        <p className="text-gray-500 mt-2">
          Compete with your colleagues and celebrate your learning achievements.
        </p>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-4 gap-6">

        {stats.map((item) => (

          <LeaderboardStatCard
            key={item.title}
            {...item}
          />

        ))}

      </div>

      {/* Filter */}

      <TimeFilter />

      {/* Podium */}

      <div className="grid grid-cols-3 gap-6 items-end">

        <TopThreeCard
          user={topThree[0]}
        />

        <TopThreeCard
          user={topThree[1]}
          center
        />

        <TopThreeCard
          user={topThree[2]}
        />

      </div>

      {/* Progress */}

      <div className="grid grid-cols-3 gap-6">

        <div className="col-span-2">

          <ProgressSection />

        </div>

        <LatestAwards />

      </div>

      {/* Table */}

      <RankingTable />

    </div>
  );
}