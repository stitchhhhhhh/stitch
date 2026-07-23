export default function SecurityCard({ profile }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8 h-full">
      <h2 className="text-2xl font-bold text-[#253B80] mb-8">
        Security
      </h2>

      <div className="space-y-8">
        <div>
          <p className="text-gray-500 text-sm">
            Account Email
          </p>

          <h3 className="font-semibold mt-2">
            {profile.email}
          </h3>
        </div>

        <hr />

        <div>
          <p className="text-gray-500 text-sm">
            Account Status
          </p>

          <h3 className="font-semibold mt-2 capitalize">
            {profile.status}
          </h3>
        </div>

        <p className="text-sm text-gray-500">
          Authentication is managed through your
          company account.
        </p>
      </div>
    </div>
  );
}