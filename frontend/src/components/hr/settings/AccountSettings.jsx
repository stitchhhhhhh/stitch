export default function AccountSettings() {
  const items = [
    {
      title: "SSO Connection",
      desc: "Connected via Azure AD",
      badge: "✔"
    },
    {
      title: "Company Status",
      desc: "Active Enterprise Member",
      badge: "ACTIVE"
    },
    {
      title: "Connected Organization",
      desc: "EduCorp Global",
      badge: ""
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">

      <h2 className="font-semibold text-xl mb-6">
        ⚙ Account Settings
      </h2>

      <div className="space-y-4">

        {items.map((item) => (

          <div
            key={item.title}
            className="border rounded-2xl p-5 flex justify-between items-center"
          >

            <div>
              <h3 className="font-semibold">
                {item.title}
              </h3>

              <p className="text-gray-500 text-sm">
                {item.desc}
              </p>
            </div>

            {item.badge && (
              <span className="text-[#2F3FE4] font-semibold text-sm">
                {item.badge}
              </span>
            )}

          </div>

        ))}

      </div>

    </div>
  );
}