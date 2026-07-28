import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getMyCourses,
  getRecommendedCourses,
  getUpcomingDeadlines,
  getLearningActivity,
} from '../../services/courseService';
import { getCertificates, getLeaderboard } from '../../services/userService';

import emptyPicture from '../../assets/empty-picture.png';
import notificationImage from '../../assets/notification.png';
import capImage from '../../assets/topi1.png';

import StatsOverview from '../../components/dashboard/StatsOverview';
import CurrentCourseCard from '../../components/dashboard/CurrentCourseCard';
import TopLearners from '../../components/dashboard/TopLearners';
import UpcomingDeadlines from '../../components/dashboard/UpcomingDeadlines';
import RecommendedCourses from '../../components/dashboard/RecommendedCourses';
import LearningActivityChart from '../../components/dashboard/LearningActivityChart';

function EmployeeDashboardSkeleton() {
  return (
    <div
      className="space-y-6 animate-pulse"
      aria-label="Loading employee dashboard"
    >
      <div className="space-y-3">
        <div className="h-9 w-72 rounded-lg bg-gray-200" />
        <div className="h-4 w-96 max-w-full rounded bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 rounded-2xl border border-gray-100 bg-white p-5"
          >
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="mt-4 h-8 w-16 rounded bg-gray-200" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="h-80 rounded-3xl border border-gray-100 bg-white" />

        <div className="space-y-6">
          <div className="h-36 rounded-3xl border border-gray-100 bg-white" />
          <div className="h-36 rounded-3xl border border-gray-100 bg-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="h-72 rounded-3xl border border-gray-100 bg-white" />
        <div className="h-72 rounded-3xl border border-gray-100 bg-white" />
      </div>
    </div>
  );
}

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.user_id;

  const [loading, setLoading] = useState(true);
  const [myCourses, setMyCourses] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activity, setActivity] = useState({ daily: [], weekly: [] });
  const [activityRange, setActivityRange] = useState('weekly');
  const [error, setError] = useState('');
  const [secondaryError, setSecondaryError] = useState('');

  const resetDashboardData = useCallback(() => {
  setMyCourses([]);
  setRecommended([]);
  setDeadlines([]);
  setCertificates([]);
  setLeaderboard([]);
  setActivity({
    daily: [],
    weekly: [],
  });
}, []);

const loadDashboard = useCallback(async () => {
  if (!userId) {
    resetDashboardData();
    setError('');
    setSecondaryError('');
    setLoading(false);
    return;
  }

  setLoading(true);
  setError('');
  setSecondaryError('');

  try {
    const [
      coursesResult,
      recommendedResult,
      deadlinesResult,
      certificatesResult,
      leaderboardResult,
      activityResult,
    ] = await Promise.allSettled([
      getMyCourses(userId),
      getRecommendedCourses(userId),
      getUpcomingDeadlines(userId),
      getCertificates(userId),
      getLeaderboard(),
      getLearningActivity(),
    ]);

    /*
     * The employee course list is the main dashboard data.
     * A failure here prevents the dashboard from determining
     * the employee's assigned training.
     */
    if (coursesResult.status === 'rejected') {
      throw new Error('Unable to load your assigned courses.');
    }

    setMyCourses(
      Array.isArray(coursesResult.value)
        ? coursesResult.value
        : []
    );

    setRecommended(
      recommendedResult.status === 'fulfilled' &&
        Array.isArray(recommendedResult.value)
        ? recommendedResult.value
        : []
    );

    setDeadlines(
      deadlinesResult.status === 'fulfilled' &&
        Array.isArray(deadlinesResult.value)
        ? deadlinesResult.value
        : []
    );

    setCertificates(
      certificatesResult.status === 'fulfilled' &&
        Array.isArray(certificatesResult.value)
        ? certificatesResult.value
        : []
    );

    /*
     * Leaderboard failure must not block the dashboard.
     * It safely falls back to an empty array.
     */
    setLeaderboard(
      leaderboardResult.status === 'fulfilled' &&
        Array.isArray(leaderboardResult.value)
        ? leaderboardResult.value
        : []
    );

    setActivity(
      activityResult.status === 'fulfilled' &&
        activityResult.value &&
        typeof activityResult.value === 'object'
        ? activityResult.value
        : {
            daily: [],
            weekly: [],
          }
    );

    const optionalRequestsFailed = [
      recommendedResult,
      deadlinesResult,
      certificatesResult,
      leaderboardResult,
      activityResult,
    ].some((result) => result.status === 'rejected');

    if (optionalRequestsFailed) {
      setSecondaryError(
        'Some dashboard sections are temporarily unavailable. Your primary learning data is still displayed.'
      );
    }
  } catch (err) {
    console.error('EMPLOYEE DASHBOARD ERROR:', err);

    resetDashboardData();

    setError(
      err instanceof Error
        ? err.message
        : 'Unable to load the employee dashboard.'
    );
  } finally {
    setLoading(false);
  }
}, [resetDashboardData, userId]);

