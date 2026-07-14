import ProgramStats from "../../components/hr/generalTraining/ProgramStats";
import ProgramCard from "../../components/hr/generalTraining/ProgramCard";
import AddProgramCard from "../../components/hr/generalTraining/AddProgramCard";

export default function GeneralTraining() {
  const programs = [
    {
      id: 1,
      category: "COMPLIANCE",
      status: "ACTIVE",
      title: "Cybersecurity Awareness 2024",
      deadline: "Due Dec 31, 2024",
      progress: 85,
      completed: "2,100 / 2,450 Employees Completed",
      color: "bg-[#3948F2]",
    },
    {
      id: 2,
      category: "SOFT SKILLS",
      status: "ACTIVE",
      title: "Diversity & Inclusion",
      deadline: "Due Nov 15, 2024",
      progress: 42,
      completed: "1,029 / 2,450 Employees Completed",
      color: "bg-[#6C7892]",
    },
    {
      id: 3,
      category: "TECHNICAL",
      status: "DRAFT",
      title: "Cloud Infrastructure Mastery",
      deadline: "Pending Activation",
      progress: 0,
      completed: "Not yet deployed to workforce",
      color: "bg-[#9098AD]",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold text-gray-900">
            General Training Program Management
          </h1>

          <p className="mt-2 text-gray-500 text-lg">
            Design, monitor, and deploy educational tracks across the enterprise.
          </p>

        </div>

        <button
          className="
          bg-[#3948F2]
          hover:bg-[#2736d6]
          text-white
          px-8
          py-4
          rounded-full
          shadow-lg
          font-semibold
          transition
          "
        >
          + Create New Program
        </button>

      </div>

      {/* Statistic */}

      <ProgramStats />

      {/* Program Cards */}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">

        {programs.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
          />
        ))}

        <AddProgramCard />

      </div>

    </div>
  );
}