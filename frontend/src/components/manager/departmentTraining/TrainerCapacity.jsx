export default function TrainerCapacity() {

  const value = 78;

  return (

    <div className="bg-indigo-700 text-white rounded-3xl p-7">

      <h2 className="text-2xl font-bold">
        Trainer Capacity
      </h2>

      <p className="mt-2 text-indigo-100">
        Current IT trainer workload across active development.
      </p>

      <div className="text-5xl font-bold mt-8">

        {value}%

      </div>

      <div className="mt-6 w-full h-3 bg-indigo-400 rounded-full">

        <div
          className="bg-white h-3 rounded-full"
          style={{ width: `${value}%` }}
        />

      </div>

      <button className="mt-8 w-full bg-white text-indigo-700 rounded-xl py-3 font-semibold">

        View Capacity Map

      </button>

    </div>

  );
}