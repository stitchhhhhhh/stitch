const express = require('express')
const { PrismaClient } = require('@prisma/client')
const {
  authMiddleware,
  roleMiddleware
} = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

function buildDepartmentUserFilter(user) {
  if (user.role === 'HR') {
    return {}
  }

  if (
    user.role === 'MANAGER' &&
    user.department_id
  ) {
    return {
      department_id: user.department_id
    }
  }

  return {
    id: -1
  }
}

function buildDepartmentProgramFilter(user) {
  if (user.role === 'HR') {
    return {}
  }

  if (
    user.role === 'MANAGER' &&
    user.department_id
  ) {
    return {
      OR: [
        {
          program_type: 'GENERAL'
        },
        {
          department_id: user.department_id
        }
      ]
    }
  }

  return {
    id: -1
  }
}

function buildDepartmentCourseFilter(user) {
  if (user.role === 'HR') {
    return {}
  }

  if (
    user.role === 'MANAGER' &&
    user.department_id
  ) {
    return {
      program: {
        OR: [
          {
            program_type: 'GENERAL'
          },
          {
            department_id: user.department_id
          }
        ]
      }
    }
  }

  return {
    id: -1
  }
}

function buildDepartmentEnrollmentFilter(user) {
  if (user.role === 'HR') {
    return {}
  }

  if (
    user.role === 'MANAGER' &&
    user.department_id
  ) {
    return {
      user: {
        department_id: user.department_id
      }
    }
  }

  return {
    id: -1
  }
}

function buildDepartmentCertificateFilter(user) {
  if (user.role === 'HR') {
    return {}
  }

  if (
    user.role === 'MANAGER' &&
    user.department_id
  ) {
    return {
      user: {
        department_id: user.department_id
      }
    }
  }

  return {
    id: -1
  }
}

function buildDepartmentProposalFilter(user) {
  if (user.role === 'HR') {
    return {
      status: 'pending'
    }
  }

  if (
    user.role === 'MANAGER' &&
    user.department_id
  ) {
    return {
      status: 'pending',
      department_id: user.department_id
    }
  }

  return {
    id: -1
  }
}

function buildDepartmentAssessmentResultFilter(user) {
  if (user.role === 'HR') {
    return {}
  }

  if (
    user.role === 'MANAGER' &&
    user.department_id
  ) {
    return {
      user: {
        department_id: user.department_id
      }
    }
  }

  return {
    id: -1
  }
}

// Get dashboard summary.
//
// HR can view company-wide statistics.
// Managers can only view statistics for their own department.
router.get(
  '/summary',
  authMiddleware,
  roleMiddleware('HR', 'MANAGER'),
  async (req, res) => {
    try {
      if (
        req.user.role === 'MANAGER' &&
        !req.user.department_id
      ) {
        return res.json({
          employees: 0,
          trainers: 0,
          courses: 0,
          programs: 0,
          certificates: 0,
          enrollments: 0,
          completedEnrollments: 0,
          completionRate: 0,
          pendingProposals: 0,
          averageScore: 0
        })
      }

      const userFilter =
        buildDepartmentUserFilter(req.user)

      const courseFilter =
        buildDepartmentCourseFilter(req.user)

      const programFilter =
        buildDepartmentProgramFilter(req.user)

      const enrollmentFilter =
        buildDepartmentEnrollmentFilter(req.user)

      const certificateFilter =
        buildDepartmentCertificateFilter(req.user)

      const proposalFilter =
        buildDepartmentProposalFilter(req.user)

      const resultFilter =
        buildDepartmentAssessmentResultFilter(
          req.user
        )

      const [
        employees,
        trainers,
        courses,
        programs,
        certificates,
        enrollments,
        completedEnrollments,
        pendingProposals,
        averageScoreResult
      ] = await Promise.all([
        prisma.user.count({
          where: {
            ...userFilter,
            role: {
              name: 'EMPLOYEE'
            }
          }
        }),

        prisma.user.count({
          where: {
            ...userFilter,
            role: {
              name: 'TRAINER'
            }
          }
        }),

        prisma.course.count({
          where: courseFilter
        }),

        prisma.trainingProgram.count({
          where: programFilter
        }),

        prisma.certificate.count({
          where: certificateFilter
        }),

        prisma.courseEnrollment.count({
          where: enrollmentFilter
        }),

        prisma.courseEnrollment.count({
          where: {
            ...enrollmentFilter,
            status: 'completed'
          }
        }),

        prisma.programProposal.count({
          where: proposalFilter
        }),

        prisma.assessmentResult.aggregate({
          where: resultFilter,
          _avg: {
            score: true
          }
        })
      ])

      const completionRate =
        enrollments > 0
          ? Number(
              (
                (completedEnrollments /
                  enrollments) *
                100
              ).toFixed(2)
            )
          : 0

      return res.json({
        employees,
        trainers,
        courses,
        programs,
        certificates,
        enrollments,
        completedEnrollments,
        completionRate,
        pendingProposals,
        averageScore:
          averageScoreResult._avg.score || 0
      })
    } catch (error) {
      console.error(
        'GET DASHBOARD SUMMARY ERROR:',
        error
      )

      return res.status(500).json({
        message:
          'Failed to retrieve dashboard summary'
      })
    }
  }
)

module.exports = router
