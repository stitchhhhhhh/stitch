import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCourseDetail, reviewCourse } from "../../services/hrService";

export default function CourseRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCourseDetail(id).then(setCourse).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [id]);

  async function handleReview(status) {
    const note = status === "rejected" ? window.prompt("Enter the rejection reason:") : "";
    if (status === "rejected" && !note) return;
    try {
      await reviewCourse(id, status, note);
      navigate("/hr/course-requests");
    } catch (e) {
      alert(e.message);
    }
  }

  if (loading) return <div className="bg-white rounded-3xl p-8">Loading course details...</div>;
  if (error) return <div className="bg-red-50 text-red-600 rounded-3xl p-8">{error}</div>;
  if (!course) return <div className="bg-white rounded-3xl p-8">Course not found.</div>;

  return <div className="space-y-6"><div className="text-sm text-gray-500"><Link to="/hr/course-requests" className="text-[#2F3FE4]">Course Requests</Link> / {course.course_title}</div>
    <div className="flex justify-between items-start"><div><span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm capitalize">{course.approval_status}</span><h1 className="text-4xl font-bold text-[#253B80] mt-4">{course.course_title}</h1><p className="text-gray-500 mt-2 max-w-3xl">{course.description || "No description available."}</p></div></div>
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6"><div className="xl:col-span-8 space-y-6"><div className="bg-white rounded-3xl p-8 shadow-sm"><h2 className="text-xl font-semibold">Course Overview</h2><div className="grid grid-cols-2 gap-6 mt-6"><div><p className="text-gray-400 text-sm">Program</p><p className="font-semibold">{course.program?.program_name || "Not assigned"}</p></div><div><p className="text-gray-400 text-sm">Trainer</p><p className="font-semibold">{course.trainer?.full_name || "Not assigned"}</p></div><div><p className="text-gray-400 text-sm">Deadline</p><p className="font-semibold">{course.deadline ? new Date(course.deadline).toLocaleDateString() : "Not set"}</p></div><div><p className="text-gray-400 text-sm">Created</p><p className="font-semibold">{new Date(course.created_date).toLocaleDateString()}</p></div></div></div><div className="bg-white rounded-3xl p-8 shadow-sm"><h2 className="text-xl font-semibold">Learning Materials</h2>{course.materials?.length ? <div className="mt-5 space-y-3">{course.materials.map((m) => <div key={m.id} className="border rounded-xl p-4 flex justify-between"><span>{m.material_title}</span><a href={m.file_url} target="_blank" rel="noreferrer" className="text-[#2F3FE4]">View</a></div>)}</div> : <p className="text-gray-400 mt-6">No learning materials uploaded.</p>}</div></div>
      <div className="xl:col-span-4 space-y-6"><div className="bg-white rounded-3xl p-8 shadow-sm"><h2 className="text-xl font-semibold">Assessments</h2>{course.assessments?.length ? course.assessments.map((a) => <div key={a.id} className="border-b py-4"><p className="font-semibold">{a.title}</p><p className="text-sm text-gray-500">Passing score: {a.passing_score}%</p></div>) : <p className="text-gray-400 mt-6">No assessments available.</p>}</div>{course.approval_status === "submitted" && <div className="bg-white rounded-3xl p-8 shadow-sm space-y-3"><button onClick={() => handleReview("approved")} className="w-full bg-[#2F3FE4] text-white py-3 rounded-xl">Approve Course</button><button onClick={() => handleReview("rejected")} className="w-full border border-red-400 text-red-500 py-3 rounded-xl">Reject Course</button></div>}</div></div>
  </div>;
}