useEffect(() => {
  loadDashboard();
}, [loadDashboard]);

  if (loading) {
  return <EmployeeDashboardSkeleton />;
}

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
        <h2 className="font-bold">
          Dashboard could not be loaded
        </h2>

        <p className="text-sm mt-2">{error}</p>

        <button
          type="button"
          onClick={loadDashboard}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const hasCourses = myCourses.length > 0;
  const currentCourse =
    myCourses.find((c) => c.enrollment?.status === 'in_progress') || myCourses[0];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
      <p className="mt-2 text-gray-500">
        Welcome back{user?.full_name ? `, ${user.full_name}` : ''}. Here's what's happening with
        your learning profile.
      </p>

      {secondaryError && (
  <div
    role="status"
    className="mt-5 flex items-start justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800"
  >
    <p className="text-sm">{secondaryError}</p>

    <button
      type="button"
      onClick={loadDashboard}
      className="shrink-0 text-sm font-semibold underline"
    >
      Retry
    </button>
  </div>
)}

      {!hasCourses ? (
        <div className="mt-8 grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">

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
          </div>

          <div className="space-y-6">

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
                <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-lg text-sm">
                  0 New
                </span>
              </div>

              <img src={notificationImage} alt="Notification" className="w-20 mx-auto" />

              <h4 className="text-center text-lg font-semibold text-gray-800 mt-4">
                No new notifications
              </h4>

              <p className="text-center text-gray-500 mt-2 text-sm">
                We'll alert you when there's an update to your training schedule.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-5">Certificates</h3>

              <img src={capImage} alt="Certificates" className="w-16 h-16 mx-auto object-contain" />

              <p className="text-center text-gray-700 mt-4 font-medium">
                Start learning to earn your first certificate
              </p>

              <button
                onClick={() => navigate('/employee/certificates')}
                className="text-brand-500 font-semibold mt-4 w-full"
              >
                View available credentials
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-gray-900">Leaderboard</h3>
                <div className="mb-5 flex items-center justify-between">
  <h3 className="text-xl font-bold text-gray-900">
    Leaderboard
  </h3>

  <button
    type="button"
    onClick={() => navigate('/employee/leaderboard')}
    className="text-sm font-semibold text-brand-500"
  >
    View leaderboard
  </button>
</div>
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
      ) : (
        <div className="mt-8 space-y-6">

          <StatsOverview
            stats={{
              assigned: myCourses.length,
              completed: myCourses.filter((c) => c.enrollment?.status === 'completed').length,
              points: user?.total_points ?? 0,
              certificates: certificates.length,
            }}
          />

          <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
            <CurrentCourseCard course={currentCourse} />
            <TopLearners leaderboard={leaderboard} currentUserId={userId} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Learning Velocity</h3>
                  <p className="text-sm text-gray-500">
                    Your engagement hours over the last 30 days
                  </p>
                </div>

                <div className="flex bg-gray-100 rounded-full p-1 text-sm">
                  <button
                    onClick={() => setActivityRange('daily')}
                    className={`px-4 py-1.5 rounded-full font-medium transition ${
                      activityRange === 'daily'
                        ? 'bg-white shadow text-gray-900'
                        : 'text-gray-500'
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => setActivityRange('weekly')}
                    className={`px-4 py-1.5 rounded-full font-medium transition ${
                      activityRange === 'weekly'
                        ? 'bg-brand-500 text-white'
                        : 'text-gray-500'
                    }`}
                  >
                    Weekly
                  </button>
                </div>
              </div>

              <LearningActivityChart data={activity[activityRange] || []} />
            </div>

            <UpcomingDeadlines deadlines={deadlines} />
          </div>

          <RecommendedCourses courses={recommended} />
        </div>
      )}
    </div>
  );
}
