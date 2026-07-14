import NotificationActionButton from "./NotificationActionButton";

export default function NotificationCard({ notification }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 relative">

      {/* Unread Dot */}

      {notification.unread && (
        <div className="absolute right-6 top-6 w-3 h-3 rounded-full bg-[#3046D3]" />
      )}

      <div className="flex justify-between items-start gap-6">

        <div className="flex gap-5 flex-1">

          <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-2xl">

            {notification.icon}

          </div>

          <div className="flex-1">

            <h2 className="text-xl font-bold text-[#253B80]">

              {notification.title}

            </h2>

            <p className="text-gray-500 mt-3 leading-7">

              {notification.description}

            </p>

            <div className="flex gap-3 mt-6 flex-wrap">

              {notification.actions.map((action, index) => (

                <NotificationActionButton
                  key={action}
                  text={action}
                  secondary={index !== 0}
                />

              ))}

            </div>

          </div>

        </div>

        <div className="text-gray-500 whitespace-nowrap">

          {notification.time}

        </div>

      </div>

    </div>
  );
}