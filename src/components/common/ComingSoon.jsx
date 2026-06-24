export default function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <p className="text-sm font-medium text-gray-400">🚧 {title}</p>
      <p className="text-xs text-gray-400 mt-1">This page is coming soon.</p>
    </div>
  );
}
