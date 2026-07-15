import { useEffect, useState } from 'react';
import { Award, Download, Share2, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getCertificates } from '../../services/userService';
import { getMyCourses } from '../../services/courseService';

// Warna gradasi thumbnail Credential Library, dirotasi per kartu biar nggak monoton
const THUMB_GRADIENTS = [
  'from-slate-800 to-slate-600',
  'from-brand-900 to-brand-600',
  'from-gray-200 to-gray-100',
];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function CertificatesPage() {
  const { user } = useAuth();
  const userId = user?.user_id ?? 1;

  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [inProgress, setInProgress] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const [certsRes, coursesRes] = await Promise.all([
        getCertificates(userId),
        getMyCourses(userId),
      ]);

      if (!isMounted) return;

      setCertificates(certsRes);
      setInProgress(
        coursesRes.filter((c) => (c.enrollment?.completion_percentage ?? 0) < 100)
      );
      setLoading(false);
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading certificates...
      </div>
    );
  }

  const latest = certificates.find((c) => c.is_latest) || certificates[0];
  const libraryItems = certificates.filter((c) => c.certificate_id !== latest?.certificate_id);

  return (
    <div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
          <p className="mt-2 text-gray-500">
            Exceptional work{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}!
            Your dedication to professional growth is paying off.
          </p>
        </div>

        <div className="bg-brand-500 text-white rounded-2xl px-5 py-3 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
            <Award size={20} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-white/70">Total Earned</p>
            <p className="text-2xl font-bold leading-none mt-1">{certificates.length}</p>
          </div>
        </div>
      </div>

      {/* Latest Achievement */}
      {latest && (
        <div className="mt-6 bg-brand-50/60 rounded-3xl p-6 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-center">

          {/* Certificate preview card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
              <ShieldCheck size={22} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{latest.certificate_title}</h3>
            <p className="text-sm text-gray-400 mt-1">{latest.category}</p>

            <div className="w-16 h-px bg-gray-200 my-4" />

            <p className="text-sm font-semibold text-brand-600">
              {(user?.full_name || 'EMPLOYEE').toUpperCase()}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Issued on {formatDate(latest.issue_date)} • ID: {latest.certificate_number}
            </p>
          </div>

          {/* Latest achievement info */}
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              LATEST ACHIEVEMENT
            </span>

            <h2 className="text-2xl font-bold text-gray-900">{latest.certificate_title}</h2>

            <p className="text-gray-500 mt-3 text-sm leading-relaxed max-w-lg">
              {latest.description}
            </p>

            <button className="mt-6 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition">
              <Download size={16} /> Download PDF
            </button>
          </div>
        </div>
      )}

      {/* Credential Library */}
      {libraryItems.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-bold text-gray-900 mb-5">Credential Library</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {libraryItems.map((cert, i) => (
              <div
                key={cert.certificate_id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div
                  className={`h-32 bg-gradient-to-br ${THUMB_GRADIENTS[i % THUMB_GRADIENTS.length]} flex items-center justify-center`}
                >
                  <Award size={32} className="text-white/70" />
                </div>

                <div className="p-5">
                  <h4 className="font-bold text-gray-900">{cert.certificate_title}</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Issued: {formatDate(cert.issue_date)}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-[11px] font-mono text-gray-400">
                      ID: {cert.certificate_number}
                    </span>
                    <button className="flex items-center gap-1 text-sm font-semibold text-brand-500 hover:text-brand-600">
                      Share <Share2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificates in Progress */}
      {inProgress.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-bold text-gray-900">Certificates in Progress</h3>
          <p className="text-sm text-gray-500 mt-1 mb-5">
            Complete these modules to unlock your new credentials.
          </p>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
            {inProgress.map((course) => {
              const progress = course.enrollment?.completion_percentage ?? 0;
              const hoursLeft = course.enrollment?.estimated_hours_left ?? null;

              return (
                <div
                  key={course.course_id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-5"
                >
                  <div className="relative w-11 h-11 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
                    <Lock size={18} />
                    <span className="absolute -top-2 -right-2 bg-brand-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {progress}%
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{course.course_title}</p>
                    <div className="h-2 bg-gray-100 rounded-full mt-2 max-w-md">
                      <div
                        className="h-2 bg-brand-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {hoursLeft != null && (
                      <div className="text-right">
                        <p className="text-[11px] text-gray-400">Estimated Finish</p>
                        <p className="text-sm font-semibold text-gray-700">
                          {hoursLeft} hours left
                        </p>
                      </div>
                    )}

                    <button className="border border-brand-500 text-brand-600 hover:bg-brand-50 text-sm font-semibold px-5 py-2 rounded-xl transition">
                      Resume
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}