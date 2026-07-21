/**
 * courseService.js
 *
 * Service course yang terhubung ke backend API.
 * Tidak lagi menggunakan data dari ../mock/courses.
 */

function authHeaders() {
  const token = localStorage.getItem('token');

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

async function parseErrorResponse(response, fallbackMessage) {
  const errorData = await response.json().catch(() => ({}));

  return (
    errorData.message ||
    errorData.error ||
    fallbackMessage
  );
}

async function request(url, options = {}, fallbackMessage = 'Terjadi kesalahan') {
  const response = await fetch(url, {
  cache: 'no-store',
  ...options,
  headers: {
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await parseErrorResponse(
      response,
      fallbackMessage
    );

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/**
 * Menyesuaikan bentuk course dari backend dengan bentuk lama
 * yang dipakai komponen frontend.
 */
function normalizeCourse(course = {}) {
  return {
    ...course,

    course_id:
      course.course_id ??
      course.id ??
      null,

    id:
      course.id ??
      course.course_id ??
      null,

    course_title:
      course.course_title ??
      course.title ??
      'Untitled Course',

    description:
      course.description ??
      '',

    deadline:
      course.deadline ??
      null,

    approval_status:
      course.approval_status ??
      null,

    created_date:
      course.created_date ??
      null,

    program_id:
      course.program_id ??
      course.program?.id ??
      null,

    program_name:
      course.program_name ??
      course.program?.program_name ??
      '',

    program_type:
      course.program_type ??
      course.program?.program_type ??
      '',

    trainer_id:
      course.trainer_id ??
      course.trainer?.id ??
      null,

    trainer_name:
      course.trainer_name ??
      course.trainer?.full_name ??
      '',

    instructor:
      course.instructor ??
      course.trainer ??
      null,

    materials:
      Array.isArray(course.materials)
        ? course.materials
        : [],

    assessments:
      Array.isArray(course.assessments)
        ? course.assessments
        : [],
  };
}

function normalizeEnrollment(enrollment = {}) {
  const course = normalizeCourse(enrollment.course || {});

  return {
    ...course,

    enrollment: {
      ...enrollment,

      enrollment_id:
        enrollment.enrollment_id ??
        enrollment.id ??
        null,

      id:
        enrollment.id ??
        enrollment.enrollment_id ??
        null,

      course_id:
        enrollment.course_id ??
        course.course_id,

      user_id:
        enrollment.user_id ??
        null,

      completion_percentage:
        Number(
          enrollment.completion_percentage ?? 0
        ),

      status:
        enrollment.status ??
        'assigned',

      assigned_date:
        enrollment.assigned_date ??
        null,
    },

    completion_percentage:
      Number(
        enrollment.completion_percentage ?? 0
      ),

    status:
      enrollment.status ??
      'assigned',
  };
}

/**
 * GET /api/enrollments/user/:userId
 */
export async function getMyCourses(userId) {
  if (!userId) {
    return [];
  }

  const data = await request(
    `/api/enrollments/user/${userId}`,
    {},
    'Gagal mengambil course pengguna'
  );

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(normalizeEnrollment);
}

/**
 * GET /api/courses/:id
 */
export async function getCourseById(courseId) {
  if (!courseId) {
    throw new Error('Course ID tidak valid');
  }

  const data = await request(
    `/api/courses/${courseId}`,
    {},
    'Gagal mengambil detail course'
  );

  return normalizeCourse(data);
}

/**
 * Backend saat ini belum menyediakan route khusus program.
 *
 * Program diambil dari semua course kemudian dihilangkan duplikasinya.
 */
export async function getAllPrograms() {
  const response = await request(
    '/api/courses?page=1&limit=100',
    {},
    'Gagal mengambil program'
  );

  const courses = Array.isArray(response)
    ? response
    : response?.data || [];

  const programMap = new Map();

  courses.forEach((course) => {
    const program = course.program;

    if (!program?.id) {
      return;
    }

    if (!programMap.has(program.id)) {
      programMap.set(program.id, {
        program_id: program.id,
        id: program.id,
        program_name:
          program.program_name ?? '',
        program_type:
          program.program_type ?? '',
      });
    }
  });

  return Array.from(programMap.values());
}

/**
 * Course rekomendasi adalah course yang belum dimiliki user
 * dan berstatus approved.
 */
export async function getRecommendedCourses(userId) {
  const [courseResponse, myCourses] =
    await Promise.all([
      request(
        '/api/courses?page=1&limit=100',
        {},
        'Gagal mengambil daftar course'
      ),
      userId
        ? getMyCourses(userId)
        : Promise.resolve([]),
    ]);

  const allCourses = Array.isArray(courseResponse)
    ? courseResponse
    : courseResponse?.data || [];

  const enrolledCourseIds = new Set(
    myCourses.map((course) =>
      Number(course.course_id)
    )
  );

  return allCourses
    .map(normalizeCourse)
    .filter((course) => {
      const courseId = Number(course.course_id);

      const isNotEnrolled =
        !enrolledCourseIds.has(courseId);

      const isAvailable =
        !course.approval_status ||
        course.approval_status === 'approved';

      return isNotEnrolled && isAvailable;
    });
}

/**
 * Deadline diambil dari enrollment pengguna,
 * hanya course yang belum selesai.
 */
export async function getUpcomingDeadlines(userId) {
  const myCourses = await getMyCourses(userId);

  return myCourses
    .filter((course) => {
      const status =
        course.enrollment?.status ??
        course.status;

      return (
        course.deadline &&
        status !== 'completed'
      );
    })
    .sort((firstCourse, secondCourse) => {
      return (
        new Date(firstCourse.deadline) -
        new Date(secondCourse.deadline)
      );
    });
}

/**
 * Backend belum mempunyai endpoint learning activity.
 *
 * Data sementara dihitung dari enrollment pengguna.
 * Parameter userId dibuat opsional untuk menjaga kompatibilitas.
 */
export async function getLearningActivity(userId) {
  if (!userId) {
    return [];
  }

  const myCourses = await getMyCourses(userId);

  const groupedActivity = new Map();

  myCourses.forEach((course) => {
    const dateValue =
      course.enrollment?.assigned_date ??
      course.created_date;

    if (!dateValue) {
      return;
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const dateKey = date.toISOString().slice(0, 10);
    const currentValue =
      groupedActivity.get(dateKey) || 0;

    groupedActivity.set(
      dateKey,
      currentValue +
        Number(
          course.enrollment
            ?.completion_percentage ?? 0
        )
    );
  });

  return Array.from(groupedActivity.entries())
    .map(([date, progress]) => ({
      date,
      progress,
      hours: Number(
        (progress / 100).toFixed(1)
      ),
    }))
    .sort(
      (firstItem, secondItem) =>
        new Date(firstItem.date) -
        new Date(secondItem.date)
    );
}

/**
 * Backend belum mempunyai tabel/route module.
 *
 * Material course digunakan sebagai module agar komponen lama
 * tetap dapat menampilkan isi pembelajaran.
 */
export async function getCourseModules(courseId) {
  const course = await getCourseById(courseId);

  return (course.materials || []).map(
    (material, index) => ({
      ...material,

      module_id:
        material.module_id ??
        material.id ??
        index + 1,

      id:
        material.id ??
        material.module_id ??
        index + 1,

      course_id:
        Number(courseId),

      module_title:
        material.module_title ??
        material.material_title ??
        `Materi ${index + 1}`,

      title:
        material.title ??
        material.material_title ??
        `Materi ${index + 1}`,

      material_title:
        material.material_title ??
        material.module_title ??
        `Materi ${index + 1}`,

      material_type:
        material.material_type ??
        'file',

      file_url:
        material.file_url ??
        null,

      module_order:
        material.module_order ??
        index + 1,

      order:
        material.order ??
        index + 1,
    })
  );
}

/**
 * Backend tidak menyediakan GET trainer berdasarkan ID.
 *
 * Fungsi ini mencari trainer melalui daftar course.
 */
export async function getCourseInstructor(trainerId) {
  if (!trainerId) {
    return null;
  }

  const response = await request(
    '/api/courses?page=1&limit=100',
    {},
    'Gagal mengambil data trainer'
  );

  const courses = Array.isArray(response)
    ? response
    : response?.data || [];

  const matchedCourse = courses.find(
    (course) =>
      Number(course.trainer?.id) ===
      Number(trainerId)
  );

  if (!matchedCourse?.trainer) {
    return null;
  }

  return {
    ...matchedCourse.trainer,

    user_id:
      matchedCourse.trainer.id,

    trainer_id:
      matchedCourse.trainer.id,

    full_name:
      matchedCourse.trainer.full_name ??
      '',
  };
}

/**
 * GET /api/assessments/course/:courseId
 *
 * Service lama mengembalikan satu assessment,
 * jadi assessment pertama digunakan.
 */
export async function getAssessmentByCourseId(courseId) {
  if (!courseId) {
    return null;
  }

  const data = await request(
    `/api/assessments/course/${courseId}`,
    {},
    'Gagal mengambil assessment'
  );

  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const assessment = data[0];

  return {
    ...assessment,

    assessment_id:
      assessment.assessment_id ??
      assessment.id,

    course_id:
      assessment.course_id ??
      Number(courseId),

    passing_score:
      Number(
        assessment.passing_score ?? 70
      ),
  };
}

/**
 * GET /api/assessments/:id
 */
export async function getQuestionsByAssessmentId(
  assessmentId
) {
  if (!assessmentId) {
    return [];
  }

  const assessment = await request(
    `/api/assessments/${assessmentId}`,
    {},
    'Gagal mengambil pertanyaan assessment'
  );

  const questions = Array.isArray(
    assessment?.questions
  )
    ? assessment.questions
    : [];

  return questions.map((question) => ({
    ...question,

    question_id:
      question.question_id ??
      question.id,

    assessment_id:
      question.assessment_id ??
      Number(assessmentId),

    question_text:
      question.question_text ??
      question.text ??
      '',
  }));
}

/**
 * PUT /api/enrollments/:id/progress
 *
 * Signature dipertahankan:
 * updateCourseProgress(userId, courseId, percentage)
 *
 * Karena backend membutuhkan enrollment ID, service akan mengambil
 * enrollment user terlebih dahulu lalu mencari berdasarkan course ID.
 */
export async function updateCourseProgress(
  userId,
  courseId,
  percentage
) {
  if (!userId) {
    throw new Error('User ID tidak valid');
  }

  if (!courseId) {
    throw new Error('Course ID tidak valid');
  }

  const normalizedPercentage =
    Number(percentage);

  if (
    !Number.isFinite(normalizedPercentage) ||
    normalizedPercentage < 0 ||
    normalizedPercentage > 100
  ) {
    throw new Error(
      'Progress harus berada antara 0 sampai 100'
    );
  }

  const myCourses = await getMyCourses(userId);

  const selectedCourse = myCourses.find(
    (course) =>
      Number(course.course_id) ===
      Number(courseId)
  );

  const enrollmentId =
    selectedCourse?.enrollment
      ?.enrollment_id ??
    selectedCourse?.enrollment?.id;

  if (!enrollmentId) {
    throw new Error(
      'Enrollment untuk course ini tidak ditemukan'
    );
  }

  const updatedEnrollment = await request(
    `/api/enrollments/${enrollmentId}/progress`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        completion_percentage:
          normalizedPercentage,
      }),
    },
    'Gagal memperbarui progress'
  );

  localStorage.setItem(
    `progress_${userId}_${courseId}`,
    String(
      updatedEnrollment
        ?.completion_percentage ??
        normalizedPercentage
    )
  );

  return {
    ...updatedEnrollment,

    enrollment_id:
      updatedEnrollment?.id ??
      enrollmentId,

    success: true,

    completion_percentage:
      Number(
        updatedEnrollment
          ?.completion_percentage ??
          normalizedPercentage
      ),
  };
}

/**
 * Mengambil progress terakhir.
 *
 * Prioritas:
 * 1. Backend enrollment
 * 2. localStorage sebagai fallback
 */
export async function getLocalProgress(
  userId,
  courseId
) {
  if (!userId || !courseId) {
    return null;
  }

  try {
    const myCourses = await getMyCourses(userId);

    const selectedCourse = myCourses.find(
      (course) =>
        Number(course.course_id) ===
        Number(courseId)
    );

    const backendProgress =
      selectedCourse?.enrollment
        ?.completion_percentage;

    if (
      backendProgress !== undefined &&
      backendProgress !== null
    ) {
      return Number(backendProgress);
    }
  } catch (error) {
    console.warn(
      'Gagal mengambil progress dari backend:',
      error
    );
  }

  const key =
    `progress_${userId}_${courseId}`;

  const savedProgress =
    localStorage.getItem(key);

  return savedProgress !== null
    ? Number(savedProgress)
    : null;
}

/**
 * Alias untuk AssessmentPage.
 * AssessmentPage memanggil updateEnrollmentProgress(),
 * sedangkan service utama menggunakan updateCourseProgress().
 */
export async function updateEnrollmentProgress(
  enrollmentId,
  completionPercentage
) {
  if (!enrollmentId) {
    throw new Error("Enrollment ID tidak valid");
  }

  const response = await request(
    `/api/enrollments/${enrollmentId}/progress`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completion_percentage: completionPercentage,
      }),
    },
    "Gagal memperbarui progress"
  );

  return {
    ...response,
    success: true,
  };
}

