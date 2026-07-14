export default function KPIStatCard({ item }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <p className="text-xs tracking-widest text-gray-400 uppercase">
        {item.title}
      </p>

      <h2 className="text-4xl font-bold text-[#253B80] mt-4">
        {item.value}
      </h2>

      <p className="text-green-500 text-sm mt-4">
        {item.subtitle}
      </p>

      {item.progress && (

        <div className="mt-5">

          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

            <div
              className="bg-[#2F3FE4] h-full rounded-full"
              style={{
                width: `${item.progress}%`
              }}
            />

          </div>

        </div>

      )}

    </div>
  );
}