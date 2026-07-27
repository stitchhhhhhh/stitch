import {
  useMemo,
  useRef,
  useState,
} from "react";
import { uploadMaterial } from "../../../services/trainerService";

const MATERIAL_TYPES = [
  {
    value: "video",
    label: "Video",
    accept:
      ".mp4,.webm,.mov,.avi,video/mp4,video/webm,video/quicktime,video/x-msvideo",
    extensions: [
      ".mp4",
      ".webm",
      ".mov",
      ".avi",
    ],
    errorMessage:
      "VIDEO materials must use a MP4, WebM, MOV, or AVI video file",
  },
  {
    value: "document",
    label: "Document",
    accept:
      ".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain",
    extensions: [
      ".pdf",
      ".doc",
      ".docx",
      ".txt",
    ],
    errorMessage:
      "DOCUMENT materials must use a PDF, DOC, DOCX, or TXT document file",
  },
  {
    value: "presentation",
    label: "Presentation",
    accept:
      ".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation",
    extensions: [
      ".ppt",
      ".pptx",
    ],
    errorMessage:
      "PRESENTATION materials must use a PPT or PPTX presentation file",
  },
];

function getFileExtension(filename = "") {
  const lastDotIndex =
    filename.lastIndexOf(".");

  if (
    lastDotIndex < 0 ||
    lastDotIndex ===
      filename.length - 1
  ) {
    return "";
  }

  return filename
    .slice(lastDotIndex)
    .toLowerCase();
}

export default function UploadMaterialModal({
  courses = [],
  onClose,
  onUploaded,
}) {
  const fileInputRef = useRef(null);

  const [courseId, setCourseId] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [type, setType] =
    useState("document");

  const [file, setFile] =
    useState(null);

  const [fileInputKey, setFileInputKey] =
    useState(0);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const currentType = useMemo(
    () =>
      MATERIAL_TYPES.find(
        (item) =>
          item.value === type
      ) || MATERIAL_TYPES[1],
    [type]
  );

  function clearError() {
    setError("");
  }

  function resetSelectedFile() {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // This forces React to recreate
    // the file input element.
    setFileInputKey(
      (currentKey) =>
        currentKey + 1
    );
  }

  function handleCourseChange(event) {
    setCourseId(
      event.target.value
    );

    clearError();
  }

  function handleTitleChange(event) {
    setTitle(
      event.target.value
    );

    clearError();
  }

  function handleTypeChange(event) {
    const selectedType =
      event.target.value;

    setType(selectedType);
    clearError();
    resetSelectedFile();
  }

  function validateSelectedFile(
    selectedFile
  ) {
    if (!selectedFile) {
      return {
        valid: false,
        message:
          "Please choose a file.",
      };
    }

    const extension =
      getFileExtension(
        selectedFile.name
      );

    const validExtension =
      currentType.extensions.includes(
        extension
      );

    if (!validExtension) {
      return {
        valid: false,
        message:
          currentType.errorMessage,
      };
    }

    return {
      valid: true,
    };
  }

  function handleFileChange(event) {
    clearError();

    const selectedFile =
      event.target.files?.[0] ||
      null;

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const validation =
      validateSelectedFile(
        selectedFile
      );

    if (!validation.valid) {
      setFile(null);

      setError(
        validation.message
      );

      if (fileInputRef.current) {
        fileInputRef.current.value =
          "";
      }

      return;
    }

    setFile(selectedFile);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) {
      return;
    }

    if (!courseId) {
      setError(
        "Please select a course."
      );

      return;
    }

    if (!title.trim()) {
      setError(
        "Material title is required."
      );

      return;
    }

    const fileValidation =
      validateSelectedFile(file);

    if (!fileValidation.valid) {
      setError(
        fileValidation.message
      );

      return;
    }

    try {
      setSaving(true);
      clearError();

      const material =
        await uploadMaterial({
          course_id: courseId,
          material_title:
            title.trim(),
          material_type: type,
          file,
        });

      if (
        typeof onUploaded ===
        "function"
      ) {
        onUploaded(material);
      }

      if (
        typeof onClose ===
        "function"
      ) {
        onClose();
      }
    } catch (uploadError) {
      console.error(
        "UPLOAD MATERIAL ERROR:",
        uploadError
      );

      setError(
        uploadError?.message ||
          "Failed to upload learning material."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    if (saving) {
      return;
    }

    if (
      typeof onClose ===
      "function"
    ) {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-[#253B80]">
          Upload Material
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          noValidate
        >
          <div>
            <label
              htmlFor="material-course"
              className="text-sm text-gray-500"
            >
              Course
            </label>

            <select
              id="material-course"
              value={courseId}
              onChange={
                handleCourseChange
              }
              disabled={saving}
              className="mt-1 w-full rounded-xl border px-4 py-3 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                Select a course...
              </option>

              {courses.map(
                (course) => (
                  <option
                    key={course.id}
                    value={course.id}
                  >
                    {course.course_title}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="material-title"
              className="text-sm text-gray-500"
            >
              Material Title
            </label>

            <input
              id="material-title"
              type="text"
              value={title}
              onChange={
                handleTitleChange
              }
              disabled={saving}
              className="mt-1 w-full rounded-xl border px-4 py-3 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="Example: Introduction to Cybersecurity"
              autoComplete="off"
            />
          </div>

          <div>
            <label
              htmlFor="material-type"
              className="text-sm text-gray-500"
            >
              Material Type
            </label>

            <select
              id="material-type"
              value={type}
              onChange={
                handleTypeChange
              }
              disabled={saving}
              className="mt-1 w-full rounded-xl border px-4 py-3 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {MATERIAL_TYPES.map(
                (item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="material-file"
              className="text-sm text-gray-500"
            >
              File
            </label>

            <input
              key={fileInputKey}
              id="material-file"
              ref={fileInputRef}
              type="file"
              accept={
                currentType.accept
              }
              onChange={
                handleFileChange
              }
              disabled={saving}
              className="mt-1 w-full rounded-xl border px-4 py-3 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="mt-2 text-xs text-gray-500">
              Allowed formats:{" "}
              {currentType.extensions
                .join(", ")
                .toUpperCase()}
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="text-sm text-red-500"
            >
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="rounded-xl border px-6 py-3 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#3046D3] px-6 py-3 text-white hover:bg-[#253B80] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Uploading..."
                : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}