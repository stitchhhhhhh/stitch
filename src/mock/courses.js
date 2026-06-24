export const trainingPrograms = [
  {
    program_id: 1,
    department_id: 1,
    created_by: 3,
    program_name: 'Advanced Project Management',
    description: 'Module 1: Strategic Planning & Module 2: Governance',
    program_type: 'Leadership',
    status: 'active',
  },
  {
    program_id: 2,
    department_id: 1,
    created_by: 3,
    program_name: 'Advanced Cloud Architecture',
    description: 'Cloud infrastructure design and security',
    program_type: 'Technical',
    status: 'active',
  },
  {
    program_id: 3,
    department_id: 3,
    created_by: 4,
    program_name: 'Cyber Security Awareness Program',
    description: 'Data privacy and security fundamentals',
    program_type: 'Compliance',
    status: 'active',
  },
];

export const courses = [
  {
    course_id: 1,
    program_id: 1,
    trainer_id: 2,
    course_title: 'Advanced Project Management',
    description: 'What is the primary goal of the Risk Mitigation phase in project planning?',
    deadline: '2026-07-15',
    approval_status: 'approved',
    progress: 65,
  },
  {
    course_id: 2,
    program_id: 2,
    trainer_id: 2,
    course_title: 'Advanced Cloud Architecture',
    description: 'Cloud infrastructure security best practices',
    deadline: '2026-07-20',
    approval_status: 'approved',
    progress: 30,
  },
  {
    course_id: 3,
    program_id: 3,
    trainer_id: 2,
    course_title: 'Data Privacy 101',
    description: 'Understanding GDPR and data privacy fundamentals',
    deadline: '2026-08-01',
    approval_status: 'pending',
    progress: 0,
  },
];

export const courseEnrollments = [
  {
    enrollment_id: 1,
    user_id: 1,
    course_id: 1,
    assigned_date: '2026-06-01',
    completion_percentage: 65,
    status: 'in_progress',
  },
  {
    enrollment_id: 2,
    user_id: 1,
    course_id: 2,
    assigned_date: '2026-06-05',
    completion_percentage: 30,
    status: 'in_progress',
  },
];

export const certificates = [
  {
    certificate_id: 1,
    user_id: 1,
    course_id: 3,
    certificate_number: 'CERT-2026-0042',
    issue_date: '2026-05-10',
  },
];

export const notifications = [
  {
    notification_id: 1,
    user_id: 1,
    title: 'New course assigned',
    message: 'You have been assigned to Advanced Cloud Architecture',
    is_read: false,
  },
  {
    notification_id: 2,
    user_id: 1,
    title: 'Deadline approaching',
    message: 'Advanced Project Management deadline is in 3 days',
    is_read: false,
  },
];
