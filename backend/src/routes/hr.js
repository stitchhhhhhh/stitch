const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { authMiddleware, roleMiddleware } = require('../middleware/auth')

const prisma = new PrismaClient()

function percentage(part, total) {
  return total > 0 ? Number(((part / total) * 100).toFixed(2)) : 0
}

router.get('/overview', authMiddleware, roleMiddleware('HR'), async (req, res) => {
  try {
    const now = new Date()
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1)
    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(now.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const [
      employeeRole,
      totalCourses,
      totalEnrollments,
      completedEnrollments,
      certificatesIssued,
      averageScore,
      activePrograms,
      departments,
      recentEnrollments,
      recentCertificates,
      recentResults,
      recentRequests,
      monthlyCompletions,
      dailyEnrollments,
      pendingProposals,
      submittedCourses,
      upcomingCourses,
    ] = await Promise.all([
      prisma.role.findFirst({ where: { name: 'EMPLOYEE' }, select: { id: true } }),
      prisma.course.count(),
      prisma.courseEnrollment.count(),
      prisma.courseEnrollment.count({ where: { status: 'completed' } }),
      prisma.certificate.count(),
      prisma.assessmentResult.aggregate({ _avg: { score: true } }),
      prisma.trainingProgram.count({ where: { status: 'active' } }),
      prisma.department.findMany({
        orderBy: { name: 'asc' },
        include: {
          users: { where: { status: 'active', role: { name: 'EMPLOYEE' } }, select: { id: true } },
        },
      }),
      prisma.courseEnrollment.findMany({
        take: 8,
        orderBy: { assigned_date: 'desc' },
        include: {
          user: { select: { full_name: true, department: { select: { name: true } } } },
          course: { select: { course_title: true } },
        },
      }),
      prisma.certificate.findMany({
        take: 5,
        orderBy: { issue_date: 'desc' },
        include: { user: { select: { full_name: true } }, course: { select: { course_title: true } } },
      }),
      prisma.assessmentResult.findMany({
        take: 5,
        orderBy: { completed_date: 'desc' },
        include: { user: { select: { full_name: true } }, assessment: { select: { title: true } } },
      }),
      prisma.courseRequest.findMany({
        take: 8,
        orderBy: { request_date: 'desc' },
        include: {
          requester: { select: { full_name: true, department: { select: { name: true } } } },
          program: { select: { program_name: true } },
          trainer: { select: { full_name: true } },
        },
      }),
      prisma.courseEnrollment.findMany({
        where: { status: 'completed', assigned_date: { gte: twelveMonthsAgo } },
        select: { assigned_date: true },
      }),
      prisma.courseEnrollment.findMany({
        where: { assigned_date: { gte: sevenDaysAgo } },
        select: { assigned_date: true },
      }),
      prisma.programProposal.findMany({
        where: { status: 'pending' },
        take: 5,
        orderBy: { submitted_date: 'desc' },
        include: { submitter: { select: { full_name: true } }, department: { select: { name: true } } },
      }),
      prisma.course.findMany({
        where: { approval_status: 'submitted' },
        take: 5,
        orderBy: { created_date: 'desc' },
        include: { trainer: { select: { full_name: true } }, program: { select: { program_name: true } } },
      }),
      prisma.course.findMany({
        where: { deadline: { gte: now } },
        take: 5,
        orderBy: { deadline: 'asc' },
        include: { enrollments: { where: { status: { not: 'completed' } }, select: { id: true } } },
      }),
    ])

    const totalEmployees = employeeRole
      ? await prisma.user.count({ where: { role_id: employeeRole.id, status: 'active' } })
      : 0

    const departmentStats = await Promise.all(
      departments.map(async (department) => {
        const [enrollments, completed, score] = await Promise.all([
          prisma.courseEnrollment.count({ where: { user: { department_id: department.id, role: { name: 'EMPLOYEE' } } } }),
          prisma.courseEnrollment.count({ where: { user: { department_id: department.id, role: { name: 'EMPLOYEE' } }, status: 'completed' } }),
          prisma.assessmentResult.aggregate({
            where: { user: { department_id: department.id, role: { name: 'EMPLOYEE' } } },
            _avg: { score: true },
          }),
        ])
        return {
          id: department.id,
          name: department.name,
          learners: department.users.length,
          enrollments,
          completed,
          completionRate: percentage(completed, enrollments),
          averageScore: Number((score._avg.score || 0).toFixed(2)),
        }
      })
    )

    const monthLabels = []
    const monthlyTrend = []
    for (let offset = 11; offset >= 0; offset -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - offset, 1)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      const count = monthlyCompletions.filter((item) => {
        const value = new Date(item.assigned_date)
        return `${value.getFullYear()}-${value.getMonth()}` === key
      }).length
      monthLabels.push(date.toLocaleString('en-US', { month: 'short' }))
      monthlyTrend.push(count)
    }

    const dailyActivity = []
    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = new Date(now)
      date.setDate(now.getDate() - offset)
      const count = dailyEnrollments.filter((item) => {
        const value = new Date(item.assigned_date)
        return value.toDateString() === date.toDateString()
      }).length
      dailyActivity.push({ day: date.toLocaleString('en-US', { weekday: 'short' }), count })
    }

    const activities = [
      ...recentEnrollments.map((item) => ({
        type: item.status === 'completed' ? 'completion' : 'enrollment',
        user: item.user.full_name,
        action: item.status === 'completed' ? 'completed' : 'was assigned to',
        target: item.course.course_title,
        date: item.assigned_date,
      })),
      ...recentCertificates.map((item) => ({
        type: 'certificate', user: item.user.full_name, action: 'earned a certificate for', target: item.course.course_title, date: item.issue_date,
      })),
      ...recentResults.map((item) => ({
        type: 'assessment', user: item.user.full_name, action: 'completed assessment', target: item.assessment.title, date: item.completed_date,
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8)

    const completionRate = percentage(completedEnrollments, totalEnrollments)
    const activeLearners = await prisma.courseEnrollment.groupBy({ by: ['user_id'], where: { user: { role: { name: 'EMPLOYEE' } } } })

    res.json({
      summary: {
        totalEmployees,
        totalCourses,
        totalEnrollments,
        completedEnrollments,
        completionRate,
        activeLearners: activeLearners.length,
        certificatesIssued,
        averageAssessmentScore: Number((averageScore._avg.score || 0).toFixed(2)),
        activePrograms,
      },
      departments: departmentStats,
      monthlyTrend: { labels: monthLabels, values: monthlyTrend },
      dailyActivity,
      courseStatistics: {
        completed: completedEnrollments,
        inProgress: await prisma.courseEnrollment.count({ where: { status: 'in_progress' } }),
        notStarted: await prisma.courseEnrollment.count({ where: { status: 'assigned' } }),
      },
      recentActivities: activities,
      recentRequests: recentRequests.map((item) => ({
  id: item.id,
  requester: item.requester?.full_name || 'Unknown requester',
  trainer: item.trainer?.full_name || 'Not assigned',
  program: item.program?.program_name || 'Unknown program',
  department: item.requester?.department?.name || 'Not assigned',
  date: item.request_date,
  status: item.status,
})),
      pendingApprovals: [
        ...pendingProposals.map((item) => ({
  id: `proposal-${item.id}`,
  type: 'Proposal',
  title: item.proposal_title,
  owner: item.submitter?.full_name || 'Unknown submitter',
  subtitle: item.department?.name || 'Not assigned',
})),
        ...submittedCourses.map((item) => ({
  id: `course-${item.id}`,
  type: 'Course',
  title: item.course_title,
  owner: item.trainer?.full_name || 'Not assigned',
  subtitle: item.program?.program_name || 'Unknown program',
})),
      ],
      upcomingDeadlines: upcomingCourses.map((course) => ({
        id: course.id,
        title: course.course_title,
        deadline: course.deadline,
        learnersRemaining: course.enrollments.length,
      })),
    })
  } catch (error) {
    console.error('HR OVERVIEW ERROR:', error)
    res.status(500).json({ message: 'Failed to load HR overview data.' })
  }
})

module.exports = router
