import { useEffect, useState } from "react";
import {
  getPrograms,
  createProgram,
} from "../../services/trainerService";

import ProgramStats from "../../components/hr/generalTraining/ProgramStats";
import ProgramCard from "../../components/hr/generalTraining/ProgramCard";
import AddProgramCard from "../../components/hr/generalTraining/AddProgramCard";
import RequestTrainerModal from "../../components/hr/generalTraining/RequestTrainerModal";

export default function GeneralTraining() {
  const [programs, setPrograms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showRequestTrainer, setShowRequestTrainer] =
    useState(false);

  const [formData, setFormData] = useState({
    program_name: "",
    description: "",
  });

  async function loadPrograms() {
    try {
      const data = await getPrograms();

      setPrograms(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error("LOAD PROGRAMS ERROR:", err);
      setPrograms([]);
    }
  }

  useEffect(() => {
    loadPrograms();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await createProgram(formData);

      setShowForm(false);

      setFormData({
        program_name: "",
        description: "",
      });

      await loadPrograms();

      alert("Program berhasil dibuat.");
    } catch (err) {
      console.error(err);

      alert(
        err?.message ||
          "Gagal membuat program."
      );
    }
  }

  function handleCancelForm() {
    setShowForm(false);

    setFormData({
      program_name: "",
      description: "",
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            General Training Program Management
          </h1>

          <p className="mt-2 text-gray-500 text-lg">
            Design, monitor, and deploy educational tracks across the enterprise.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() =>
              setShowRequestTrainer(true)
            }
            className="border-2 border-[#3948F2] text-[#3948F2] px-8 py-4 rounded-full font-semibold hover:bg-[#F7F8FF]"
          >
            Request Trainer
          </button>

          <button
            type="button"
            onClick={() =>
              setShowForm(true)
            }
            className="bg-[#3948F2] hover:bg-[#2736d6] text-white px-8 py-4 rounded-full shadow-lg font-semibold"
          >
            + Create New Program
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl border"
        >
          <input
            type="text"
            required
            placeholder="Program Name"
            value={formData.program_name}
            onChange={(e) =>
              setFormData({
                ...formData,
                program_name: e.target.value,
              })
            }
            className="border p-3 w-full mb-4"
          />

          <textarea
            required
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
            className="border p-3 w-full mb-4"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save Program
            </button>

            <button
              type="button"
              onClick={handleCancelForm}
              className="border px-4 py-2 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <ProgramStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {programs.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            onViewDetails={(selectedProgram) =>
              alert(
                `Program: ${
                  selectedProgram.program_name
                }\n\n${
                  selectedProgram.description ||
                  ""
                }`
              )
            }
          />
        ))}

        <AddProgramCard
          onClick={() =>
            setShowForm(true)
          }
        />
      </div>

      {showRequestTrainer && (
        <RequestTrainerModal
          programs={programs}
          onClose={() =>
            setShowRequestTrainer(false)
          }
          onRequested={() =>
            alert(
              "Request berhasil dikirim ke trainer!"
            )
          }
        />
      )}
    </div>
  );
}