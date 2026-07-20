import { useEffect, useState } from "react";
import { getLeaderboard } from "../../services/userService";

import { stats } from "../../components/employee/leaderboard/leaderboardData";

import LeaderboardStatCard from "../../components/employee/leaderboard/LeaderboardStatCard";
import TimeFilter from "../../components/employee/leaderboard/TimeFilter";
import TopThreeCard from "../../components/employee/leaderboard/TopThreeCard";
import ProgressSection from "../../components/employee/leaderboard/ProgressSection";
import LatestAwards from "../../components/employee/leaderboard/LatestAwards";
import RankingTable from "../../components/employee/leaderboard/RankingTable";

function avatarUrl(name) {
  return `https://ui-avatars.com/api/?background=3046D3&color=fff&name=${encodeURIComponent(
    name || "User"
  )}`;
}

export default function Leaderboard() {
  const [loading, setLoading] = useState(true);
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    let isMounted = true;

    getLeaderboard().then((data) => {
      if (!isMounted) return;

      const mapped = data.map((u, index) => ({
        rank: index + 1,
        user_id: u.user_id,
        name: u.full_name,
        email: u.email,
        department: u.department_name,
        points: u.total_points,
        image: avatarUrl(u.full_name),
        // Catatan: sistem badge belum ada di database — sementara default 0
        badges: 0,
      }));

      setRankings(mapped);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading leaderboard...
      </div>
    );
  }

  const topThree = rankings.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-[#253B80]">Leaderboard</h1>
        <p className="text-gray-500 mt-2">
          Compete with your colleagues and celebrate your learning achievements.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((item) => (
          <LeaderboardStatCard key={item.title} {...item} />
        ))}
      </div>

      {/* Filter */}
      <TimeFilter />

      {/* Podium */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-3 gap-6 items-end">
          <TopThreeCard user={topThree[1]} />
          <TopThreeCard user={topThree[0]} center />
          <TopThreeCard user={topThree[2]} />
        </div>
      )}

      {/* Progress */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <ProgressSection />
        </div>
        <LatestAwards />
      </div>

      {/* Table */}
      <RankingTable rankings={rankings} />
    </div>
  );
}
