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

// GET course milik Trainer yang sedang login
router.get(
  '/my-courses',
  authMiddleware,
  roleMiddleware('TRAINER'),
  async (req, res) => {
    try {
      const courses =
        await prisma.course.findMany({
          where: {
            trainer_id: req.user.user_id
          },
          select: {
            id: true,
            course_title: true,
            description: true,
            approval_status: true,
            deadline: true,
            created_date: true,
            program: {
              select: {
                id: true,
                program_name: true,
                program_type: true
              }
            },
            materials: {
              select: {
                id: true,
                material_title: true,
                material_type: true,
                uploaded_date: true,
                file_url: true
              }
            },
            assessments: {
              select: {
                id: true,
                title: true
              }
            }
          },
          orderBy: {
            created_date: 'desc'
          }
        })

      return res.status(200).json(courses)
    } catch (err) {
      console.error(
        'GET TRAINER COURSES ERROR:',
        err
      )

      return res.status(500).json({
        message:
          'Gagal mengambil course Trainer'
      })
    }
  }
)

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


// PUT — Trainer hanya boleh mengubah course miliknya
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('TRAINER'),
  async (req, res) => {
    try {
      const courseId = Number(req.params.id)
      const {
        course_title,
        description,
        deadline
      } = req.body

      if (!Number.isInteger(courseId)) {
        return res.status(400).json({
          message: 'ID course tidak valid'
        })
      }

      const existingCourse =
        await prisma.course.findUnique({
          where: {
            id: courseId
          },
          select: {
            id: true,
            trainer_id: true,
            approval_status: true
          }
        })

      if (!existingCourse) {
        return res.status(404).json({
          message: 'Course tidak ditemukan'
        })
      }

      if (
        existingCourse.trainer_id !==
        req.user.user_id
      ) {
        return res.status(403).json({
          message:
            'Anda tidak memiliki akses untuk mengubah course ini'
        })
      }

      if (
        !['draft', 'revision'].includes(
          existingCourse.approval_status
        )
      ) {
        return res.status(400).json({
          message:
            'Hanya course berstatus draft atau revision yang dapat diubah'
        })
      }

      if (
        !course_title ||
        !course_title.trim()
      ) {
        return res.status(400).json({
          message: 'Judul course wajib diisi'
        })
      }

      const course =
        await prisma.course.update({
          where: {
            id: courseId
          },
          data: {
            course_title:
              course_title.trim(),
            description:
              description?.trim() || null,
            deadline:
              deadline
                ? new Date(deadline)
                : null
          }
        })

      return res.status(200).json({
        message:
          'Course berhasil diperbarui',
        course
      })
    } catch (err) {
      console.error(
        'UPDATE COURSE ERROR:',
        err
      )

      return res.status(500).json({
        message: err.message
      })
    }
  }
)

// PUT — Trainer hanya boleh submit course miliknya
router.put(
  '/:id/submit',
  authMiddleware,
  roleMiddleware('TRAINER'),
  async (req, res) => {
    try {
      const courseId = Number(req.params.id)

      if (!Number.isInteger(courseId)) {
        return res.status(400).json({
          message: 'ID course tidak valid'
        })
      }

      const existingCourse =
        await prisma.course.findUnique({
          where: {
            id: courseId
          },
          select: {
            id: true,
            trainer_id: true,
            approval_status: true
          }
        })

      if (!existingCourse) {
        return res.status(404).json({
          message: 'Course tidak ditemukan'
        })
      }

      if (
        existingCourse.trainer_id !==
        req.user.user_id
      ) {
        return res.status(403).json({
          message:
            'Anda tidak memiliki akses untuk submit course ini'
        })
      }

      if (
        !['draft', 'revision'].includes(
          existingCourse.approval_status
        )
      ) {
        return res.status(400).json({
          message:
            'Hanya course berstatus draft atau revision yang dapat disubmit'
        })
      }

      const course =
        await prisma.course.update({
          where: {
            id: courseId
          },
          data: {
            approval_status: 'submitted'
          }
        })

      return res.status(200).json({
        message:
          'Course berhasil dikirim untuk direview',
        course
      })
    } catch (err) {
      console.error(
        'SUBMIT COURSE ERROR:',
        err
      )

      return res.status(500).json({
        message: err.message
      })
    }
  }
)

