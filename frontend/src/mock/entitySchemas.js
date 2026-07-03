/**
 * entitySchemas.js
 *
 * Referensi shape data berdasarkan ERD (ERD_CTL-LMS.pdf).
 * File ini BUKAN dipakai langsung di runtime — ini dokumentasi
 * supaya semua mock data & komponen konsisten dengan field yang
 * akan dikirim oleh backend nanti.
 *
 * Setiap kali tim backend kasih kontrak API asli, cocokkan
 * response shape mereka ke sini dulu sebelum ubah komponen.
 */

export const ENTITY_SHAPES = {
  role: {
    role_id: 'int',
    role_name: 'varchar', // 'employee' | 'manager' | 'hr' | 'trainer'
  },

  department: {
    department_id: 'int',
    department_name: 'varchar',
    description: 'text',
  },

  user: {
    user_id: 'int',
    role_id: 'int',
    department_id: 'int',
    full_name: 'varchar',
    email: 'varchar',
    status: 'varchar', // 'active' | 'inactive'
    total_points: 'int',
  },

  trainingProgram: {
    program_id: 'int',
    department_id: 'int',
    created_by: 'int', // user_id
    program_name: 'varchar',
    description: 'text',
    program_type: 'varchar',
    status: 'varchar', // 'draft' | 'active' | 'completed' | 'archived'
  },

  programProposal: {
    proposal_id: 'int',
    program_id: 'int',
    submitted_by: 'int', // user_id
    approved_by: 'int', // user_id, nullable
    status: 'varchar', // 'pending' | 'approved' | 'rejected'
    submitted_date: 'datetime',
    approval_date: 'datetime',
  },

  courseRequest: {
    request_id: 'int',
    program_id: 'int',
    requested_by: 'int', // user_id
    trainer_id: 'int', // user_id
    status: 'varchar', // 'pending' | 'approved' | 'rejected'
    request_date: 'datetime',
  },

  course: {
    course_id: 'int',
    program_id: 'int',
    trainer_id: 'int',
    course_title: 'varchar',
    description: 'text',
    deadline: 'date',
    approval_status: 'varchar', // 'pending' | 'approved' | 'rejected'
  },

  learningMaterial: {
    material_id: 'int',
    course_id: 'int',
    material_title: 'varchar',
    material_type: 'varchar', // 'video' | 'pdf' | 'doc' | 'link'
    file_url: 'varchar',
  },

  assessment: {
    assessment_id: 'int',
    course_id: 'int',
    title: 'varchar',
    passing_score: 'int',
  },

  question: {
    question_id: 'int',
    assessment_id: 'int',
    question_text: 'text',
    correct_answer: 'text',
  },

  courseEnrollment: {
    enrollment_id: 'int',
    user_id: 'int',
    course_id: 'int',
    assigned_date: 'date',
    completion_percentage: 'int',
    status: 'varchar', // 'not_started' | 'in_progress' | 'completed'
  },

  assessmentResult: {
    result_id: 'int',
    assessment_id: 'int',
    user_id: 'int',
    score: 'decimal',
    completed_date: 'datetime',
  },

  notification: {
    notification_id: 'int',
    user_id: 'int',
    title: 'varchar',
    message: 'text',
    is_read: 'boolean',
  },

  certificate: {
    certificate_id: 'int',
    user_id: 'int',
    course_id: 'int',
    certificate_number: 'varchar',
    issue_date: 'date',
  },
};

export const ROLES = {
  EMPLOYEE: 'employee',
  MANAGER: 'manager',
  HR: 'hr',
  TRAINER: 'trainer',
};
