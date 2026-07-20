import { FileText, Video, FileSpreadsheet } from "lucide-react";

function getIcon(type) {
  switch (type) {
    case "video":
      return <Video size={22} className="text-blue-500" />;
    case "presentation":
      return <FileSpreadsheet size={22} className="text-orange-500" />;
    default:
      return <FileText size={22} className="text-red-500" />;
  }
}

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diffMs / 3600000);
  if (hours < 1) return "Baru saja";
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

export default function RecentMaterials({ materials = [], onViewAll, onUpload }) {
  const recent = [...materials]
    .sort((a, b) => new Date(b.uploaded_date) - new Date(a.uploaded_date))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 h-full">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#253B80]">
          Recent Materials
        </h2>
        <button onClick={onViewAll} className="text-[#3046D3] font-semibold">
          View All
        </button>
      </div>

      {recent.length === 0 ? (
        <p className="text-gray-400 text-sm">Belum ada materi diunggah.</p>
      ) : (
        <div className="space-y-5">
          {recent.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                {getIcon(item.material_type)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.material_title}</h3>
                <p className="text-sm text-gray-500">
                  Uploaded {timeAgo(item.uploaded_date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <button
          onClick={onViewAll}
          className="flex-1 border rounded-xl py-3 hover:bg-gray-100"
        >
          View Files
        </button>

        <button
          onClick={onUpload}
          className="flex-1 bg-[#3046D3] text-white rounded-xl py-3 hover:bg-[#253B80]"
        >
          Upload
        </button>
      </div>
    </div>
  );
}
