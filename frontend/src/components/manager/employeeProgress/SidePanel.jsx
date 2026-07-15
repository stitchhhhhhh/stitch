export default function SidePanel({
    title,
    items,
}) {

    return (

        <div className="bg-white rounded-xl shadow p-5">

            <h3 className="font-bold mb-4">
                {title}
            </h3>

            <div className="space-y-4">

                {items.map((item, i) => (

                    <div
                        key={i}
                        className="border-b pb-3 last:border-none"
                    >

                        <p className="font-medium">

                            {item.name || item.text}

                        </p>

                        {item.training && (

                            <p className="text-sm text-gray-500">
                                {item.training}
                            </p>

                        )}

                        {item.score && (

                            <p className="text-green-600 text-sm">
                                {item.score} Avg Score
                            </p>

                        )}

                        {item.remain && (

                            <p className="text-red-500 text-sm">
                                {item.remain}
                            </p>

                        )}

                        {item.time && (

                            <p className="text-xs text-gray-400">
                                {item.time}
                            </p>

                        )}

                    </div>

                ))}

            </div>

        </div>

    );

}