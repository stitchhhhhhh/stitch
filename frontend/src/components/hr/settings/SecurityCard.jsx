export default function SecurityCard() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm h-full">

      <h2 className="font-semibold text-xl mb-8">
        🛡 Security
      </h2>

      <div className="space-y-8">

        <div>
          <p className="text-xs text-gray-500 uppercase">
            LAST LOGIN
          </p>

          <p className="font-semibold mt-2">
            Today, 08:42 AM
          </p>
        </div>

        <hr />

        <div>
          <p className="text-xs text-gray-500 uppercase">
            SSO PROVIDER
          </p>

          <p className="font-semibold mt-2">
            Microsoft Azure Directory Services
          </p>
        </div>

        <button className="text-[#2F3FE4] font-semibold">
          View Access Logs →
        </button>

      </div>

    </div>
  );
}