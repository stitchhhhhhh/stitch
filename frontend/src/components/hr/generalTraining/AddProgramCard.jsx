export default function AddProgramCard() {
  return (
    <div
      className="
      border-2
      border-dashed
      border-gray-300
      rounded-3xl
      flex
      flex-col
      items-center
      justify-center
      min-h-[420px]
      hover:border-[#3948F2]
      hover:bg-[#F7F8FF]
      transition
      cursor-pointer
      "
    >

      <div
        className="
        w-20
        h-20
        rounded-full
        bg-[#EEF2FF]
        flex
        items-center
        justify-center
        text-5xl
        text-[#3948F2]
        "
      >
        +
      </div>

      <h2 className="mt-8 text-xl font-bold">
        Create New Program
      </h2>

      <p className="mt-3 text-center text-gray-500 px-10">
        Launch a new company-wide learning initiative.
      </p>

    </div>
  );
}