export default function ToggleSwitch({
  enabled = false,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-12
        h-7
        rounded-full
        transition
        relative

        ${
          enabled
            ? "bg-[#3046D3]"
            : "bg-gray-300"
        }
      `}
    >

      <div
        className={`
          absolute
          top-1
          w-5
          h-5
          bg-white
          rounded-full
          transition

          ${
            enabled
              ? "left-6"
              : "left-1"
          }
        `}
      />

    </button>
  );
}
