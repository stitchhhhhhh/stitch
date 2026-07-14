export default function NotificationActionButton({
  text,
  secondary = false,
}) {
  return (
    <button
      className={`px-6 py-3 rounded-xl font-medium transition

      ${
        secondary
          ? "border bg-white hover:bg-gray-100"
          : "bg-[#3046D3] text-white hover:bg-[#253B80]"
      }`}
    >
      {text}
    </button>
  );
}