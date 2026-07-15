import { assessmentScores } from "./analyticsData";

export default function AssessmentScores() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <h2 className="font-bold text-xl text-[#253B80] mb-6">
        Assessment Scores
      </h2>

      <div className="space-y-5">

        {assessmentScores.map((item, index) => (

          <div key={index}>

            <div className="flex justify-between mb-2">

              <span>{item.course}</span>

              <span className="font-bold">
                {item.score}%
              </span>

            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full">

              <div
                className="h-3 rounded-full bg-[#4453F2]"
                style={{
                  width: `${item.score}%`,
                }}
              />

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}