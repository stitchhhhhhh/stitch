export default function StatCard({ title, value, color }) {
  const styles = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-700",
    },
    gray: {
      bg: "bg-gray-100",
      text: "text-gray-700",
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-600",
    },
    primary: {
      bg: "bg-[#3046D3]",
      text: "text-white",
    },
  };

  const style = styles[color];

  return (
    <div
      className={`
        rounded-3xl
        shadow-sm
        p-6
        ${style.bg}
      `}
    >
      <h2
        className={`
          text-4xl
          font-bold
          ${style.text}
        `}
      >
        {value}
      </h2>

      <p
        className={`
          mt-3
          font-medium
          ${style.text}
        `}
      >
        {title}
      </p>
    </div>
  );
}