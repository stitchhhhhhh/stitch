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

async function request(url, options = {}, fallbackMessage = 'An unexpected error occurred') {
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
        'not_started',

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
      'not_started',
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
    "Failed to load the user's courses"
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
    throw new Error('Invalid course ID');
  }

  const data = await request(
    `/api/courses/${courseId}`,
    {},
    'Failed to load course details'
  );

  return normalizeCourse(data);
}

/**
 * The backend does not currently provide a dedicated program route.
 *
 * Program diambil dari semua course kemudian dihilangkan duplikasinya.
 */
export async function getAllPrograms() {
  const response = await request(
    '/api/courses?page=1&limit=100',
    {},
    'Failed to load training programs'
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
 * Recommended courses are courses the user has not enrolled in
 * dan berstatus approved.
 */
export async function getRecommendedCourses(userId) {
  const [courseResponse, myCourses] =
    await Promise.all([
      request(
        '/api/courses?page=1&limit=100',
        {},
        'Failed to load courses'
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
 * and only include courses that have not been completed.
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
 * The backend does not yet provide a learning activity endpoint.
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
 * The backend does not yet provide a module table or route.
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
    'Failed to load trainer data'
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
    'Failed to load assessment'
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
    'Failed to load assessment questions'
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
 * POST /api/assessment-results
 *
 * Sends assessment answers to the backend.
 * The backend calculates the score, determines the result,
 * and stores the assessment result in the database.
 */
export async function submitAssessmentResult(
  assessmentId,
  answers
) {
  const normalizedAssessmentId = Number(assessmentId);

  if (
    !Number.isInteger(normalizedAssessmentId) ||
    normalizedAssessmentId <= 0
  ) {
    throw new Error('Invalid assessment ID');
  }

  if (!Array.isArray(answers)) {
    throw new Error('Assessment answers must be an array');
  }

  const normalizedAnswers = answers
    .map((answer) => ({
      question_id: Number(answer.question_id),
      answer_text:
        answer.answer_text === undefined ||
        answer.answer_text === null
          ? ''
          : String(answer.answer_text),
    }))
    .filter(
      (answer) =>
        Number.isInteger(answer.question_id) &&
        answer.question_id > 0
    );

  return request(
  '/api/assessment-results',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assessment_id: normalizedAssessmentId,
        answers: normalizedAnswers,
      }),
    },
    'Failed to submit assessment'
  );
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
    throw new Error('Invalid user ID');
  }

  if (!courseId) {
    throw new Error('Invalid course ID');
  }

  const normalizedPercentage =
    Number(percentage);

  if (
    !Number.isFinite(normalizedPercentage) ||
    normalizedPercentage < 0 ||
    normalizedPercentage > 100
  ) {
    throw new Error(
  'Progress must be between 0 and 100'
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
  'Enrollment for this course was not found'
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
    'Failed to update learning progress'
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
      'Failed to load progress from the backend:',
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
    throw new Error("Invalid enrollment ID");
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
    "Failed to update learning progress"
  );

  return {
    ...response,
    success: true,
  };
}
