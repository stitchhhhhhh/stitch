const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { authMiddleware, roleMiddleware } = require('../middleware/auth')

const prisma = new PrismaClient()

// GET analytics company-wide (HR) — pakai Promise.all biar query jalan paralel
router.get('/company', authMiddleware, roleMiddleware('HR'), async (req, res) => {
  try {
    const [totalEmployees, totalCourses, totalEnrollments, completedEnrollments, avgScore] = await Promise.all([
      prisma.user.count({ where: { status: 'active' } }),
      prisma.course.count(),
      prisma.courseEnrollment.count(),
      prisma.courseEnrollment.count({ where: { status: 'completed' } }),
      prisma.assessmentResult.aggregate({ _avg: { score: true } })
    ])

    const completionRate = totalEnrollments > 0
      ? ((completedEnrollments / totalEnrollments) * 100).toFixed(2)
      : 0

    res.set('Cache-Control', 'private, max-age=30')
    res.json({
      totalEmployees,
      totalCourses,
      totalEnrollments,
      completedEnrollments,
      completionRate: `${completionRate}%`,
      averageAssessmentScore: avgScore._avg.score?.toFixed(2) ?? 0
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET analytics per departemen (Manager) — pakai groupBy biar 1 query saja
router.get('/department/:deptId', authMiddleware, roleMiddleware('HR', 'MANAGER'), async (req, res) => {
  try {
    const deptId = parseInt(req.params.deptId)

    const [totalEmployees, enrollmentStats] = await Promise.all([
      prisma.user.count({ where: { department_id: deptId, status: 'active' } }),
      prisma.courseEnrollment.groupBy({
        by: ['status'],
        where: { user: { department_id: deptId } },
        _count: { status: true }
      })
    ])

    const totalEnrollments = enrollmentStats.reduce((sum, s) => sum + s._count.status, 0)
    const completed = enrollmentStats.find(s => s.status === 'completed')?._count.status || 0
    const completionRate = totalEnrollments > 0
      ? ((completed / totalEnrollments) * 100).toFixed(2)
      : 0

    res.set('Cache-Control', 'private, max-age=30')
    res.json({
      totalEmployees,
      totalEnrollments,
      completedEnrollments: completed,
      completionRate: `${completionRate}%`
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router