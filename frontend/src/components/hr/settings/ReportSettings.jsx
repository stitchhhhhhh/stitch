import { useState } from "react";

export default function ReportSettings() {

  const [format,setFormat]=useState("PDF");

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">

      <h2 className="font-semibold text-xl mb-8">
        📈 Report Preferences
      </h2>

      <div className="grid grid-cols-2 gap-12">

        <div>

          <p className="text-xs font-bold text-gray-500 mb-4">
            DEFAULT EXPORT FORMAT
          </p>

          <div className="flex rounded-xl overflow-hidden border w-fit">

            {["PDF","Excel"].map((f)=>(

              <button
                key={f}
                onClick={()=>setFormat(f)}
                className={`px-8 py-3 ${
                  format===f
                    ? "bg-[#EEF2FF] text-[#2F3FE4] font-bold"
                    : "bg-white"
                }`}
              >
                {f}
              </button>

            ))}

          </div>

        </div>

        <div className="space-y-3">

          <label className="flex gap-3">
            <input type="checkbox" defaultChecked />
            Include Department Statistics
          </label>

          <label className="flex gap-3">
            <input type="checkbox" defaultChecked />
            Include Employee Details
          </label>

        </div>

      </div>

    </div>
  );
}