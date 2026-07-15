import { materials } from "./dashboardData";
import {
  FileText,
  Video,
  FileSpreadsheet,
} from "lucide-react";

export default function RecentMaterials() {
  const getIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText size={22} className="text-red-500" />;

      case "video":
        return <Video size={22} className="text-blue-500" />;

      default:
        return (
          <FileSpreadsheet
            size={22}
            className="text-orange-500"
          />
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 h-full">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold text-[#253B80]">
          Recent Materials
        </h2>

        <button className="text-[#3046D3] font-semibold">
          View All
        </button>

      </div>

      <div className="space-y-5">

        {materials.map((item) => (

          <div
            key={item.id}
            className="flex items-center gap-4"
          >

            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">

              {getIcon(item.type)}

            </div>

            <div className="flex-1">

              <h3 className="font-semibold">
                {item.file}
              </h3>

              <p className="text-sm text-gray-500">
                Uploaded {item.time}
              </p>

            </div>

          </div>

        ))}

      </div>

      <div className="mt-8 flex gap-3">

        <button
          className="
            flex-1
            border
            rounded-xl
            py-3
            hover:bg-gray-100
          "
        >
          View Files
        </button>

        <button
          className="
            flex-1
            bg-[#3046D3]
            text-white
            rounded-xl
            py-3
            hover:bg-[#253B80]
          "
        >
          Upload
        </button>

      </div>

    </div>
  );
}