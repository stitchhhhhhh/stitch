export default function KPIStatCard({
    title,
    value,
    subtitle,
    color
}) {
    return (
        <div className="bg-white rounded-3xl shadow-sm p-6">

            <div className="flex justify-between">

                <div>

                    <h4 className="text-gray-600">
                        {title}
                    </h4>

                    <h2 className="text-5xl font-bold text-indigo-700 mt-3">
                        {value}
                    </h2>

                    <p className="text-gray-500 text-sm mt-3">
                        {subtitle}
                    </p>

                </div>

                <div className={`${color} w-12 h-12 rounded-xl`} />

            </div>

        </div>
    );
}