import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  createCourse,
  getTrainerCourseRequests,
} from "../../../services/trainerService";

export default function CreateCourseModal({
  onClose,
  onCreated,
}) {
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [requestId, setRequestId] = useState("");
  const [programId, setProgramId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [deadline, setDeadline] = useState("");
  const [loadingRequests, setLoadingRequests] =
    useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const trainerId =
    user?.user_id ?? user?.id ?? null;

  useEffect(() => {
    let active = true;

    async function loadAcceptedRequests() {
      if (!trainerId) {
        if (active) {
          setRequests([]);
          setLoadingRequests(false);
          setError(
            "Trainer account information is unavailable."
          );
        }

        return;
      }

      try {
        setLoadingRequests(true);
        setError(null);

        const data =
          await getTrainerCourseRequests(
            trainerId
          );

        const availableRequests =
          Array.isArray(data)
            ? data.filter(
                (request) =>
                  request.status ===
                    "in_progress" &&
                  !request.course_id
              )
            : [];

        if (active) {
          setRequests(availableRequests);
        }
      } catch (requestError) {
        if (active) {
          setRequests([]);
          setError(
            requestError.message ||
              "Failed to load accepted course requests."
          );
        }
      } finally {
        if (active) {
          setLoadingRequests(false);
        }
      }
    }

    loadAcceptedRequests();

    return () => {
      active = false;
    };
  }, [trainerId]);

  function handleRequestChange(event) {
    const selectedRequestId =
      event.target.value;

    setRequestId(selectedRequestId);
    setError(null);

    const selectedRequest =
      requests.find(
        (request) =>
          String(request.id) ===
          selectedRequestId
      );

    if (!selectedRequest) {
      setProgramId("");
      return;
    }

    setProgramId(
      String(selectedRequest.program_id)
    );

    if (!title.trim()) {
      setTitle(
        selectedRequest.program
          ?.program_name || ""
      );
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!requestId || !programId) {
      setError(
        "Please select an accepted course request."
      );
      return;
    }

    if (!title.trim()) {
      setError("Course title is required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const course = await createCourse({
        request_id: Number(requestId),
        program_id: Number(programId),
        course_title: title.trim(),
        description:
          description.trim() || null,
        deadline: deadline || null,
      });

      if (
        typeof onCreated === "function"
      ) {
        onCreated(course);
      }

      onClose();
    } catch (creationError) {
      setError(
        creationError.message ||
          "Failed to create the course."
      );
    } finally {
      setSaving(false);
    }
  }

  const hasAvailableRequests =
    requests.length > 0;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-[#253B80] mb-6">
          Create New Course
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="text-sm text-gray-500">
              Program
            </label>

            <select
              value={requestId}
              onChange={handleRequestChange}
              disabled={
                loadingRequests ||
                saving ||
                !hasAvailableRequests
              }
              required
              className="w-full mt-1 border rounded-xl px-4 py-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {loadingRequests
                  ? "Loading accepted requests..."
                  : hasAvailableRequests
                    ? "Select an accepted request..."
                    : "No accepted requests available"}
              </option>

              {requests.map((request) => (
                <option
                  key={request.id}
                  value={request.id}
                >
                  {request.program
                    ?.program_name ||
                    `Request #${request.id}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Course Title
            </label>

            <input
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              disabled={saving}
              required
              className="w-full mt-1 border rounded-xl px-4 py-3 disabled:bg-gray-100"
              placeholder="Example: Cyber Security Awareness"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              disabled={saving}
              className="w-full mt-1 border rounded-xl px-4 py-3 disabled:bg-gray-100"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Deadline (optional)
            </label>

            <input
              type="date"
              value={deadline}
              onChange={(event) =>
                setDeadline(
                  event.target.value
                )
              }
              disabled={saving}
              className="w-full mt-1 border rounded-xl px-4 py-3 disabled:bg-gray-100"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          {!loadingRequests &&
            !hasAvailableRequests &&
            !error && (
              <p className="text-sm text-gray-500">
                Accept a course request before
                creating a course.
              </p>
            )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-6 py-3 rounded-xl border hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                saving ||
                loadingRequests ||
                !requestId ||
                !programId ||
                !title.trim()
              }
              className="px-6 py-3 rounded-xl bg-[#3046D3] text-white hover:bg-[#253B80] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving
                ? "Creating..."
                : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}