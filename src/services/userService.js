/**
 * userService.js
 * Sama prinsipnya seperti courseService.js — mock sekarang, axios nanti.
 */

import { currentUser, users } from '../mock/users';
import { notifications } from '../mock/courses';
import { certificates } from '../mock/courses';

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getCurrentUser() {
  await delay();
  return currentUser;
}

export async function getUserById(userId) {
  await delay();
  const user = users.find((u) => u.user_id === Number(userId));
  if (!user) throw new Error('User not found');
  return user;
}

export async function getNotifications(userId) {
  await delay();
  return notifications.filter((n) => n.user_id === userId);
}

export async function getCertificates(userId) {
  await delay();
  return certificates.filter((c) => c.user_id === userId);
}
