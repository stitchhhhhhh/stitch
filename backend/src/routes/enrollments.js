const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { authMiddleware, roleMiddleware } = require('../middleware/auth')

const prisma = new PrismaClient()

// GET kursus yang di-assign ke employee tertentu (optimized)
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { user_id: parseInt(req.params.userId) },
      select: {
        id: true,
        completion_percentage: true,
        status: true,
        assigned_date: true,
        course: {
          select: {
            id: true,
            course_title: true,
            deadline: true,
            materials: { select: { id: true, material_title: true } },
            assessments: { select: { id: true, title: true } },
            trainer: { select: { full_name: true } }
          }
        }
      }
    })
    res.json(enrollments)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET completion status per departemen (untuk Manager, optimized + pagination)
router.get('/department/:deptId', authMiddleware, roleMiddleware('HR', 'MANAGER'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const deptId = parseInt(req.params.deptId)

    const enrollments = await prisma.courseEnrollment.findMany({
      where: { user: { department_id: deptId } },
      skip,
      take: limit,
      select: {
        id: true,
        completion_percentage: true,
        status: true,
        user: { select: { id: true, full_name: true } },
        course: { select: { id: true, course_title: true } }
      }
    })

    const total = await prisma.courseEnrollment.count({
      where: { user: { department_id: deptId } }
    })

    res.json({
      data: enrollments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT — update progress completion
router.put('/:id/progress', authMiddleware, async (req, res) => {
  try {
    const { completion_percentage } = req.body

    let status = 'in_progress'
    if (completion_percentage >= 100) status = 'completed'

    const enrollment = await prisma.courseEnrollment.update({
      where: { id: parseInt(req.params.id) },
      data: {
        completion_percentage: parseInt(completion_percentage),
        status
      }
    })

    res.json(enrollment)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router