import {
  stats,
  courses,
} from "../../components/trainer/my-courses/courseData";

import CourseStatCard from "../../components/trainer/my-courses/CourseStatCard";
import FilterBar from "../../components/trainer/my-courses/FilterBar";
import CourseCard from "../../components/trainer/my-courses/CourseCard";
import QuickActions from "../../components/trainer/my-courses/QuickActions";
import RecentActivities from "../../components/trainer/my-courses/RecentActivities";

export default function MyCourses() {
  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-4xl font-bold text-[#253B80]">
            My Courses
          </h1>

          <p className="text-gray-500 mt-2">
            Manage assigned training courses and development progress.
          </p>

        </div>

        <button className="bg-[#3046D3] text-white px-6 py-3 rounded-xl hover:bg-[#253B80] transition">

          + Create New Course

        </button>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-4 gap-6">

        {stats.map((item) => (

          <CourseStatCard
            key={item.title}
            {...item}
          />

        ))}

      </div>

      {/* Filter */}

      <FilterBar />

      {/* Content */}

      <div className="grid grid-cols-4 gap-8">

        {/* Left */}

        <div className="col-span-3">

          <div className="grid grid-cols-2 gap-6">

            {courses.map((course) => (

              <CourseCard
                key={course.id}
                course={course}
              />

            ))}

          </div>

        </div>

        {/* Right */}

        <div className="space-y-6">

          <QuickActions />

          <RecentActivities />

        </div>

      </div>

    </div>
  );
}