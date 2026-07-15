export default function ApprovalPanel() {
  const approvals = [
    {
      name: "Robert Chen",
      course: "Python Fundamentals",
    },
    {
      name: "Alice Vance",
      course: "Sales Negotiation Lab",
    },
    {
      name: "John Doe",
      course: "Cybersecurity Advanced",
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <div className="flex justify-between items-center">

        <h2 className="text-2xl font-semibold">
          Pending Approvals
        </h2>

        <span className="bg-[#EEF2FF] text-[#2F3FE4] px-3 py-2 rounded-xl font-semibold">
          4 Items
        </span>

      </div>

      <div className="mt-6 space-y-5">

        {approvals.map((item) => (

          <div
            key={item.name}
            className="flex justify-between items-center"
          >

            <div className="flex gap-3">

              <div className="w-11 h-11 rounded-full bg-[#EEF2FF] flex items-center justify-center font-semibold">
                {item.name[0]}
              </div>

              <div>

                <p className="font-semibold">
                  {item.name}
                </p>

                <p className="text-gray-500 text-sm">
                  {item.course}
                </p>

              </div>

            </div>

            <button className="text-[#2F3FE4] text-xl">
              ✓
            </button>

          </div>

        ))}

      </div>

      <button className="mt-8 text-[#2F3FE4] font-semibold w-full">
        Go to Approval Hub
      </button>

    </div>
  );
}