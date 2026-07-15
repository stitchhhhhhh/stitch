export default function ProfileCard() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">

      <h2 className="font-semibold text-xl mb-8">
        👤 Profile Information
      </h2>

      <div className="flex gap-8">

        <div className="flex justify-center">
          <img
            src="https://i.pravatar.cc/150?img=44"
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>

        <div className="grid grid-cols-2 gap-5 flex-1">

          <Input label="FULL NAME" value="Sarah Jenkins" />
          <Input label="COMPANY EMAIL" value="s.jenkins@enterprise-corp.com" />

          <Input label="DEPARTMENT" value="Human Resources" />
          <Input label="ROLE" value="HR Director" />

        </div>

      </div>

    </div>
  );
}

function Input({ label, value }) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-500">
        {label}
      </label>

      <input
        defaultValue={value}
        className="mt-2 w-full border rounded-xl px-4 py-3"
      />
    </div>
  );
}