export default function TimeFilter() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-2 flex">

      <button
        className="
          bg-[#3046D3]
          text-white
          px-6
          py-3
          rounded-xl
          font-medium
        "
      >
        Monthly
      </button>

      <button
        className="
          px-6
          py-3
          rounded-xl
          text-gray-600
          hover:bg-gray-100
        "
      >
        Quarterly
      </button>

      <button
        className="
          px-6
          py-3
          rounded-xl
          text-gray-600
          hover:bg-gray-100
        "
      >
        All Time
      </button>

    </div>
  );
}