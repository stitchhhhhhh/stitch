export default function FilterBar({
  statusFilter,
  onFilterChange,
  proposals = [],
}) {
  function handleExport() {
    const rows = [
      [
        "Title",
        "Status",
        "Submitted By",
        "Date",
      ],
      ...proposals.map((proposal) => [
        proposal.proposal_title ||
          proposal.title ||
          "",
        proposal.status || "",
        proposal.submitter?.full_name ||
          proposal.submitter?.name ||
          "",
        proposal.submitted_date || "",
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(
                value ?? ""
              ).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "hr-training-proposals.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold text-[#253B80]">
          Training Proposals
        </h1>

        <p className="text-gray-500 mt-2">
          Review and approve department training proposals.
        </p>
      </div>

      <div className="flex gap-3">
        <select
          value={statusFilter}
          onChange={(e) =>
            onFilterChange(e.target.value)
          }
          className="border rounded-xl px-5 py-3 bg-white"
        >
          <option value="all">
            All Status
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="approved">
            Approved
          </option>

          <option value="rejected">
            Rejected
          </option>

          <option value="revision">
            Revision
          </option>
        </select>

        <button
          type="button"
          onClick={handleExport}
          className="bg-[#4453F2] text-white px-6 py-3 rounded-xl"
        >
          Export Report
        </button>
      </div>
    </div>
  );
}