// PUT — HR/Manager approve atau reject course
// T-011 — HR/Manager review course
router.put(
  '/:id/approve',
  authMiddleware,
  roleMiddleware('HR', 'MANAGER'),
  async (req, res) => {
    try {
      const courseId = Number(req.params.id)
      const status = String(req.body.status || '').toLowerCase()
      const reviewNote = String(req.body.review_note || '').trim()

      if (!Number.isInteger(courseId)) {
        return res.status(400).json({
          message: 'ID course tidak valid'
        })
      }

      const allowedStatuses = [
        'approved',
        'rejected',
        'revision'
      ]

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: 'Status review harus approved, rejected, atau revision'
        })
      }

      const existingCourse = await prisma.course.findUnique({
        where: {
          id: courseId
        },
        include: {
          program: true,
          request: true,
          trainer: {
          },
          materials: true,
          assessments: {
            include: {
              questions: true
            }
          }
        }
      })

      if (!existingCourse) {
        return res.status(404).json({
          message: 'Course tidak ditemukan'
        })
      }

      if (existingCourse.approval_status !== 'submitted') {
        return res.status(400).json({
          message: 'Hanya course berstatus submitted yang dapat direview'
        })
      }

      if (
        req.user.role === 'HR' &&
        existingCourse.program.program_type !== 'GENERAL'
      ) {
        return res.status(403).json({
          message: 'HR hanya dapat mereview General Course'
        })
      }

      if (
        req.user.role === 'MANAGER' &&
        (
          existingCourse.program.program_type !== 'DEPARTMENT' ||
          existingCourse.program.department_id !== req.user.department_id
        )
      ) {
        return res.status(403).json({
          message: 'Manager hanya dapat mereview course departemennya'
        })
      }

      if (status === 'approved') {
        if (existingCourse.materials.length === 0) {
          return res.status(400).json({
            message: 'Course belum memiliki learning material'
          })
        }

        if (existingCourse.assessments.length === 0) {
          return res.status(400).json({
            message: 'Course belum memiliki assessment'
          })
        }

        const hasQuestion = existingCourse.assessments.some(
          assessment => assessment.questions.length > 0
        )

        if (!hasQuestion) {
          return res.status(400).json({
            message: 'Assessment belum memiliki pertanyaan'
          })
        }
      }

      const result = await prisma.$transaction(async (tx) => {
        const updatedCourse = await tx.course.update({
          where: {
            id: courseId
          },
          data: {
            approval_status: status
          }
        })

        let enrolledEmployees = 0

        if (status === 'approved') {
          const employeeWhere = {
            status: 'active',
            role: {
              name: {
                equals: 'EMPLOYEE',
                mode: 'insensitive'
              }
            }
          }

          if (existingCourse.program.program_type === 'DEPARTMENT') {
            employeeWhere.department_id =
              existingCourse.program.department_id
          }

          const employees = await tx.user.findMany({
            where: employeeWhere,
            select: {
              id: true
            }
          })

          if (employees.length > 0) {
            const enrollmentData = employees.map(employee => ({
              user_id: employee.id,
              course_id: courseId,
              status: 'assigned'
            }))

            const enrollmentResult =
              await tx.courseEnrollment.createMany({
                data: enrollmentData,
                skipDuplicates: true
              })

            enrolledEmployees = enrollmentResult.count

            await tx.notification.createMany({
              data: employees.map(employee => ({
                user_id: employee.id,
                title: 'Kursus Baru',
                message: `Anda telah ditugaskan kursus: ${existingCourse.course_title}`
              }))
            })
          }

          await tx.trainingProgram.update({
            where: {
              id: existingCourse.program_id
            },
            data: {
              status: 'active'
            }
          })

          if (existingCourse.request) {
            await tx.courseRequest.update({
              where: {
                id: existingCourse.request.id
              },
              data: {
                status: 'completed'
              }
            })
          }
        }

        if (status === 'revision') {
          await tx.trainingProgram.update({
            where: {
              id: existingCourse.program_id
            },
            data: {
              status: 'course_in_progress'
            }
          })

          if (existingCourse.request) {
            await tx.courseRequest.update({
              where: {
                id: existingCourse.request.id
              },
              data: {
                status: 'revision'
              }
            })
          }
        }

        if (status === 'rejected') {
          await tx.trainingProgram.update({
            where: {
              id: existingCourse.program_id
            },
            data: {
              status: 'rejected'
            }
          })
        }

        await tx.notification.create({
          data: {
            user_id: existingCourse.trainer_id,
            title: 'Hasil Review Course',
            message:
              status === 'approved'
                ? `Course "${existingCourse.course_title}" telah disetujui.`
                : status === 'revision'
                  ? `Course "${existingCourse.course_title}" perlu direvisi.${reviewNote ? ` Catatan: ${reviewNote}` : ''}`
                  : `Course "${existingCourse.course_title}" ditolak.${reviewNote ? ` Catatan: ${reviewNote}` : ''}`
          }
        })

        await tx.auditLog.create({
          data: {
            user_id: req.user.user_id,
            action: 'REVIEW_COURSE',
            entity: 'Course',
            entity_id: courseId,
            description: `Course direview dengan status ${status}`
          }
        })

        return {
          course: updatedCourse,
          enrolledEmployees
        }
      })

      res.json({
        message:
          status === 'approved'
            ? 'Course berhasil disetujui'
            : status === 'revision'
              ? 'Course dikembalikan untuk revisi'
              : 'Course berhasil ditolak',
        course: result.course,
        enrolled_employees: result.enrolledEmployees
      })
    } catch (err) {
      console.error('REVIEW COURSE ERROR:', err)

      res.status(500).json({
        message: 'Gagal mereview course'
      })
    }
  }
)

module.exports = router
