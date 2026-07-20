import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  Award,
  BookOpen,
  CheckCircle2,
  Clock3,
  FileCheck2,
  GraduationCap,
  RefreshCw,
  Target,
  Users,
} from "lucide-react";

import { getCompanyAnalytics } from "../../services/hrService";

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName,
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            {value}
          </h2>

          {description && (
            <p className="text-xs text-gray-400 mt-2">
              {description}
            </p>
          )}
        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconClassName}`}
        >
          <Icon size={23} />
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ value }) {
  const safeValue = Math.min(
    100,
    Math.max(0, Number(value) || 0)
  );

  return (
    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-[#2F3FE4] rounded-full transition-all duration-500"
        style={{
          width: `${safeValue}%`,
        }}
      />
    </div>
  );
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString(
    "en-US",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function formatStatus(status) {
  if (!status) return "-";

  return String(status)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function statusBadgeClass(status) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700";

    case "in_progress":
      return "bg-blue-100 text-blue-700";

    case "assigned":
      return "bg-orange-100 text-orange-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function Analytics() {
  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getCompanyAnalytics();

      setAnalytics(data);
    } catch (requestError) {
      setError(
        requestError.message ||
          "Gagal mengambil analytics HR"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const maximumMonthlyValue = useMemo(() => {
    const monthlyTrend =
      analytics?.monthlyTrend || [];

    const values = monthlyTrend.flatMap(
      (item) => [
        Number(item.assigned) || 0,
        Number(item.completed) || 0,
      ]
    );

    return Math.max(1, ...values);
  }, [analytics]);

  const totalCourseStatus = useMemo(() => {
    return (
      analytics?.courseStatusDistribution?.reduce(
        (total, item) =>
          total + (Number(item.total) || 0),
        0
      ) || 0
    );
  }, [analytics]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-3 text-gray-600">
          <RefreshCw
            size={20}
            className="animate-spin"
          />

          Loading HR analytics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 text-red-700 border border-red-100 rounded-2xl p-6">
          {error}
        </div>

        <button
          type="button"
          onClick={loadAnalytics}
          className="bg-[#2F3FE4] text-white px-5 py-3 rounded-xl flex items-center gap-2"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      </div>
    );
  }

  const monthlyTrend =
    analytics?.monthlyTrend || [];

  const departmentPerformance =
    analytics?.departmentPerformance || [];

  const recentEnrollments =
    analytics?.recentEnrollments || [];

  const courseStatusDistribution =
    analytics?.courseStatusDistribution || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#253B80]">
            HR Training Analytics
          </h1>

          <p className="text-gray-500 mt-2">
            Real-time General Training analytics
            from the LMS database.
          </p>
        </div>

        <button
          type="button"
          onClick={loadAnalytics}
          className="border border-gray-200 bg-white hover:bg-gray-50 px-5 py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <RefreshCw size={18} />
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Active Employees"
          value={analytics?.totalEmployees ?? 0}
          description="Active users with Employee role"
          icon={Users}
          iconClassName="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="General Programs"
          value={
            analytics?.totalGeneralPrograms ?? 0
          }
          description="General training programs"
          icon={GraduationCap}
          iconClassName="bg-purple-50 text-purple-600"
        />

        <StatCard
          title="General Courses"
          value={
            analytics?.totalGeneralCourses ?? 0
          }
          description="Courses under General Programs"
          icon={BookOpen}
          iconClassName="bg-green-50 text-green-600"
        />

        <StatCard
          title="Pending Course Reviews"
          value={
            analytics?.pendingCourseReviews ?? 0
          }
          description="Submitted courses awaiting HR review"
          icon={Clock3}
          iconClassName="bg-orange-50 text-orange-600"
        />

        <StatCard
          title="Total Assignments"
          value={
            analytics?.totalEnrollments ?? 0
          }
          description="General course enrollments"
          icon={FileCheck2}
          iconClassName="bg-indigo-50 text-indigo-600"
        />

        <StatCard
          title="Completed Enrollments"
          value={
            analytics?.completedEnrollments ?? 0
          }
          description="Completed General Training"
          icon={CheckCircle2}
          iconClassName="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Completion Rate"
          value={`${
            analytics?.completionRate ?? 0
          }%`}
          description="Completed divided by assignments"
          icon={Target}
          iconClassName="bg-pink-50 text-pink-600"
        />

        <StatCard
          title="Average Assessment Score"
          value={
            analytics?.averageAssessmentScore ?? 0
          }
          description="Average employee assessment score"
          icon={Activity}
          iconClassName="bg-cyan-50 text-cyan-600"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="mb-7">
            <h2 className="text-xl font-bold text-gray-900">
              Monthly Training Activity
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Assignments and completed enrollments
              during the last six months.
            </p>
          </div>

          {monthlyTrend.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No monthly activity available.
            </div>
          ) : (
            <div className="h-72 flex items-end gap-4 overflow-x-auto pb-2">
              {monthlyTrend.map((item) => {
                const assignedHeight =
                  (Number(item.assigned || 0) /
                    maximumMonthlyValue) *
                  210;

                const completedHeight =
                  (Number(item.completed || 0) /
                    maximumMonthlyValue) *
                  210;

                return (
                  <div
                    key={item.key}
                    className="min-w-[90px] flex-1"
                  >
                    <div className="h-[220px] flex items-end justify-center gap-2">
                      <div
                        title={`Assigned: ${item.assigned}`}
                        className="w-7 bg-blue-200 rounded-t-md min-h-[4px]"
                        style={{
                          height: `${Math.max(
                            4,
                            assignedHeight
                          )}px`,
                        }}
                      />

                      <div
                        title={`Completed: ${item.completed}`}
                        className="w-7 bg-[#2F3FE4] rounded-t-md min-h-[4px]"
                        style={{
                          height: `${Math.max(
                            4,
                            completedHeight
                          )}px`,
                        }}
                      />
                    </div>

                    <p className="text-xs text-center text-gray-500 mt-3">
                      {item.month}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-200" />
              Assigned
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#2F3FE4]" />
              Completed
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Course Status
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                General course distribution.
              </p>
            </div>

            <BookOpen className="text-[#2F3FE4]" />
          </div>

          <div className="space-y-5 mt-8">
            {courseStatusDistribution.length ===
            0 ? (
              <p className="text-gray-400 text-sm">
                No course data available.
              </p>
            ) : (
              courseStatusDistribution.map(
                (item) => {
                  const percentage =
                    totalCourseStatus > 0
                      ? (
                          (item.total /
                            totalCourseStatus) *
                          100
                        ).toFixed(1)
                      : 0;

                  return (
                    <div key={item.status}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-700">
                          {item.label}
                        </span>

                        <span className="font-semibold">
                          {item.total}
                        </span>
                      </div>

                      <ProgressBar
                        value={percentage}
                      />
                    </div>
                  );
                }
              )
            )}
          </div>

          <div className="border-t mt-8 pt-5 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Certificates Issued
            </span>

            <div className="flex items-center gap-2 font-bold text-gray-900">
              <Award
                size={18}
                className="text-orange-500"
              />

              {analytics?.certificatesIssued ?? 0}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Department Performance
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            General Training completion by
            department.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Department
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Assigned
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Completed
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  In Progress
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Completion Rate
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Average Progress
                </th>
              </tr>
            </thead>

            <tbody>
              {departmentPerformance.length ===
              0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-gray-400"
                  >
                    No department enrollment data
                    available.
                  </td>
                </tr>
              ) : (
                departmentPerformance.map(
                  (department) => (
                    <tr
                      key={
                        department.departmentId
                      }
                      className="border-t"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {
                          department.departmentName
                        }
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {
                          department.totalEnrollments
                        }
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {
                          department.completedEnrollments
                        }
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {
                          department.inProgressEnrollments
                        }
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-28">
                            <ProgressBar
                              value={
                                department.completionRate
                              }
                            />
                          </div>

                          <span className="text-sm font-medium">
                            {
                              department.completionRate
                            }
                            %
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {
                          department.averageProgress
                        }
                        %
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Recent General Training Assignments
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Latest employee enrollments from the
            database.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Employee
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Department
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Course
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Progress
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Assigned Date
                </th>
              </tr>
            </thead>

            <tbody>
              {recentEnrollments.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-gray-400"
                  >
                    No recent enrollments available.
                  </td>
                </tr>
              ) : (
                recentEnrollments.map(
                  (enrollment) => (
                    <tr
                      key={
                        enrollment.enrollmentId
                      }
                      className="border-t"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {
                          enrollment.employeeName
                        }
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {
                          enrollment.department
                        }
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {
                          enrollment.courseTitle
                        }
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24">
                            <ProgressBar
                              value={
                                enrollment.completionPercentage
                              }
                            />
                          </div>

                          <span className="text-sm">
                            {
                              enrollment.completionPercentage
                            }
                            %
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusBadgeClass(
                            enrollment.status
                          )}`}
                        >
                          {formatStatus(
                            enrollment.status
                          )}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(
                          enrollment.assignedDate
                        )}
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}