export default function AssessmentPage() {
  return (
    <div className="bg-white rounded-3xl p-8">
      <h1 className="text-3xl font-bold">
        Strategic Planning Quiz
      </h1>

      <p className="mt-4 text-gray-500">
        This assessment contains 20 questions.
      </p>

      <div className="mt-8 border rounded-2xl p-6">
        <h2 className="font-semibold">
          Question 1 of 20
        </h2>

        <p className="mt-4">
          What is the primary purpose of project planning?
        </p>

        <div className="mt-4 space-y-3">
          <label className="block">
            <input type="radio" name="q1" /> Define project objectives
          </label>

          <label className="block">
            <input type="radio" name="q1" /> Hire employees
          </label>

          <label className="block">
            <input type="radio" name="q1" /> Calculate payroll
          </label>

          <label className="block">
            <input type="radio" name="q1" /> Manage inventory
          </label>
        </div>

        <button className="mt-8 bg-[#3F46E8] text-white px-5 py-3 rounded-xl">
          Next Question
        </button>
      </div>
    </div>
  );
}