import { ROLES } from './entitySchemas';

export const departments = [
  { department_id: 1, department_name: 'Information Technology', description: 'IT & Engineering' },
  { department_id: 2, department_name: 'Finance', description: 'Finance & Accounting' },
  { department_id: 3, department_name: 'Human Resources', description: 'People & Culture' },
];

export const roles = [
  { role_id: 1, role_name: ROLES.EMPLOYEE },
  { role_id: 2, role_name: ROLES.MANAGER },
  { role_id: 3, role_name: ROLES.HR },
  { role_id: 4, role_name: ROLES.TRAINER },
];

export const users = [
  {
    user_id: 1,
    role_id: 1,
    department_id: 1,
    full_name: 'Ara Sitorus',
    email: 'ara.sitorus@company.com',
    status: 'active',
    total_points: 1280,
  },
  {
    user_id: 2,
    role_id: 4,
    department_id: 1,
    full_name: 'Dr. Sarah Bennett',
    email: 'sarah.bennett@company.com',
    status: 'active',
    total_points: 0,
  },
  {
    user_id: 3,
    role_id: 2,
    department_id: 1,
    full_name: 'John Smith',
    email: 'john.smith@company.com',
    status: 'active',
    total_points: 0,
  },
  {
    user_id: 4,
    role_id: 3,
    department_id: 3,
    full_name: 'Maria Chen',
    email: 'maria.chen@company.com',
    status: 'active',
    total_points: 0,
  },
];

// Helper: pura-pura "user yang sedang login" untuk development.
// Nanti ini diganti hasil dari auth/login backend.
export const currentUser = users[0];
