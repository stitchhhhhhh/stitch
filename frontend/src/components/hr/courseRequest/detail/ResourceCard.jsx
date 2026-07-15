export default function ResourceCard() {
  return (
    <div className="bg-white rounded-3xl shadow-sm border p-8">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold text-[#253B80]">
          Learning Resources
        </h2>

        <span className="text-sm text-gray-500">
          3 Files Uploaded
        </span>

      </div>

      <div className="grid grid-cols-3 gap-5">

        {[
          "Cloud Security.pdf",
          "AWS vs Azure.mp4",
          "Deployment.pptx",
        ].map((file) => (
          <div
            key={file}
            className="border rounded-2xl p-5 hover:shadow transition"
          >
            <div className="text-5xl mb-4">📄</div>

            <h3 className="font-semibold">
              {file}
            </h3>

            <p className="text-sm text-gray-500">
              Learning Material
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}