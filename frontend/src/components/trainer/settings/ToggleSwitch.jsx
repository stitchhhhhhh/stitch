export default function ToggleSwitch({
  enabled,
  onChange,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (!disabled) {
          onChange?.(!enabled);
        }
      }}
      disabled={disabled}
      aria-pressed={enabled}
      className={`
        w-12
        h-7
        rounded-full
        relative
        transition
        focus:outline-none
        focus:ring-2
        focus:ring-[#3046D3]
        focus:ring-offset-2

        ${enabled ? "bg-[#3046D3]" : "bg-gray-300"}
        ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
      `}
    >
      <span
        className={`
          absolute
          top-1
          w-5
          h-5
          bg-white
          rounded-full
          transition-all

          ${enabled ? "left-6" : "left-1"}
        `}
      />
    </button>
  );
}
