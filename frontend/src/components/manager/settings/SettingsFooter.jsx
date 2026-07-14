import { RotateCcw } from "lucide-react";

export default function SettingsFooter() {
  return (
    <div className="flex items-center justify-between mt-10">

      <button className="flex items-center gap-2 text-gray-500 hover:text-black">

        <RotateCcw size={18} />

        Reset Settings

      </button>

      <div className="flex gap-4">

        <button
          className="
            px-8
            py-3
            rounded-xl
            border
            hover:bg-gray-100
          "
        >
          Cancel
        </button>

        <button
          className="
            px-8
            py-3
            rounded-xl
            bg-[#3046D3]
            text-white
            hover:bg-[#253B80]
          "
        >
          Save Changes
        </button>

      </div>

    </div>
  );
}