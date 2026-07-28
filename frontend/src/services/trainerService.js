function authHeaders() {
  const token = localStorage.getItem("token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

async function readResponse(response) {
  const contentType =
    response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json().catch(() => ({}));
  }

  const text = await response
    .text()
    .catch(() => "");

  return text
    ? {
        message: text,
      }
    : {};
}

function getErrorMessage(
  data,
  fallbackMessage,
  status
) {
  if (
    typeof data?.message === "string" &&
    data.message.trim()
  ) {
    return data.message.trim();
  }

  if (
    typeof data?.error === "string" &&
    data.error.trim()
  ) {
    return data.error.trim();
  }

  if (status) {
    return `${fallbackMessage} (HTTP ${status})`;
  }

  return fallbackMessage;
}

export async function getTrainerCourses() {
  const res = await fetch(
    "/api/courses/trainer/me",
    {
      cache: "no-store",
      headers: authHeaders(),
    }
  );

  const data = await readResponse(res);

  if (!res.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to retrieve trainer courses.",
        res.status
      )
    );
  }

  return Array.isArray(data) ? data : [];
}

export async function getTrainerCourseRequests(
  trainerId
) {
  const res = await fetch(
    `/api/course-requests/trainer/${trainerId}`,
    {
      cache: "no-store",
      headers: authHeaders(),
    }
  );

  const data = await readResponse(res);

  if (!res.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to load course requests.",
        res.status
      )
    );
  }

  return Array.isArray(data) ? data : [];
}

export async function updateCourseRequestStatus(
  requestId,
  status
) {
  const res = await fetch(
    `/api/course-requests/${requestId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        status,
      }),
    }
  );

  const data = await readResponse(res);

  if (!res.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to update course request status.",
        res.status
      )
    );
  }

  return data;
}

export async function getPrograms() {
  const res = await fetch("/api/programs", {
    cache: "no-store",
    headers: authHeaders(),
  });

  const data = await readResponse(res);

  if (!res.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to load training programs.",
        res.status
      )
    );
  }

  return Array.isArray(data) ? data : [];
}

export async function createCourse({
  request_id,
  program_id,
  course_title,
  description,
  deadline,
}) {
  const res = await fetch("/api/courses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      request_id,
      program_id,
      course_title,
      description,
      deadline,
    }),
  });

  const data = await readResponse(res);

  if (!res.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to create course.",
        res.status
      )
    );
  }

  return data;
}

export async function updateTrainerCourse(
  courseId,
  {
    course_title,
    description,
    deadline,
  }
) {
  const res = await fetch(
    `/api/courses/${courseId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        course_title,
        description,
        deadline,
      }),
    }
  );

  const data = await readResponse(res);

  if (!res.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to update course.",
        res.status
      )
    );
  }

  return data;
}

export async function submitCourseForReview(
  courseId
) {
  const res = await fetch(
    `/api/courses/${courseId}/submit`,
    {
      method: "PUT",
      headers: authHeaders(),
    }
  );

  const data = await readResponse(res);

  if (!res.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to submit course.",
        res.status
      )
    );
  }

  return data;
}

export async function uploadMaterial({
  course_id,
  material_title,
  material_type,
  file,
}) {
  if (!course_id) {
    throw new Error(
      "Please select a course."
    );
  }

  if (!material_title?.trim()) {
    throw new Error(
      "Material title is required."
    );
  }

  if (!(file instanceof File)) {
    throw new Error(
      "Please choose a valid file."
    );
  }

  const formData = new FormData();

  formData.append(
    "course_id",
    String(course_id)
  );

  formData.append(
    "material_title",
    material_title.trim()
  );

  formData.append(
    "material_type",
    String(material_type || "")
  );

  formData.append(
    "file",
    file,
    file.name
  );

  const res = await fetch(
    "/api/materials/upload",
    {
      method: "POST",

      // Do not add Content-Type here.
      // The browser must generate the multipart boundary.
      headers: authHeaders(),

      body: formData,
    }
  );

  const data = await readResponse(res);

  if (!res.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to upload learning material.",
        res.status
      )
    );
  }

  return data;
}

export async function getCourseMaterials(
  courseId
) {
  const res = await fetch(
    `/api/materials/course/${courseId}`,
    {
      cache: "no-store",
      headers: authHeaders(),
    }
  );

  const data = await readResponse(res);

  if (!res.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to load course materials.",
        res.status
      )
    );
  }

  return Array.isArray(data) ? data : [];
}

