import { useState } from 'react';

export default function CourseDetail() {
  const [activeTab, setActiveTab] = useState('materials');

  return (
    <div className="space-y-6">

      {/* HERO */}
      <div className="bg-[#3F46E8] rounded-[32px] p-8 text-white">
        <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-xs font-semibold">
          LEVEL 3 • ADVANCED
        </div>

        <h1 className="text-5xl font-bold mt-6">
          Advanced Project Management
        </h1>

        <p className="mt-4 max-w-3xl text-white/80 text-lg">
          Mastering complex delivery lifecycles, risk mitigation strategies,
          and stakeholder engagement for enterprise-level initiatives.
        </p>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_1fr] gap-6">

        {/* LEFT */}
        <div className="bg-white rounded-3xl p-6">

          {/* TAB */}
          <div className="flex gap-8 border-b mb-8">

            <button
              onClick={() => setActiveTab('materials')}
              className={`pb-4 font-medium ${
                activeTab === 'materials'
                  ? 'text-[#3F46E8] border-b-2 border-[#3F46E8]'
                  : 'text-gray-500'
              }`}
            >
              Materials
            </button>

            <button
              onClick={() => setActiveTab('assessment')}
              className={`pb-4 font-medium ${
                activeTab === 'assessment'
                  ? 'text-[#3F46E8] border-b-2 border-[#3F46E8]'
                  : 'text-gray-500'
              }`}
            >
              Assessment
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`pb-4 font-medium ${
                activeTab === 'progress'
                  ? 'text-[#3F46E8] border-b-2 border-[#3F46E8]'
                  : 'text-gray-500'
              }`}
            >
              Progress Details
            </button>

          </div>

          {/* MATERIALS */}
          {activeTab === 'materials' && (
            <div className="space-y-6">

              <h2 className="text-3xl font-bold">
                Module 1: Strategic Planning
              </h2>

              <div className="border-b pb-5">
                <h3 className="font-semibold">
                  Foundations of Enterprise Complexity
                </h3>

                <p className="text-sm text-gray-500">
                  Video Lesson • 18:45
                </p>
              </div>

              <div className="border-b pb-5">
                <h3 className="font-semibold">
                  Risk Mitigation Framework (v4.2)
                </h3>

                <p className="text-sm text-gray-500">
                  PDF Document • 2.4 MB
                </p>
              </div>

              <div className="border-b pb-5">
                <h3 className="font-semibold">
                  Stakeholder Matrix Workshop
                </h3>

                <p className="text-sm text-gray-500">
                  Presentation • 12 Slides
                </p>
              </div>

            </div>
          )}

          {/* ASSESSMENT */}
          {activeTab === 'assessment' && (
            <div>

              <h2 className="text-3xl font-bold mb-6">
                Module Assessment
              </h2>

              <div className="border rounded-2xl p-6">

                <h3 className="font-semibold text-lg">
                  Strategic Planning Quiz
                </h3>

                <p className="text-gray-500 mt-2">
                  20 Questions • Passing Score 75%
                </p>

                <button className="mt-5 bg-[#3F46E8] text-white px-5 py-3 rounded-xl">
                  import { useNavigate } from 'react-router-dom';
                  const navigate = useNavigate();

                  <button
                    onClick={() => navigate('/employee/assessment/1')}
                    className="bg-[#3F46E8] text-white px-5 py-3 rounded-xl"
                    >
                    Start Assessment
                  </button>
                </button>

              </div>

            </div>
          )}

          {/* PROGRESS */}
          {activeTab === 'progress' && (
            <div>

              <h2 className="text-3xl font-bold mb-6">
                Learning Progress
              </h2>

              <div className="space-y-5">

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Video Lessons</span>
                    <span>80%</span>
                  </div>

                  <div className="h-3 bg-gray-100 rounded-full">
                    <div className="h-3 bg-[#3F46E8] rounded-full w-[80%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Assignments</span>
                    <span>60%</span>
                  </div>

                  <div className="h-3 bg-gray-100 rounded-full">
                    <div className="h-3 bg-[#3F46E8] rounded-full w-[60%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Overall Completion</span>
                    <span>75%</span>
                  </div>

                  <div className="h-3 bg-gray-100 rounded-full">
                    <div className="h-3 bg-[#3F46E8] rounded-full w-[75%]"></div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          <div className="bg-white rounded-3xl p-6">
            <p className="text-gray-500 uppercase text-sm">
              Course Progress
            </p>

            <h2 className="text-5xl font-bold text-[#3F46E8] mt-4">
              75%
            </h2>

            <div className="h-3 bg-gray-100 rounded-full mt-5">
              <div className="h-3 w-[75%] bg-[#3F46E8] rounded-full"></div>
            </div>

            <button className="w-full mt-6 bg-[#3F46E8] text-white py-4 rounded-xl">
              Continue Learning →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}