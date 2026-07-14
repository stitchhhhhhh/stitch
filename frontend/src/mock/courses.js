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
    estimated_hours_left: 3,
  },
  {
    enrollment_id: 2,
    user_id: 1,
    course_id: 2,
    assigned_date: '2026-06-05',
    completion_percentage: 30,
    status: 'in_progress',
    estimated_hours_left: 12,
  },
];

export const certificates = [
  {
    certificate_id: 1,
    user_id: 1,
    course_id: 1,
    certificate_title: 'Advanced Project Management',
    category: 'Professional Certification',
    certificate_number: 'APM-882-990',
    issue_date: '2026-06-24',
    description:
      'Successfully mastered agile methodologies, risk mitigation strategies, and multi-stakeholder communication frameworks in a high-stakes corporate environment.',
    is_latest: true,
  },
  {
    certificate_id: 2,
    user_id: 1,
    course_id: 3,
    certificate_title: 'Cybersecurity Fundamentals',
    category: 'Technical Certification',
    certificate_number: 'CS-293-102',
    issue_date: '2026-05-12',
    description:
      'Covered core principles of information security, threat detection, and incident response.',
    is_latest: false,
  },
  {
    certificate_id: 3,
    user_id: 1,
    course_id: null,
    certificate_title: 'Strategic Leadership 101',
    category: 'Leadership Certification',
    certificate_number: 'SL-112-404',
    issue_date: '2026-04-05',
    description:
      'Developed strategic thinking and leadership capabilities for enterprise-level decision making.',
    is_latest: false,
  },
  {
    certificate_id: 4,
    user_id: 1,
    course_id: null,
    certificate_title: 'Financial Literacy',
    category: 'Professional Certification',
    certificate_number: 'FL-090-211',
    issue_date: '2026-03-19',
    description:
      'Built a foundational understanding of corporate finance, budgeting, and financial reporting.',
    is_latest: false,
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

// Data engagement belajar (jam belajar), dipakai buat chart "Learning Velocity"
// di dashboard. Nanti diganti hasil agregasi asli dari backend (analytics).
export const learningActivity = {
  weekly: [
    { label: 'Week 1', value: 3 },
    { label: 'Week 2', value: 5 },
    { label: 'Week 3 (Current)', value: 8 },
    { label: 'Week 4', value: 4 },
  ],
  daily: [
    { label: 'Mon', value: 1 },
    { label: 'Tue', value: 2 },
    { label: 'Wed', value: 1.5 },
    { label: 'Thu', value: 3 },
    { label: 'Fri', value: 2 },
    { label: 'Sat', value: 0.5 },
    { label: 'Sun', value: 0 },
  ],
};

// Modules per course — dipakai di Course Detail page
export const courseModules = [
  {
    module_id: 1,
    course_id: 1,
    module_title: 'Module 1: Strategic Planning',
    order: 1,
    is_locked: false,
    materials: [
      {
        material_id: 1,
        material_title: 'Foundations of Enterprise Complexity',
        material_type: 'video',
        duration: '18:45',
        file_url: '#',
      },
      {
        material_id: 2,
        material_title: 'Risk Mitigation Framework (v4.2)',
        material_type: 'pdf',
        file_size: '2.4 MB',
        file_url: '#',
      },
      {
        material_id: 3,
        material_title: 'Stakeholder Matrix Workshop',
        material_type: 'presentation',
        slides: 12,
        file_url: '#',
      },
      {
        material_id: 4,
        material_title: 'Module 1 Quiz',
        material_type: 'quiz',
        file_url: '#',
      },
    ],
  },
  {
    module_id: 2,
    course_id: 1,
    module_title: 'Module 2: Governance',
    order: 2,
    is_locked: true,
    materials: [],
  },
];

// Data trainer/instructor — dipakai di Course Detail hero
export const instructors = [
  {
    user_id: 2,
    full_name: 'Dr. Jennie Jenkins',
    title: 'PMP, PRINCE2 Certified',
  },
];

// Mock soal-soal assessment
export const assessments = [
  {
    assessment_id: 1,
    course_id: 1,
    title: 'Advanced Project Management - Module 1 Quiz',
    subtitle: 'Risk Analysis & Stakeholder Engagement',
    passing_score: 70,
    duration_minutes: 30,
  },
];

export const questions = [
  {
    question_id: 1,
    assessment_id: 1,
    question_text: 'What is the primary goal of the Risk Mitigation phase in the project lifecycle?',
    options: [
      'To completely eliminate all identified risks before the project execution begins.',
      'To reduce the probability and/or impact of an adverse risk event to an acceptable threshold.',
      'To document the responsible parties for every potential delay in the project timeline.',
      'To transfer all financial liability of the project to a third-party insurance provider.',
    ],
    correct_answer: 'To reduce the probability and/or impact of an adverse risk event to an acceptable threshold.',
  },
  {
    question_id: 2,
    assessment_id: 1,
    question_text: 'Which of the following best describes a stakeholder in a project context?',
    options: [
      'Only the individuals who are directly funding the project.',
      'Any person or group that has an interest in or is affected by the project outcome.',
      'The project manager and their immediate team members only.',
      'External vendors contracted to deliver project components.',
    ],
    correct_answer: 'Any person or group that has an interest in or is affected by the project outcome.',
  },
  {
    question_id: 3,
    assessment_id: 1,
    question_text: 'What is the purpose of a RACI matrix in project management?',
    options: [
      'To track the budget allocation across project phases.',
      'To define roles and responsibilities for each task or deliverable.',
      'To schedule project milestones and dependencies.',
      'To document risks and their probability scores.',
    ],
    correct_answer: 'To define roles and responsibilities for each task or deliverable.',
  },
  {
    question_id: 4,
    assessment_id: 1,
    question_text: 'In enterprise project management, what does "scope creep" refer to?',
    options: [
      'The gradual reduction of project objectives over time.',
      'Uncontrolled expansion of project scope without adjustments to time, cost, or resources.',
      'A formal process for expanding project deliverables.',
      'The deliberate narrowing of project goals to meet budget constraints.',
    ],
    correct_answer: 'Uncontrolled expansion of project scope without adjustments to time, cost, or resources.',
  },
  {
    question_id: 5,
    assessment_id: 1,
    question_text: 'Which project management methodology emphasizes iterative development and continuous feedback?',
    options: [
      'Waterfall',
      'PRINCE2',
      'Agile',
      'Critical Path Method (CPM)',
    ],
    correct_answer: 'Agile',
  },
  {
    question_id: 6,
    assessment_id: 1,
    question_text: 'What is a Work Breakdown Structure (WBS)?',
    options: [
      'A hierarchical decomposition of the total scope of work to accomplish project objectives.',
      'A timeline showing the start and end dates of project tasks.',
      'A document listing all project stakeholders and their contact information.',
      'A risk register categorized by project phase.',
    ],
    correct_answer: 'A hierarchical decomposition of the total scope of work to accomplish project objectives.',
  },
  {
    question_id: 7,
    assessment_id: 1,
    question_text: 'What does the critical path in a project schedule represent?',
    options: [
      'The shortest possible duration to complete the project.',
      'The sequence of tasks with the highest budget allocation.',
      'The longest sequence of dependent tasks that determines the minimum project duration.',
      'The list of tasks assigned to the most critical team members.',
    ],
    correct_answer: 'The longest sequence of dependent tasks that determines the minimum project duration.',
  },
  {
    question_id: 8,
    assessment_id: 1,
    question_text: 'Which document formally authorizes the existence of a project?',
    options: [
      'Project Management Plan',
      'Project Charter',
      'Statement of Work',
      'Risk Register',
    ],
    correct_answer: 'Project Charter',
  },
  {
    question_id: 9,
    assessment_id: 1,
    question_text: 'What is Earned Value Management (EVM) primarily used for?',
    options: [
      'Measuring project team performance and morale.',
      'Integrating scope, schedule, and cost to assess project performance.',
      'Calculating the return on investment for project deliverables.',
      'Documenting lessons learned at project closure.',
    ],
    correct_answer: 'Integrating scope, schedule, and cost to assess project performance.',
  },
  {
    question_id: 10,
    assessment_id: 1,
    question_text: 'What is the key difference between a project and an operational activity?',
    options: [
      'Projects are ongoing while operational activities are temporary.',
      'Projects are temporary and unique, while operational activities are ongoing and repetitive.',
      'Projects always have larger budgets than operational activities.',
      'Operational activities require a project manager while projects do not.',
    ],
    correct_answer: 'Projects are temporary and unique, while operational activities are ongoing and repetitive.',
  },
];