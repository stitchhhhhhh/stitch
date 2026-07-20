const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { authMiddleware, roleMiddleware } = require('../middleware/auth')

const prisma = new PrismaClient()

// GET semua course (optimized dengan select + pagination)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const courses = await prisma.course.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        course_title: true,
        description: true,
        approval_status: true,
        deadline: true,
        created_date: true,
        program: {
          select: { id: true, program_name: true, program_type: true }
        },
        trainer: {
          select: { id: true, full_name: true }
        },
	materials: {
          select: { id: true, material_title: true, material_type: true, uploaded_date: true, file_url: true }
        },
        assessments: {
          select: { id: true, title: true }
        }
      }
    })

    const total = await prisma.course.count()

    res.json({
      data: courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET course by id (optimized dengan select)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(req.params.id) },
      select: {
        id: true,
        course_title: true,
        description: true,
        approval_status: true,
        deadline: true,
        created_date: true,
        program: {
          select: { id: true, program_name: true, program_type: true }
        },
        trainer: {
          select: { id: true, full_name: true, email: true }
        },
        materials: true,
        assessments: {
          select: { id: true, title: true, passing_score: true }
        }
      }
    })
    if (!course) return res.status(404).json({ message: 'Course tidak ditemukan' })
    res.json(course)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET course by trainer (untuk trainer dashboard, optimized)
router.get('/trainer/:trainerId', authMiddleware, async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: { trainer_id: parseInt(req.params.trainerId) },
      select: {
        id: true,
        course_title: true,
        approval_status: true,
        deadline: true,
        program: {
          select: { id: true, program_name: true }
        },
        materials: {
          select: { id: true, material_title: true }
        },
        assessments: {
          select: { id: true, title: true }
        }
      }
    })
    res.json(courses)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST — Trainer buat course baru
router.post('/', authMiddleware, roleMiddleware('TRAINER'), async (req, res) => {
  try {
    const { program_id, course_title, description, deadline } = req.body
    const course = await prisma.course.create({
      data: {
        program_id: parseInt(program_id),
        trainer_id: req.user.user_id,
        course_title,
        description,
        deadline: deadline ? new Date(deadline) : null,
        approval_status: 'draft'
      }
    })
    res.status(201).json(course)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT — Trainer update course
router.put('/:id', authMiddleware, roleMiddleware('TRAINER'), async (req, res) => {
  try {
    const { course_title, description, deadline } = req.body
    const course = await prisma.course.update({
      where: { id: parseInt(req.params.id) },
      data: { course_title, description, deadline: deadline ? new Date(deadline) : null }
    })
    res.json(course)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT — Trainer submit course untuk direview
router.put('/:id/submit', authMiddleware, roleMiddleware('TRAINER'), async (req, res) => {
  try {
    const course = await prisma.course.update({
      where: { id: parseInt(req.params.id) },
      data: { approval_status: 'submitted' }
    })
    res.json(course)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT — HR/Manager approve atau reject course
router.put('/:id/approve', authMiddleware, roleMiddleware('HR', 'MANAGER'), async (req, res) => {
  try {
    const { status } = req.body // 'approved' atau 'rejected'

    const course = await prisma.course.update({
      where: { id: parseInt(req.params.id) },
      data: { approval_status: status }
    })

    // Kalau approved, auto-assign ke semua employee terkait
    if (status === 'approved') {
      const courseWithProgram = await prisma.course.findUnique({
        where: { id: course.id },
        select: {
          course_title: true,
          program: {
            select: { program_type: true, department_id: true }
          }
        }
      })

      let employees = []

      if (courseWithProgram.program.program_type === 'GENERAL') {
        // General → assign ke SEMUA employee
        employees = await prisma.user.findMany({
          where: { status: 'active' },
          select: { id: true }
        })
      } else {
        // Department → assign ke employee departemen terkait
        employees = await prisma.user.findMany({
          where: {
            department_id: courseWithProgram.program.department_id,
            status: 'active'
          },
          select: { id: true }
        })
      }

      const enrollmentData = employees.map(emp => ({
        user_id: emp.id,
        course_id: course.id,
        status: 'assigned'
      }))

      if (enrollmentData.length > 0) {
        await prisma.courseEnrollment.createMany({ data: enrollmentData })
      }

      // Kirim notifikasi ke semua employee yang di-assign
      const notifData = employees.map(emp => ({
        user_id: emp.id,
        title: 'Kursus Baru',
        message: `Anda telah ditugaskan kursus: ${courseWithProgram.course_title}`
      }))

      if (notifData.length > 0) {
        await prisma.notification.createMany({ data: notifData })
      }
    }

    res.json(course)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
