const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // 1. Seed Roles
  await prisma.role.createMany({
    data: [
      { id: 1, name: 'HR' },
      { id: 2, name: 'MANAGER' },
      { id: 3, name: 'TRAINER' },
      { id: 4, name: 'EMPLOYEE' },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Roles seeded')

  // 2. Seed Departments
  await prisma.department.createMany({
    data: [
      { id: 1, name: 'Human Resource', description: 'Manages employee relations, recruitment, and training' },
      { id: 2, name: 'Information Technology', description: 'Handles system development and IT infrastructure' },
      { id: 3, name: 'Finance', description: 'Manages financial planning and reporting' },
      { id: 4, name: 'Marketing', description: 'Handles brand management and marketing campaigns' },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Departments seeded')

  // 3. Seed Users
  await prisma.user.createMany({
    data: [
      {
        id: 1,
        full_name: 'Ilfa Nur Fatimah',
        email: 'ilfanurfatimah.cantik@gmail.com',
        role_id: 1,       // HR
        department_id: 1, // Human Resource
        status: 'active',
        total_points: 0,
      },
      {
        id: 2,
        full_name: 'Annisa Regita',
        email: 'annisaregita07@gmail.com',
        role_id: 2,       // MANAGER
        department_id: 2, // IT
        status: 'active',
        total_points: 120,
      },
      {
        id: 3,
        full_name: 'Bunga Ayu',
        email: 'bungamaysyafa@gmail.com',
        role_id: 4,       // EMPLOYEE
        department_id: 2, // IT
        status: 'active',
        total_points: 80,
      },
      {
        id: 4,
        full_name: 'Sarah Diana',
        email: 'sarahdianavaulinasitorus48@gmail.com',
        role_id: 3,       // TRAINER
        department_id: 2, // IT
        status: 'active',
        total_points: 200,
      },
      // Additional employees for testing
      {
        id: 5,
        full_name: 'Budi Santoso',
        email: 'budi.santoso@company.com',
        role_id: 4,       // EMPLOYEE
        department_id: 3, // Finance
        status: 'active',
        total_points: 50,
      },
      {
        id: 6,
        full_name: 'Dewi Rahayu',
        email: 'dewi.rahayu@company.com',
        role_id: 4,       // EMPLOYEE
        department_id: 4, // Marketing
        status: 'active',
        total_points: 30,
      },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Users seeded')

  // 4. Seed Program Proposals
  await prisma.programProposal.createMany({
    data: [
      {
        id: 1,
        submitted_by: 2,  // Annisa (Manager)
        approved_by: 1,   // Ilfa (HR)
        proposal_title: 'IT Security Awareness Training',
        description: 'Mandatory cybersecurity awareness training for all IT department employees to strengthen security practices.',
        status: 'approved',
        submitted_date: new Date('2026-06-01'),
        approval_date: new Date('2026-06-05'),
      },
      {
        id: 2,
        submitted_by: 2,  // Annisa (Manager)
        approved_by: 1,   // Ilfa (HR)
        proposal_title: 'Agile & Scrum Methodology',
        description: 'Training program on Agile and Scrum practices for software development teams.',
        status: 'approved',
        submitted_date: new Date('2026-06-03'),
        approval_date: new Date('2026-06-07'),
      },
      {
        id: 3,
        submitted_by: 1,  // Ilfa (HR)
        approved_by: null,
        proposal_title: 'Company Onboarding Program',
        description: 'Mandatory onboarding training for all new employees covering company policies and culture.',
        status: 'pending',
        submitted_date: new Date('2026-06-10'),
      },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Program Proposals seeded')

  // 5. Seed Training Programs
  await prisma.trainingProgram.createMany({
    data: [
      {
        id: 1,
        proposal_id: 1,
        department_id: 2, // IT
        created_by: 1,    // Ilfa (HR)
        program_name: 'IT Security Awareness 2026',
        description: 'Comprehensive cybersecurity awareness program for IT department covering threats, best practices, and incident response.',
        program_type: 'department',
        status: 'active',
        created_date: new Date('2026-06-06'),
      },
      {
        id: 2,
        proposal_id: 2,
        department_id: 2, // IT
        created_by: 1,    // Ilfa (HR)
        program_name: 'Agile & Scrum Certification Prep',
        description: 'Training program to prepare IT staff for Agile and Scrum methodology certification.',
        program_type: 'department',
        status: 'active',
        created_date: new Date('2026-06-08'),
      },
      {
        id: 3,
        proposal_id: null,
        department_id: null,
        created_by: 1,    // Ilfa (HR)
        program_name: 'Mandatory Employee Onboarding',
        description: 'Organization-wide onboarding program covering company policies, code of conduct, and workplace safety.',
        program_type: 'mandatory',
        status: 'active',
        created_date: new Date('2026-06-12'),
      },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Training Programs seeded')

  // 6. Seed Course Requests
  await prisma.courseRequest.createMany({
    data: [
      {
        id: 1,
        program_id: 1,
        requested_by: 2, // Annisa (Manager)
        trainer_id: 4,   // Sarah (Trainer)
        status: 'approved',
        request_date: new Date('2026-06-06'),
      },
      {
        id: 2,
        program_id: 2,
        requested_by: 2, // Annisa (Manager)
        trainer_id: 4,   // Sarah (Trainer)
        status: 'approved',
        request_date: new Date('2026-06-08'),
      },
      {
        id: 3,
        program_id: 3,
        requested_by: 1, // Ilfa (HR)
        trainer_id: 4,   // Sarah (Trainer)
        status: 'approved',
        request_date: new Date('2026-06-12'),
      },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Course Requests seeded')

  // 7. Seed Courses
  await prisma.course.createMany({
    data: [
      {
        id: 1,
        program_id: 1,
        trainer_id: 4,   // Sarah (Trainer)
        course_title: 'Introduction to Cybersecurity',
        description: 'Fundamentals of cybersecurity including common threats, vulnerabilities, and protective measures.',
        approval_status: 'approved',
        deadline: new Date('2026-07-31'),
        created_date: new Date('2026-06-10'),
      },
      {
        id: 2,
        program_id: 1,
        trainer_id: 4,   // Sarah (Trainer)
        course_title: 'Phishing & Social Engineering Awareness',
        description: 'Learn to identify and respond to phishing attacks and social engineering tactics.',
        approval_status: 'approved',
        deadline: new Date('2026-07-31'),
        created_date: new Date('2026-06-10'),
      },
      {
        id: 3,
        program_id: 2,
        trainer_id: 4,   // Sarah (Trainer)
        course_title: 'Agile Fundamentals',
        description: 'Introduction to Agile methodology, principles, and values for software development teams.',
        approval_status: 'approved',
        deadline: new Date('2026-08-15'),
        created_date: new Date('2026-06-12'),
      },
      {
        id: 4,
        program_id: 2,
        trainer_id: 4,   // Sarah (Trainer)
        course_title: 'Scrum Framework in Practice',
        description: 'Hands-on training on Scrum roles, ceremonies, and artifacts for effective project management.',
        approval_status: 'approved',
        deadline: new Date('2026-08-15'),
        created_date: new Date('2026-06-12'),
      },
      {
        id: 5,
        program_id: 3,
        trainer_id: 4,   // Sarah (Trainer)
        course_title: 'Company Policies & Code of Conduct',
        description: 'Overview of company policies, workplace guidelines, and professional conduct expectations.',
        approval_status: 'approved',
        deadline: new Date('2026-09-01'),
        created_date: new Date('2026-06-15'),
      },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Courses seeded')

  // 8. Seed Learning Materials
  await prisma.learningMaterial.createMany({
    data: [
      {
        id: 1,
        course_id: 1,
        material_title: 'Cybersecurity Basics - Slide Deck',
        material_type: 'presentation',
        file_url: '/materials/cybersecurity-basics.pptx',
        uploaded_date: new Date('2026-06-11'),
      },
      {
        id: 2,
        course_id: 1,
        material_title: 'Introduction to Cybersecurity - Video',
        material_type: 'video',
        file_url: '/materials/cybersecurity-intro.mp4',
        uploaded_date: new Date('2026-06-11'),
      },
      {
        id: 3,
        course_id: 2,
        material_title: 'Phishing Attack Examples - Document',
        material_type: 'document',
        file_url: '/materials/phishing-examples.pdf',
        uploaded_date: new Date('2026-06-11'),
      },
      {
        id: 4,
        course_id: 3,
        material_title: 'Agile Manifesto & Principles',
        material_type: 'document',
        file_url: '/materials/agile-manifesto.pdf',
        uploaded_date: new Date('2026-06-13'),
      },
      {
        id: 5,
        course_id: 4,
        material_title: 'Scrum Guide 2020',
        material_type: 'document',
        file_url: '/materials/scrum-guide.pdf',
        uploaded_date: new Date('2026-06-13'),
      },
      {
        id: 6,
        course_id: 5,
        material_title: 'Employee Handbook',
        material_type: 'document',
        file_url: '/materials/employee-handbook.pdf',
        uploaded_date: new Date('2026-06-16'),
      },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Learning Materials seeded')

  // 9. Seed Assessments
  await prisma.assessment.createMany({
    data: [
      {
        id: 1,
        course_id: 1,
        title: 'Cybersecurity Basics Quiz',
        passing_score: 70,
      },
      {
        id: 2,
        course_id: 2,
        title: 'Phishing Awareness Test',
        passing_score: 75,
      },
      {
        id: 3,
        course_id: 3,
        title: 'Agile Fundamentals Assessment',
        passing_score: 70,
      },
      {
        id: 4,
        course_id: 4,
        title: 'Scrum Framework Quiz',
        passing_score: 70,
      },
      {
        id: 5,
        course_id: 5,
        title: 'Company Policy Assessment',
        passing_score: 80,
      },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Assessments seeded')

  // 10. Seed Questions
  await prisma.question.createMany({
    data: [
      // Cybersecurity Basics Quiz
      { id: 1, assessment_id: 1, question_text: 'What is the most common type of cyber attack targeting employees?', correct_answer: 'Phishing' },
      { id: 2, assessment_id: 1, question_text: 'What does VPN stand for?', correct_answer: 'Virtual Private Network' },
      { id: 3, assessment_id: 1, question_text: 'Which of the following is a strong password practice?', correct_answer: 'Using a combination of uppercase, lowercase, numbers, and symbols' },
      // Phishing Awareness Test
      { id: 4, assessment_id: 2, question_text: 'What is a key indicator of a phishing email?', correct_answer: 'Urgent request for personal information' },
      { id: 5, assessment_id: 2, question_text: 'What should you do if you receive a suspicious email?', correct_answer: 'Report it to the IT security team' },
      // Agile Fundamentals
      { id: 6, assessment_id: 3, question_text: 'What are the four core values of the Agile Manifesto?', correct_answer: 'Individuals, Working Software, Customer Collaboration, Responding to Change' },
      { id: 7, assessment_id: 3, question_text: 'What is a Sprint in Agile development?', correct_answer: 'A time-boxed iteration for delivering a potentially shippable product increment' },
      // Scrum Framework
      { id: 8, assessment_id: 4, question_text: 'What are the three Scrum roles?', correct_answer: 'Product Owner, Scrum Master, Development Team' },
      { id: 9, assessment_id: 4, question_text: 'What is the purpose of a Daily Standup?', correct_answer: 'To synchronize activities and create a plan for the next 24 hours' },
      // Company Policy
      { id: 10, assessment_id: 5, question_text: 'How many days of annual leave are employees entitled to?', correct_answer: '12 days per year' },
      { id: 11, assessment_id: 5, question_text: 'What is the company policy on data confidentiality?', correct_answer: 'All company data must be kept confidential and not shared with unauthorized parties' },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Questions seeded')

  // 11. Seed Course Enrollments
  await prisma.courseEnrollment.createMany({
    data: [
      // Bunga (Employee IT) - enrolled in IT Security & Agile courses
      { id: 1, user_id: 3, course_id: 1, assigned_date: new Date('2026-06-15'), completion_percentage: 100, status: 'completed' },
      { id: 2, user_id: 3, course_id: 2, assigned_date: new Date('2026-06-15'), completion_percentage: 60, status: 'in_progress' },
      { id: 3, user_id: 3, course_id: 3, assigned_date: new Date('2026-06-16'), completion_percentage: 0, status: 'assigned' },
      { id: 4, user_id: 3, course_id: 5, assigned_date: new Date('2026-06-16'), completion_percentage: 100, status: 'completed' },
      // Budi (Employee Finance) - enrolled in mandatory course
      { id: 5, user_id: 5, course_id: 5, assigned_date: new Date('2026-06-16'), completion_percentage: 50, status: 'in_progress' },
      // Dewi (Employee Marketing) - enrolled in mandatory course
      { id: 6, user_id: 6, course_id: 5, assigned_date: new Date('2026-06-16'), completion_percentage: 0, status: 'assigned' },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Course Enrollments seeded')

  // 12. Seed Assessment Results
  await prisma.assessmentResult.createMany({
    data: [
      { id: 1, assessment_id: 1, user_id: 3, score: 85.0, completed_date: new Date('2026-06-20') },
      { id: 2, assessment_id: 5, user_id: 3, score: 90.0, completed_date: new Date('2026-06-21') },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Assessment Results seeded')

  // 13. Seed Certificates
  await prisma.certificate.createMany({
    data: [
      {
        id: 1,
        user_id: 3,  // Bunga
        course_id: 1,
        certificate_number: 'CERT-2026-IT-001',
        issue_date: new Date('2026-06-20'),
      },
      {
        id: 2,
        user_id: 3,  // Bunga
        course_id: 5,
        certificate_number: 'CERT-2026-OB-001',
        issue_date: new Date('2026-06-21'),
      },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Certificates seeded')

  // 14. Seed Notifications
  await prisma.notification.createMany({
    data: [
      {
        id: 1,
        user_id: 3,  // Bunga
        title: 'New Course Assigned',
        message: 'You have been assigned to "Phishing & Social Engineering Awareness". Please complete it before July 31, 2026.',
        is_read: false,
        created_date: new Date('2026-06-15'),
      },
      {
        id: 2,
        user_id: 3,  // Bunga
        title: 'Certificate Earned!',
        message: 'Congratulations! You have successfully completed "Introduction to Cybersecurity" and earned a certificate.',
        is_read: true,
        created_date: new Date('2026-06-20'),
      },
      {
        id: 3,
        user_id: 5,  // Budi
        title: 'Training Reminder',
        message: 'Reminder: Please complete your assigned "Company Policies & Code of Conduct" course before September 1, 2026.',
        is_read: false,
        created_date: new Date('2026-06-22'),
      },
      {
        id: 4,
        user_id: 6,  // Dewi
        title: 'New Course Assigned',
        message: 'You have been assigned to "Company Policies & Code of Conduct". Please complete it before September 1, 2026.',
        is_read: false,
        created_date: new Date('2026-06-16'),
      },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Notifications seeded')

  console.log('🎉 Semua data berhasil diinput!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })