import { useState } from "react";
import { useNavigate } from "react-router-dom";

import KPIStatCard from "../../components/manager/departmentTraining/KPIStatCard";
import CoursePipelineCard from "../../components/manager/departmentTraining/CoursePipelineCard";
import UpcomingDeadlines from "../../components/manager/departmentTraining/UpcomingDeadlines";
import RecentActivities from "../../components/manager/departmentTraining/RecentActivities";
import TrainerCapacity from "../../components/manager/departmentTraining/TrainerCapacity";

import {
  stats,
  courses,
} from "../../components/manager/departmentTraining/departmentTrainingData";

export default function DepartmentTraining() {
  const navigate = useNavigate();

  const [viewMode, setViewMode] =
    useState("list");

  function handleCourseAction(course, action) {
    const normalized =
      action?.toLowerCase() || "";

    if (normalized.includes("analytics")) {
      navigate("/manager/analytics");
      return;
    }

    if (normalized.includes("enrollment")) {
      navigate("/manager/progress");
      return;
    }

    if (normalized.includes("view course")) {
      alert(
        `Membuka course: ${course.title}`
      );
      return;
    }

    if (normalized.includes("review")) {
      const confirmed = window.confirm(
        `Review course "${course.title}"?`
      );

      if (confirmed) {
        alert(
          `Course "${course.title}" dibuka untuk proses review.`
        );
      }

      return;
    }

    if (normalized.includes("publish")) {
      const confirmed = window.confirm(
        `Publish training "${course.title}"?`
      );

      if (confirmed) {
        alert(
          "Training siap dipublikasikan. Endpoint backend publish belum dihubungkan."
        );
      }

      return;
    }

    if (normalized.includes("deadline")) {
      const deadline = window.prompt(
        "Masukkan deadline dengan format YYYY-MM-DD:"
      );

      if (!deadline) return;

      alert(
        `Deadline ${deadline} dipilih untuk "${course.title}".`
      );

      return;
    }

    if (normalized.includes("revision")) {
      const reason = window.prompt(
        `Masukkan alasan revisi untuk "${course.title}":`
      );

      if (!reason) return;

      alert(
        `Revision request berhasil dibuat.\nAlasan: ${reason}`
      );

      return;
    }

    alert(
      `${action} untuk course "${course.title}"`
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-indigo-700">
            Department Training
          </h1>

          <p className="text-gray-500 mt-2">
            Manage IT department training programs and course development.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            alert(
              "Pemilihan quarter belum dihubungkan."
            )
          }
          className="px-6 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
        >
          Quarter 4, 2023
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <KPIStatCard
            key={index}
            {...item}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              Course Lifecycle Pipeline
            </h2>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setViewMode("list")
                }
                className={`w-10 h-10 rounded-lg border ${
                  viewMode === "list"
                    ? "bg-indigo-600 text-white"
                    : "bg-white"
                }`}
              >
                ☰
              </button>

              <button
                type="button"
                onClick={() =>
                  setViewMode("grid")
                }
                className={`w-10 h-10 rounded-lg border ${
                  viewMode === "grid"
                    ? "bg-indigo-600 text-white"
                    : "bg-white"
                }`}
              >
                ⊞
              </button>
            </div>
          </div>

          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 gap-6"
                : "space-y-6"
            }
          >
            {courses.map((course, index) => (
              <CoursePipelineCard
                key={index}
                course={course}
                onAction={handleCourseAction}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <UpcomingDeadlines />
          <RecentActivities />
          <TrainerCapacity />
        </div>
      </div>
    </div>
  );
}