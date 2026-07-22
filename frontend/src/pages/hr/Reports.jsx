import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Award,
  BookOpen,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  exportTrainingReport,
  getTrainingReportSummary,
} from "../../services/hrService";

function StatCard({
  title,
  value,
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

export default function Reports() {
  const [summary, setSummary] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [exportingFormat, setExportingFormat] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const loadReportSummary =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getTrainingReportSummary();

        setSummary(data);
      } catch (requestError) {
        setError(
          requestError.message ||
            "Gagal mengambil data laporan"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadReportSummary();
  }, [loadReportSummary]);

  async function handleExport(format) {
    try {
      setExportingFormat(format);
      setError("");
      setSuccessMessage("");

      const result =
        await exportTrainingReport(format);

      setSuccessMessage(
        `${result.filename} berhasil diunduh.`
      );
    } catch (requestError) {
      setError(
        requestError.message ||
          "Gagal export laporan"
      );
    } finally {
      setExportingFormat("");
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-3 text-gray-600">
          <RefreshCw
            size={20}
            className="animate-spin"
          />

          Loading training reports...
        </div>
      </div>
    );
  }

  const recentEnrollments =
    summary?.recentEnrollments || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#253B80]">
            General Training Reports
          </h1>

          <p className="text-gray-500 mt-2">
            Generate and export real General
            Training data from the LMS database.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() =>
              handleExport("excel")
            }
            disabled={Boolean(
              exportingFormat
            )}
            className="bg-[#2F3FE4] disabled:opacity-60 text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#2433C7]"
          >
            {exportingFormat === "excel" ? (
              <RefreshCw
                size={18}
                className="animate-spin"
              />
            ) : (
              <FileSpreadsheet size={18} />
            )}

            {exportingFormat === "excel"
              ? "Exporting Excel..."
              : "Export Excel"}
          </button>

          <button
            type="button"
            onClick={() =>
              handleExport("pdf")
            }
            disabled={Boolean(
              exportingFormat
            )}
            className="bg-white disabled:opacity-60 border border-gray-200 text-gray-700 px-5 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            {exportingFormat === "pdf" ? (
              <RefreshCw
                size={18}
                className="animate-spin"
              />
            ) : (
              <FileText size={18} />
            )}

            {exportingFormat === "pdf"
              ? "Exporting PDF..."
              : "Export PDF"}
          </button>

          <button
            type="button"
            onClick={loadReportSummary}
            className="bg-white border border-gray-200 text-gray-700 px-5 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-100 p-4 rounded-xl">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 text-green-700 border border-green-100 p-4 rounded-xl flex items-center gap-2">
          <CheckCircle2 size={18} />
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Employees Trained"
          value={
            summary?.employeesTrained ?? 0
          }
          icon={Users}
          iconClassName="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Courses Completed"
          value={
            summary?.coursesCompleted ?? 0
          }
          icon={BookOpen}
          iconClassName="bg-green-50 text-green-600"
        />

        <StatCard
          title="Certificates Issued"
          value={
            summary?.certificatesIssued ?? 0
          }
          icon={Award}
          iconClassName="bg-orange-50 text-orange-600"
        />

        <StatCard
          title="Completion Rate"
          value={`${
            summary?.completionRate ?? 0
          }%`}
          icon={TrendingUp}
          iconClassName="bg-purple-50 text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Available Export Formats
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Reports contain only Employee
                enrollments from General Training
                Programs.
              </p>
            </div>

            <Download className="text-[#2F3FE4]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-7">
            <button
              type="button"
              disabled={Boolean(
                exportingFormat
              )}
              onClick={() =>
                handleExport("excel")
              }
              className="text-left border border-gray-200 hover:border-[#2F3FE4] hover:bg-blue-50/40 rounded-2xl p-5 transition disabled:opacity-60"
            >
              <div className="w-11 h-11 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                <FileSpreadsheet size={22} />
              </div>

              <h3 className="font-bold text-gray-900 mt-4">
                Excel Report
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Spreadsheet with filters, employee
                data, program, course, trainer,
                progress, status, and deadline.
              </p>
            </button>

            <button
              type="button"
              disabled={Boolean(
                exportingFormat
              )}
              onClick={() =>
                handleExport("pdf")
              }
              className="text-left border border-gray-200 hover:border-[#2F3FE4] hover:bg-blue-50/40 rounded-2xl p-5 transition disabled:opacity-60"
            >
              <div className="w-11 h-11 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                <FileText size={22} />
              </div>

              <h3 className="font-bold text-gray-900 mt-4">
                PDF Report
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Printable General Training report
                containing the latest employee
                enrollment records.
              </p>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            Report Summary
          </h2>

          <div className="space-y-5 mt-7">
            <div className="flex justify-between items-center border-b pb-4">
              <span className="text-gray-500">
                Total Assignments
              </span>

              <span className="font-bold">
                {summary?.totalEnrollments ?? 0}
              </span>
            </div>

            <div className="flex justify-between items-center border-b pb-4">
              <span className="text-gray-500">
                Completed
              </span>

              <span className="font-bold text-green-600">
                {summary?.coursesCompleted ?? 0}
              </span>
            </div>

            <div className="flex justify-between items-center border-b pb-4">
              <span className="text-gray-500">
                Employees
              </span>

              <span className="font-bold">
                {summary?.employeesTrained ?? 0}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">
                Completion Rate
              </span>

              <span className="font-bold text-[#2F3FE4]">
                {summary?.completionRate ?? 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Recent Training Records
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Preview of the records included in the
            exported report.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Employee
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Department
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Program
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Course
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Trainer
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Progress
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Assigned
                </th>
              </tr>
            </thead>

            <tbody>
              {recentEnrollments.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-12 text-gray-400"
                  >
                    No General Training records
                    available.
                  </td>
                </tr>
              ) : (
                recentEnrollments.map(
                  (record, index) => (
                    <tr
                      key={`${record.employeeEmail}-${record.courseTitle}-${index}`}
                      className="border-t"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {
                            record.employeeName
                          }
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {
                            record.employeeEmail
                          }
                        </p>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {record.department}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {record.programName}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {record.courseTitle}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {record.trainerName}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {record.progress}%
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusBadgeClass(
                            record.enrollmentStatus
                          )}`}
                        >
                          {formatStatus(
                            record.enrollmentStatus
                          )}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(
                          record.assignedDate
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