const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const {
  authMiddleware,
  roleMiddleware
} = require('../middleware/auth')

const prisma = new PrismaClient()

function createMonthlyTrend(enrollments, monthCount = 6) {
  if (!Array.isArray(enrollments) || enrollments.length === 0) {
    return {
      completionTrend: [],
      employeeParticipationTrend: []
    }
  }

  const now = new Date()
  const buckets = []

  for (let offset = monthCount - 1; offset >= 0; offset -= 1) {
    const date = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth() - offset,
        1
      )
    )

    const key = `${date.getUTCFullYear()}-${String(
      date.getUTCMonth() + 1
    ).padStart(2, '0')}`

    buckets.push({
      key,
      label: date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC'
      }),
      totalEnrollments: 0,
      completedEnrollments: 0,
      userIds: new Set()
    })
  }

  const bucketMap = new Map(
    buckets.map((bucket) => [bucket.key, bucket])
  )

  enrollments.forEach((enrollment) => {
    const assignedDate = new Date(enrollment.assigned_date)

    if (Number.isNaN(assignedDate.getTime())) {
      return
    }

    const key = `${assignedDate.getUTCFullYear()}-${String(
      assignedDate.getUTCMonth() + 1
    ).padStart(2, '0')}`

    const bucket = bucketMap.get(key)

    if (!bucket) {
      return
    }

    bucket.totalEnrollments += 1
    bucket.userIds.add(enrollment.user_id)

    if (enrollment.status === 'completed') {
      bucket.completedEnrollments += 1
    }
  })

  const completionTrend = buckets.map((bucket) => ({
    label: bucket.label,
    totalEnrollments: bucket.totalEnrollments,
    completedEnrollments: bucket.completedEnrollments,
    completionRate:
      bucket.totalEnrollments > 0
        ? Number(
            (
              (bucket.completedEnrollments /
                bucket.totalEnrollments) *
              100
            ).toFixed(2)
          )
        : 0
  }))

  const employeeParticipationTrend = buckets.map(
    (bucket) => ({
      label: bucket.label,
      employees: bucket.userIds.size
    })
  )

  return {
    completionTrend,
    employeeParticipationTrend
  }
}

// GET company-wide analytics for HR.
router.get(
  '/company',
  authMiddleware,
  roleMiddleware('HR'),
  async (req, res) => {
    try {
      const [
        totalEmployees,
        totalCourses,
        totalEnrollments,
        completedEnrollments,
        averageScore
      ] = await Promise.all([
        prisma.user.count({
          where: { status: 'active' }
        }),
        prisma.course.count(),
        prisma.courseEnrollment.count(),
        prisma.courseEnrollment.count({
          where: { status: 'completed' }
        }),
        prisma.assessmentResult.aggregate({
          _avg: { score: true }
        })
      ])

      const completionRate =
        totalEnrollments > 0
          ? Number(
              (
                (completedEnrollments /
                  totalEnrollments) *
                100
              ).toFixed(2)
            )
          : 0

      res.set(
        'Cache-Control',
        'private, max-age=30'
      )

      res.json({
        totalEmployees,
        totalCourses,
        totalEnrollments,
        completedEnrollments,
        completionRate: `${completionRate.toFixed(2)}%`,
        averageAssessmentScore:
          averageScore._avg.score !== null
            ? Number(
                averageScore._avg.score.toFixed(2)
              )
            : 0
      })
    } catch (error) {
      console.error(
        'GET COMPANY ANALYTICS ERROR:',
        error
      )

      res.status(500).json({
        message: 'Failed to load company analytics'
      })
    }
  }
)

// GET department analytics for HR or Manager.
router.get(
  '/department/:deptId',
  authMiddleware,
  roleMiddleware('HR', 'MANAGER'),
  async (req, res) => {
    try {
      const requestedDepartmentId = Number(
        req.params.deptId
      )

      if (
        !Number.isInteger(requestedDepartmentId) ||
        requestedDepartmentId <= 0
      ) {
        return res.status(400).json({
          message: 'Invalid department ID'
        })
      }

      const departmentId =
        req.user.role === 'MANAGER'
          ? req.user.department_id
          : requestedDepartmentId

      if (!departmentId) {
        return res.status(400).json({
          message:
            'The user is not assigned to a department'
        })
      }

      const now = new Date()
      const trendStartDate = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth() - 5,
          1
        )
      )

      const [
        totalEmployees,
        enrollmentStats,
        trendEnrollments
      ] = await Promise.all([
        prisma.user.count({
          where: {
            department_id: departmentId,
            status: 'active'
          }
        }),

        prisma.courseEnrollment.groupBy({
          by: ['status'],
          where: {
            user: {
              department_id: departmentId
            }
          },
          _count: {
            status: true
          }
        }),

        prisma.courseEnrollment.findMany({
          where: {
            user: {
              department_id: departmentId
            },
            assigned_date: {
              gte: trendStartDate
            }
          },
          select: {
            user_id: true,
            assigned_date: true,
            status: true
          },
          orderBy: {
            assigned_date: 'asc'
          }
        })
      ])

      const totalEnrollments =
        enrollmentStats.reduce(
          (sum, item) =>
            sum + item._count.status,
          0
        )

      const completedEnrollments =
        enrollmentStats.find(
          (item) => item.status === 'completed'
        )?._count.status || 0

      const completionRate =
        totalEnrollments > 0
          ? Number(
              (
                (completedEnrollments /
                  totalEnrollments) *
                100
              ).toFixed(2)
            )
          : 0

      const {
        completionTrend,
        employeeParticipationTrend
      } = createMonthlyTrend(
        trendEnrollments,
        6
      )

      res.set(
        'Cache-Control',
        'private, max-age=30'
      )

      res.json({
        totalEmployees,
        totalEnrollments,
        completedEnrollments,
        completionRate: `${completionRate.toFixed(2)}%`,
        completionTrend,
        employeeParticipationTrend
      })
    } catch (error) {
      console.error(
        'GET DEPARTMENT ANALYTICS ERROR:',
        error
      )

      res.status(500).json({
        message:
          'Failed to load department analytics'
      })
    }
  }
)

module.exports = router
