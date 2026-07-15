import {
  courses,
  courseEnrollments,
  trainingPrograms,
  learningActivity,
  courseModules,
  instructors,
  assessments,
  questions,
} from '../mock/courses';

// Simulasi network delay biar UI loading state-nya kebiasa dari awal
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getMyCourses(userId) {
  await delay();
  const myEnrollments = courseEnrollments.filter((e) => e.user_id === userId);
  return myEnrollments.map((enrollment) => {
    const course = courses.find((c) => c.course_id === enrollment.course_id);
    return { ...course, enrollment };
  });
}

export async function getCourseById(courseId) {
  await delay();
  const course = courses.find((c) => c.course_id === Number(courseId));
  if (!course) throw new Error('Course not found');
  return course;
}

export async function getAllPrograms() {
  await delay();
  return trainingPrograms;
}

export async function getRecommendedCourses(userId) {
  await delay();
  const enrolledIds = courseEnrollments
    .filter((e) => e.user_id === userId)
    .map((e) => e.course_id);
  return courses.filter((c) => !enrolledIds.includes(c.course_id));
}

// Course yang lagi di-enroll user, diurutkan berdasarkan deadline terdekat.
// Dipakai buat panel "Upcoming Deadlines" di dashboard.
export async function getUpcomingDeadlines(userId) {
  await delay();
  const myEnrollments = courseEnrollments.filter(
    (e) => e.user_id === userId && e.status !== 'completed'
  );

  return myEnrollments
    .map((e) => {
      const course = courses.find((c) => c.course_id === e.course_id);
      return { ...course, enrollment: e };
    })
    .filter((c) => c.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
}

// Data jam belajar buat chart "Learning Velocity".
export async function getLearningActivity() {
  await delay();
  return learningActivity;
}

export async function getCourseModules(courseId) {
  await delay();
  return courseModules.filter((m) => m.course_id === Number(courseId));
}

export async function getCourseInstructor(trainerId) {
  await delay();
  return instructors.find((i) => i.user_id === trainerId) ?? null;
}

export async function getAssessmentByCourseId(courseId) {
  await delay();
  return assessments.find((a) => a.course_id === Number(courseId)) ?? null;
}

export async function getQuestionsByAssessmentId(assessmentId) {
  await delay();
  return questions.filter((q) => q.assessment_id === assessmentId);
}

// Simpan progress sementara di localStorage sampai backend siap.
// Key: `progress_${userId}_${courseId}`
export async function updateCourseProgress(userId, courseId, percentage) {
  await delay(100);
  const key = `progress_${userId}_${courseId}`;
  localStorage.setItem(key, String(percentage));
  return { success: true, completion_percentage: percentage };
}

export async function getLocalProgress(userId, courseId) {
  const key = `progress_${userId}_${courseId}`;
  const saved = localStorage.getItem(key);
  return saved !== null ? Number(saved) : null;
}