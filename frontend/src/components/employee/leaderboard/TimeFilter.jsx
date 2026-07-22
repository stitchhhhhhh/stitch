import { useState } from "react";

const OPTIONS = ["Monthly", "Quarterly", "All Time"];

export default function TimeFilter({ onChange }) {
  const [active, setActive] = useState("Monthly");

  function handleClick(option) {
    setActive(option);
    onChange?.(option);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-2 flex">
      {OPTIONS.map((option) => (
        <button
          key={option}
          onClick={() => handleClick(option)}
          className={
            active === option
              ? "bg-[#3046D3] text-white px-6 py-3 rounded-xl font-medium"
              : "px-6 py-3 rounded-xl text-gray-600 hover:bg-gray-100"
          }
        >
          {option}
        </button>
      ))}
    </div>
  );
}
