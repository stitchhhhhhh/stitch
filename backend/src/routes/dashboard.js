const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { authMiddleware } = require('../middleware/auth')

const prisma = new PrismaClient()

router.get('/summary', authMiddleware, async (req, res) => {
  try {

    const [
      employees,
      trainers,
      courses,
      programs,
      certificates,
      enrollments,
      completedEnrollments,
      pendingProposals,
      avgScore
    ] = await Promise.all([

      prisma.user.count(),

      prisma.user.count({
        where: {
          role: {
            name: 'TRAINER'
          }
        }
      }),

      prisma.course.count(),

      prisma.trainingProgram.count(),

      prisma.certificate.count(),

      prisma.courseEnrollment.count(),

      prisma.courseEnrollment.count({
        where: {
          status: 'completed'
        }
      }),

      prisma.programProposal.count({
        where: {
          status: 'pending'
        }
      }),

      prisma.assessmentResult.aggregate({
        _avg: {
          score: true
        }
      })

    ])

    const completionRate =
      enrollments > 0
        ? ((completedEnrollments / enrollments) * 100).toFixed(2)
        : 0

    res.json({
      employees,
      trainers,
      courses,
      programs,
      certificates,
      enrollments,
      completedEnrollments,
      completionRate,
      pendingProposals,
      averageScore: avgScore._avg.score || 0
    })

  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

module.exports = router
