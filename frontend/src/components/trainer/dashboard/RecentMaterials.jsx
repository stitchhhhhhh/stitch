import {
  FileText,
  Video,
  FileSpreadsheet,
} from "lucide-react";

function getIcon(type) {
  const normalizedType =
    typeof type === "string"
      ? type.toLowerCase()
      : "";

  switch (normalizedType) {
    case "video":
      return (
        <Video
          size={22}
          className="text-blue-500"
        />
      );

    case "presentation":
      return (
        <FileSpreadsheet
          size={22}
          className="text-orange-500"
        />
      );

    default:
      return (
        <FileText
          size={22}
          className="text-red-500"
        />
      );
  }
}

function timeAgo(dateString) {
  if (!dateString) {
    return "Unknown date";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  const difference =
    Date.now() - date.getTime();

  if (difference < 0) {
    return "Just now";
  }

  const minutes = Math.floor(
    difference / 60000
  );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} ${
      minutes === 1 ? "minute" : "minutes"
    } ago`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours} ${
      hours === 1 ? "hour" : "hours"
    } ago`;
  }

  const days = Math.floor(
    hours / 24
  );

  return `${days} ${
    days === 1 ? "day" : "days"
  } ago`;
}

export default function RecentMaterials({
  materials = [],
  onViewAll,
  onUpload,
  uploadDisabled = false,
}) {
  const recent = [...materials]
    .filter(Boolean)
    .sort(
      (first, second) =>
        new Date(
          second.uploaded_date
        ).getTime() -
        new Date(
          first.uploaded_date
        ).getTime()
    )
    .slice(0, 5);

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#253B80]">
          Recent Materials
        </h2>

        <button
          type="button"
          onClick={onViewAll}
          className="text-[#3046D3] font-semibold hover:underline"
        >
          View All
        </button>
      </div>

      {recent.length === 0 ? (
        <p className="text-gray-400 text-sm">
          No uploaded materials.
        </p>
      ) : (
        <div className="space-y-5">
          {recent.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                {getIcon(
                  item.material_type
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">
                  {item.material_title ||
                    "Untitled Material"}
                </h3>

                <p className="text-sm text-gray-500">
                  Uploaded{" "}
                  {timeAgo(
                    item.uploaded_date
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={onViewAll}
          className="flex-1 border rounded-xl py-3 hover:bg-gray-100"
        >
          View Files
        </button>

        <button
          type="button"
          onClick={onUpload}
          disabled={uploadDisabled}
          title={
            uploadDisabled
              ? "Create a course before uploading materials."
              : "Upload learning material"
          }
          className="flex-1 bg-[#3046D3] text-white rounded-xl py-3 hover:bg-[#253B80] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:bg-gray-300"
        >
          Upload
        </button>
      </div>
    </div>
  );
}
