function authHeaders() {
  const token = localStorage.getItem("token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

async function readError(response, fallbackMessage) {
  const errorData = await response
    .json()
    .catch(() => ({}));

  return (
    errorData.message ||
    errorData.error ||
    fallbackMessage
  );
}

export async function getAllCourses() {
  const response = await fetch(
    "/api/courses?limit=100",
    {
      headers: authHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      await readError(
        response,
        "Gagal mengambil data kursus"
      )
    );
  }

  const data = await response.json();

  return data.data ?? data;
}

export async function getCourseDetail(courseId) {
  const response = await fetch(
    `/api/courses/${courseId}`,
    {
      headers: authHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      await readError(
        response,
        "Gagal mengambil detail kursus"
      )
    );
  }

  return response.json();
}

export async function reviewCourse(
  courseId,
  status
) {
  const response = await fetch(
    `/api/courses/${courseId}/approve`,
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

  if (!response.ok) {
    throw new Error(
      await readError(
        response,
        "Gagal review kursus"
      )
    );
  }

  return response.json();
}

export async function getTrainers() {
  const response = await fetch(
    "/api/users/trainers",
    {
      headers: authHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      await readError(
        response,
        "Gagal mengambil data trainer"
      )
    );
  }

  return response.json();
}

export async function requestCourseFromTrainer({
  program_id,
  trainer_id,
}) {
  const response = await fetch(
    "/api/course-requests",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        program_id,
        trainer_id,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      await readError(
        response,
        "Gagal mengirim request ke trainer"
      )
    );
  }

  return response.json();
}

/**
 * T-012
 * Mengambil analytics General Training untuk HR.
 */
export async function getCompanyAnalytics() {
  const response = await fetch(
    "/api/analytics/company",
    {
      headers: authHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      await readError(
        response,
        "Gagal mengambil data analytics"
      )
    );
  }

  return response.json();
}

export async function getDepartments() {
  const response = await fetch(
    "/api/departments",
    {
      headers: authHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      await readError(
        response,
        "Gagal mengambil data departemen"
      )
    );
  }

  return response.json();
}

export async function getDepartmentAnalytics(
  departmentId
) {
  const response = await fetch(
    `/api/analytics/department/${departmentId}`,
    {
      headers: authHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      await readError(
        response,
        "Gagal mengambil analytics departemen"
      )
    );
  }

  return response.json();
}

export async function getRecentAssessmentResults() {
  const response = await fetch(
    "/api/assessment-results/recent",
    {
      headers: authHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      await readError(
        response,
        "Gagal mengambil hasil assessment terbaru"
      )
    );
  }

  return response.json();
}

export async function getRecentCertificates() {
  const response = await fetch(
    "/api/certificates/recent",
    {
      headers: authHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      await readError(
        response,
        "Gagal mengambil sertifikat terbaru"
      )
    );
  }

  return response.json();
}

/**
 * T-013
 * Ringkasan data halaman report.
 */
export async function getTrainingReportSummary() {
  const response = await fetch(
    "/api/reports/summary",
    {
      headers: authHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      await readError(
        response,
        "Gagal mengambil ringkasan laporan"
      )
    );
  }

  return response.json();
}

/**
 * Download report Excel atau PDF.
 */
export async function exportTrainingReport(
  format = "excel"
) {
  const validFormats = ["excel", "pdf"];

  if (!validFormats.includes(format)) {
    throw new Error(
      "Format laporan tidak didukung"
    );
  }

  const response = await fetch(
    `/api/reports/export/${format}`,
    {
      method: "GET",
      headers: authHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      await readError(
        response,
        "Gagal mengunduh laporan training"
      )
    );
  }

  const blob = await response.blob();

  const contentDisposition =
    response.headers.get("Content-Disposition");

  let filename =
    format === "pdf"
      ? "general-training-report.pdf"
      : "general-training-report.xlsx";

  const filenameMatch =
    contentDisposition?.match(
      /filename="?([^"]+)"?/i
    );

  if (filenameMatch?.[1]) {
    filename = filenameMatch[1];
  }

  const downloadUrl =
    window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = downloadUrl;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(downloadUrl);

  return {
    success: true,
    filename,
  };
}