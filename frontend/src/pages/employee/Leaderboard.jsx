import { useEffect, useState } from "react";
import { getLeaderboard } from "../../services/userService";

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

const emptyStats = [
  {
    title: "Total Points",
    value: "0",
  },
  {
    title: "Current Rank",
    value: "-",
  },
  {
    title: "Courses Done",
    value: "0",
  },
  {
    title: "Badges Earned",
    value: "0",
  },
];

export default function Leaderboard() {
  const [loading, setLoading] = useState(true);
  const [rankings, setRankings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadLeaderboard() {
      try {
        setLoading(true);
        setError("");

        const data = await getLeaderboard();

        if (cancelled) return;

        const users = Array.isArray(data)
          ? data
          : Array.isArray(data?.users)
            ? data.users
            : Array.isArray(data?.leaderboard)
              ? data.leaderboard
              : [];

        const mapped = users
          .filter((user) => {
            const role = String(
              user.role_name ||
              user.role?.name ||
              user.role ||
              ""
            ).toUpperCase();

            return !role || role === "EMPLOYEE";
          })
          .map((user, index) => ({
            rank: index + 1,
            user_id: user.user_id ?? user.id,
            name: user.full_name || "Employee",
            email: user.email || "",
            department:
              user.department_name ||
              user.department?.name ||
              "-",
            points: Number(user.total_points || 0),
            image: avatarUrl(user.full_name),
            badges: 0,
          }));

        setRankings(mapped);
      } catch (loadError) {
        console.error(
          "LOAD LEADERBOARD ERROR:",
          loadError
        );

        if (!cancelled) {
          setError(
            loadError?.message ||
            "Failed to load leaderboard."
          );
          setRankings([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadLeaderboard();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-brand-600" />

          <p className="mt-4 text-sm text-gray-500">
            Loading leaderboard...
          </p>
        </div>
      </div>
    );
  }

  const topThree = rankings.slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-[#253B80]">
          Leaderboard
        </h1>

        <p className="mt-2 text-gray-500">
          Compete with your colleagues and celebrate your learning achievements.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {emptyStats.map((item) => (
          <LeaderboardStatCard
            key={item.title}
            {...item}
          />
        ))}
      </div>

      <TimeFilter />

      {topThree.length > 0 ? (
        <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-3">
          {topThree[1] && (
            <TopThreeCard user={topThree[1]} />
          )}

          {topThree[0] && (
            <TopThreeCard
              user={topThree[0]}
              center
            />
          )}

          {topThree[2] && (
            <TopThreeCard user={topThree[2]} />
          )}
        </div>
      ) : (
        <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-gray-200 bg-white">
          <div className="max-w-md px-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
              🏆
            </div>

            <h2 className="mt-4 text-lg font-bold text-gray-900">
              No Leaderboard Data Yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Employee rankings will appear after learning points are earned.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProgressSection />
        </div>

        <LatestAwards />
      </div>

      <RankingTable rankings={rankings} />
    </div>
  );
}