import { useEffect, useState } from "react";
import { getAllCourses, reviewCourse } from "../../services/hrService";

import RequestStats from "../../components/hr/courseRequest/RequestStats";
import RequestCard from "../../components/hr/courseRequest/RequestCard";
import RequestDetail from "../../components/hr/courseRequest/RequestDetail";

export default function CourseRequests() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("submitted");

  async function loadCourses() {
  try {
    setLoading(true);

    const data = await getAllCourses();

    setCourses(
      Array.isArray(data) ? data : []
    );
  } catch (err) {
    console.error(
      "LOAD COURSE REQUESTS ERROR:",
      err
    );

    alert(
      err?.message ||
        "Gagal memuat course requests."
    );

    setCourses([]);
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    loadCourses();
  }, []);

  async function handleApprove(courseId) {
  const confirmed = window.confirm(
    "Apakah kamu yakin ingin menyetujui course ini?"
  );

  if (!confirmed) return;

  try {
    await reviewCourse(
      courseId,
      "approved"
    );

    await loadCourses();
    setSelected(null);

    alert("Course berhasil disetujui.");
  } catch (err) {
    alert(
      err?.message ||
        "Gagal menyetujui course."
    );
  }
}

  async function handleReject(courseId) {
  const reason = window.prompt(
    "Masukkan alasan penolakan:"
  );

  if (!reason) return;

  try {
    await reviewCourse(
      courseId,
      "rejected",
      reason
    );

    await loadCourses();
    setSelected(null);

    alert("Course berhasil ditolak.");
  } catch (err) {
    alert(
      err?.message ||
        "Gagal menolak course."
    );
  }
}

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading course requests...
      </div>
    );
  }

  const filteredCourses =
    filter === "all" ? courses : courses.filter((c) => c.approval_status === filter);

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-[#253B80]">
          Course Requests
        </h1>
        <p className="text-gray-500 mt-2">
          Review and approve submitted courses from trainers.
        </p>
      </div>

      <RequestStats courses={courses} />

      <div className="grid grid-cols-12 gap-8">

        <div className="col-span-8 space-y-5">

          <div className="flex gap-3">
            {["submitted", "approved", "rejected", "all"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-5 py-2 capitalize ${
                  filter === f ? "bg-[#2F3FE4] text-white" : "bg-[#EEF2FF] text-gray-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {filteredCourses.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center text-gray-400 border border-gray-100">
              Tidak ada kursus dengan status ini.
            </div>
          ) : (
            filteredCourses.map((course) => (
              <RequestCard
                key={course.id}
                course={course}
                onApprove={handleApprove}
                onReject={handleReject}
                onSelect={setSelected}
              />
            ))
          )}

        </div>

        <div className="col-span-4">
          <RequestDetail
            course={selected}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>

      </div>

    </div>
  );
}
