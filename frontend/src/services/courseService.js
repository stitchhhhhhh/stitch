/**
 * courseService.js
 *
 * Service layer untuk semua operasi terkait courses, programs, dan enrollments.
 *
 * SEKARANG: return data dari mock/ (in-memory, fake delay).
 * NANTI: ganti isi tiap function jadi axios call ke endpoint backend,
 * tanpa ubah signature function-nya. Komponen yang import dari sini
 * TIDAK PERLU diubah.
 *
 * Contoh nanti:
 *   export const getMyCourses = (userId) =>
 *     api.get(`/users/${userId}/courses`).then(res => res.data);
 */

import { courses, courseEnrollments, trainingPrograms } from '../mock/courses';

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