/**
 * GET /api/material-progress/course/:courseId
 *
 * Mengambil material course beserta status selesai
 * milik user yang sedang login.
 */
export async function getMaterialProgress(courseId) {
  if (!courseId) {
    throw new Error('Course ID tidak valid');
  }

  const data = await request(
    `/api/material-progress/course/${courseId}`,
    {},
    'Gagal mengambil progress material'
  );

  return {
    enrollment: data?.enrollment ?? null,

    materials: Array.isArray(data?.materials)
      ? data.materials.map((material) => ({
          ...material,

          id:
            material.id ??
            material.material_id,

          material_id:
            material.material_id ??
            material.id,

          completed:
            Boolean(material.completed),

          completed_at:
            material.completed_at ??
            null,
        }))
      : [],
  };
}

/**
 * PUT /api/material-progress/:materialId/complete
 *
 * Menandai satu material sebagai selesai.
 * Backend akan menghitung ulang progress enrollment.
 */
export async function completeMaterial(materialId) {
  if (!materialId) {
    throw new Error('Material ID tidak valid');
  }

  const data = await request(
    `/api/material-progress/${materialId}/complete`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    'Gagal menyelesaikan material'
  );

  return {
    ...data,

    success: true,

    enrollment:
      data?.enrollment ?? null,

    material_progress:
      data?.material_progress ?? null,

    total_materials:
      Number(data?.total_materials ?? 0),

    completed_materials:
      Number(data?.completed_materials ?? 0),
  };
}