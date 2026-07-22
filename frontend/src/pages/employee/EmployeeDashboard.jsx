import { useEffect, useState } from 'react';
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

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      if (!userId) {
        if (isMounted) {
          setMyCourses([]);
          setRecommended([]);
          setDeadlines([]);
          setCertificates([]);
          setLeaderboard([]);
          setActivity({ daily: [], weekly: [] });
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError('');

        const [
          coursesRes,
          recommendedRes,
          deadlinesRes,
          certificatesRes,
          leaderboardRes,
          activityRes,
        ] = await Promise.all([
          getMyCourses(userId),
          getRecommendedCourses(userId),
          getUpcomingDeadlines(userId),
          getCertificates(userId),
          getLeaderboard(),
          getLearningActivity(),
        ]);

        if (!isMounted) return;

        setMyCourses(
          Array.isArray(coursesRes) ? coursesRes : []
        );
        setRecommended(
          Array.isArray(recommendedRes) ? recommendedRes : []
        );
        setDeadlines(
          Array.isArray(deadlinesRes) ? deadlinesRes : []
        );
        setCertificates(
          Array.isArray(certificatesRes) ? certificatesRes : []
        );
        setLeaderboard(
          Array.isArray(leaderboardRes) ? leaderboardRes : []
        );
        setActivity(
          activityRes && typeof activityRes === 'object'
            ? activityRes
            : { daily: [], weekly: [] }
        );
      } catch (err) {
        if (!isMounted) return;

        console.error('EMPLOYEE DASHBOARD ERROR:', err);

        setError(
          err?.message || 'Failed to load dashboard.'
        );

        setMyCourses([]);
        setRecommended([]);
        setDeadlines([]);
        setCertificates([]);
        setLeaderboard([]);
        setActivity({ daily: [], weekly: [] });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading dashboard...
      </div>
    );
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
          onClick={() => window.location.reload()}
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