export async function deleteMaterial(
  materialId
) {
  const res = await fetch(
    `/api/materials/${materialId}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    }
  );

  const data = await readResponse(res);

  if (!res.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to delete material.",
        res.status
      )
    );
  }

  return data;
}

export async function createProgram({
  program_name,
  description,
}) {
  const res = await fetch(
    "/api/programs",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        program_name,
        description,
      }),
    }
  );

  const data = await readResponse(res);

  if (!res.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to create program.",
        res.status
      )
    );
  }

  return data;
}

export async function getProposals() {
  const res = await fetch(
    "/api/proposals",
    {
      cache: "no-store",
      headers: authHeaders(),
    }
  );

  const data = await readResponse(res);

  if (!res.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to load proposals.",
        res.status
      )
    );
  }

  return Array.isArray(data) ? data : [];
}

export async function createProposal({
  proposal_title,
  description,
}) {
  const res = await fetch(
    "/api/proposals",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        proposal_title,
        description,
      }),
    }
  );

  const data = await readResponse(res);

  if (!res.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to create proposal.",
        res.status
      )
    );
  }

  return data;
}

export async function reviewProposal(
  id,
  status
) {
  const res = await fetch(
    `/api/proposals/${id}/review`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        status,
      }),
    }
  );

  const data = await readResponse(res);

  if (!res.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to review proposal.",
        res.status
      )
    );
  }

  return data;
}

export async function getNotifications() {
  const res = await fetch(
    "/api/notifications",
    {
      cache: "no-store",
      headers: authHeaders(),
    }
  );

  const data = await readResponse(res);

  if (!res.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to load notifications.",
        res.status
      )
    );
  }

  return Array.isArray(data) ? data : [];
}

export async function markNotificationAsRead(
  notificationId
) {
  const res = await fetch(
    `/api/notifications/${notificationId}/read`,
    {
      method: "PUT",
      headers: authHeaders(),
    }
  );

  const data = await readResponse(res);

  if (!res.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to mark notification as read.",
        res.status
      )
    );
  }

  return data;
}

export async function markAllNotificationsAsRead() {
  const res = await fetch(
    "/api/notifications/read-all",
    {
      method: "PUT",
      headers: authHeaders(),
    }
  );

  const data = await readResponse(res);

  if (!res.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to mark all notifications as read.",
        res.status
      )
    );
  }

  return data;
}

export async function getCurrentTrainerProfile() {
  const res = await fetch(
    "/api/users/me",
    {
      cache: "no-store",
      headers: authHeaders(),
    }
  );

  const data = await readResponse(res);

  if (!res.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to load trainer profile.",
        res.status
      )
    );
  }

  return data;
}

export async function updateTrainerProfile(
  fullName
) {
  const res = await fetch(
    "/api/users/me",
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        full_name: fullName,
      }),
    }
  );

  const data = await readResponse(res);

  if (!res.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to update trainer profile.",
        res.status
      )
    );
  }

  return data;
}

export async function updateTrainerNotifications({
  notify_course,
  notify_deadline,
  notify_certificate,
}) {
  const res = await fetch(
    "/api/users/me/notifications",
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        notify_course,
        notify_deadline,
        notify_certificate,
      }),
    }
  );

  const data = await readResponse(res);

  if (!res.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to update notification preferences.",
        res.status
      )
    );
  }

  return data;
}

export async function uploadTrainerPhoto(
  file
) {
  if (!(file instanceof File)) {
    throw new Error(
      "Invalid photo file."
    );
  }

  const formData = new FormData();

  formData.append(
    "photo",
    file,
    file.name
  );

  const res = await fetch(
    "/api/users/me/photo",
    {
      method: "POST",
      headers: authHeaders(),
      body: formData,
    }
  );

  const data = await readResponse(res);

  if (!res.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to upload trainer photo.",
        res.status
      )
    );
  }

  return data;
}

function validatePositiveId(value, label = "ID") {
  const normalizedId = Number(value);

  if (
    !Number.isInteger(normalizedId) ||
    normalizedId <= 0
  ) {
    throw new Error(`Invalid ${label}.`);
  }

  return normalizedId;
}

async function trainerRequest(
  url,
  options = {},
  fallbackMessage = "The request could not be completed."
) {
  const response = await fetch(url, {
    cache: "no-store",
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        data,
        fallbackMessage,
        response.status
      )
    );
  }

  return data;
}

export async function getTrainerCourseDetail(
  courseId
) {
  const normalizedCourseId =
    validatePositiveId(courseId, "course ID");

  return trainerRequest(
    `/api/courses/${normalizedCourseId}`,
    {},
    "Failed to load course details."
  );
}

export async function getTrainerCourseAssessments(
  courseId
) {
  const normalizedCourseId =
    validatePositiveId(courseId, "course ID");

  const data = await trainerRequest(
    `/api/assessments/course/${normalizedCourseId}`,
    {},
    "Failed to load course assessments."
  );

  return Array.isArray(data) ? data : [];
}

export async function createTrainerAssessment({
  course_id,
  title,
  passing_score,
}) {
  const normalizedCourseId =
    validatePositiveId(course_id, "course ID");

  return trainerRequest(
    "/api/assessments",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        course_id: normalizedCourseId,
        title,
        passing_score,
      }),
    },
    "Failed to create the assessment."
  );
}

export async function createAssessmentQuestion(
  assessmentId,
  {
    question_text,
    correct_answer,
  }
) {
  const normalizedAssessmentId =
    validatePositiveId(
      assessmentId,
      "assessment ID"
    );

  return trainerRequest(
    `/api/assessments/${normalizedAssessmentId}/questions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question_text,
        correct_answer,
      }),
    },
    "Failed to create the assessment question."
  );
}

export async function updateAssessmentQuestion(
  questionId,
  {
    question_text,
    correct_answer,
  }
) {
  const normalizedQuestionId =
    validatePositiveId(
      questionId,
      "question ID"
    );

  return trainerRequest(
    `/api/assessments/questions/${normalizedQuestionId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question_text,
        correct_answer,
      }),
    },
    "Failed to update the assessment question."
  );
}

export async function deleteAssessmentQuestion(
  questionId
) {
  const normalizedQuestionId =
    validatePositiveId(
      questionId,
      "question ID"
    );

  return trainerRequest(
    `/api/assessments/questions/${normalizedQuestionId}`,
    {
      method: "DELETE",
    },
    "Failed to delete the assessment question."
  );
}