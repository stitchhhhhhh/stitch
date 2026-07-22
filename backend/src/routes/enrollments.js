const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const {
  authMiddleware,
  roleMiddleware
} = require('../middleware/auth')

const prisma = new PrismaClient()

function parsePositiveInteger(value) {
  const parsed = Number.parseInt(value, 10)

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null
  }

  return parsed
}

// GET enrollment milik user
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const requestedUserId = parsePositiveInteger(req.params.userId)

    if (!requestedUserId) {
      return res.status(400).json({
        message: 'User ID tidak valid'
      })
    }

    const targetUser = await prisma.user.findUnique({
      where: {
        id: requestedUserId
      },
      select: {
        id: true,
        department_id: true
      }
    })

    if (!targetUser) {
      return res.status(404).json({
        message: 'User tidak ditemukan'
      })
    }

    const isOwner = req.user.user_id === requestedUserId
    const isHR = req.user.role === 'HR'
    const isManagerSameDepartment =
      req.user.role === 'MANAGER' &&
      req.user.department_id === targetUser.department_id

    if (!isOwner && !isHR && !isManagerSameDepartment) {
      return res.status(403).json({
        message: 'Anda tidak memiliki akses ke enrollment ini'
      })
    }

    const enrollments = await prisma.courseEnrollment.findMany({
      where: {
        user_id: requestedUserId
      },
      orderBy: {
        assigned_date: 'desc'
      },
      select: {
        id: true,
        completion_percentage: true,
        status: true,
        assigned_date: true,
        course: {
          select: {
            id: true,
            course_title: true,
            description: true,
            deadline: true,
            approval_status: true,
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
                file_url: true
              }
            },
            assessments: {
              select: {
                id: true,
                title: true
              }
            },
            trainer: {
              select: {
                id: true,
                full_name: true
              }
            }
          }
        }
      }
    })

    return res.json(enrollments)
  } catch (err) {
    console.error('GET USER ENROLLMENTS ERROR:', err)

    return res.status(500).json({
      message: 'Gagal mengambil data enrollment'
    })
  }
})

// GET enrollment berdasarkan department
router.get(
  '/department/:deptId',
  authMiddleware,
  roleMiddleware('HR', 'MANAGER'),
  async (req, res) => {
    try {
      const deptId = parsePositiveInteger(req.params.deptId)

      if (!deptId) {
        return res.status(400).json({
          message: 'Department ID tidak valid'
        })
      }

      if (
        req.user.role === 'MANAGER' &&
        req.user.department_id !== deptId
      ) {
        return res.status(403).json({
          message: 'Manager hanya dapat melihat departemennya sendiri'
        })
      }

      const page = Math.max(
        Number.parseInt(req.query.page, 10) || 1,
        1
      )

      const requestedLimit =
        Number.parseInt(req.query.limit, 10) || 20

      const limit = Math.min(
        Math.max(requestedLimit, 1),
        100
      )

      const skip = (page - 1) * limit

      const where = {
        user: {
          department_id: deptId
        }
      }

      const [enrollments, total] = await Promise.all([
        prisma.courseEnrollment.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            assigned_date: 'desc'
          },
          select: {
            id: true,
            completion_percentage: true,
            status: true,
            assigned_date: true,
            user: {
              select: {
                id: true,
                full_name: true,
                email: true,
                department_id: true
              }
            },
            course: {
              select: {
                id: true,
                course_title: true,
                deadline: true
              }
            }
          }
        }),
        prisma.courseEnrollment.count({
          where
        })
      ])

      return res.json({
        data: enrollments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      })
    } catch (err) {
      console.error('GET DEPARTMENT ENROLLMENTS ERROR:', err)

      return res.status(500).json({
        message: 'Gagal mengambil enrollment department'
      })
    }
  }
)

// PUT progress enrollment
router.put('/:id/progress', authMiddleware, async (req, res) => {
  try {
    const enrollmentId = parsePositiveInteger(req.params.id)
    const percentage = Number(req.body.completion_percentage)

    if (!enrollmentId) {
      return res.status(400).json({
        message: 'Enrollment ID tidak valid'
      })
    }

    if (
      !Number.isFinite(percentage) ||
      percentage < 0 ||
      percentage > 100
    ) {
      return res.status(400).json({
        message: 'Completion percentage harus berada antara 0 sampai 100'
      })
    }

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        id: enrollmentId
      },
      select: {
        id: true,
        user_id: true
      }
    })

    if (!enrollment) {
      return res.status(404).json({
        message: 'Enrollment tidak ditemukan'
      })
    }

    if (enrollment.user_id !== req.user.user_id) {
      return res.status(403).json({
        message: 'Anda hanya dapat mengubah progress milik sendiri'
      })
    }

    const normalizedPercentage = Math.round(percentage)

    const status =
  normalizedPercentage >= 100
    ? 'completed'
    : normalizedPercentage > 0
      ? 'in_progress'
      : 'assigned'

    const updatedEnrollment =
      await prisma.courseEnrollment.update({
        where: {
          id: enrollmentId
        },
        data: {
          completion_percentage: normalizedPercentage,
          status
        }
      })

    return res.json(updatedEnrollment)
  } catch (err) {
    console.error('UPDATE ENROLLMENT PROGRESS ERROR:', err)

    return res.status(500).json({
      message: 'Gagal memperbarui progress'
    })
  }
})

module.exports = router
