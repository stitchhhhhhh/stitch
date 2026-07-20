const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { authMiddleware, roleMiddleware } = require('../middleware/auth')

const prisma = new PrismaClient()

// HR dan Manager melihat request sesuai kewenangannya
router.get(
  '/',
  authMiddleware,
  roleMiddleware('HR', 'MANAGER'),
  async (req, res) => {
    try {
      const where =
        req.user.role === 'HR'
          ? {
              program: {
                program_type: 'GENERAL'
              }
            }
          : {
              program: {
                program_type: 'DEPARTMENT',
                department_id: req.user.department_id
              }
            }

      const requests = await prisma.courseRequest.findMany({
        where,
        include: {
          program: true,
          requester: {
            select: {
              id: true,
              full_name: true,
              email: true
            }
          },
          trainer: {
            select: {
              id: true,
              full_name: true,
              email: true
            }
          },
          course: true
        },
        orderBy: {
          request_date: 'desc'
        }
      })

      res.json(requests)
    } catch (err) {
      console.error('GET REQUESTS ERROR:', err)

      res.status(500).json({
        message: 'Gagal mengambil course request'
      })
    }
  }
)

// Trainer melihat request miliknya sendiri
router.get(
  '/my-requests',
  authMiddleware,
  roleMiddleware('TRAINER'),
  async (req, res) => {
    try {
      const requests = await prisma.courseRequest.findMany({
        where: {
          trainer_id: req.user.user_id
        },
        include: {
          program: true,
          requester: {
            select: {
              id: true,
              full_name: true,
              email: true
            }
          },
          course: true
        },
        orderBy: {
          request_date: 'desc'
        }
      })

      res.json(requests)
    } catch (err) {
      console.error('GET TRAINER REQUESTS ERROR:', err)

      res.status(500).json({
        message: 'Gagal mengambil permintaan Trainer'
      })
    }
  }
)

// T-010 — HR/Manager mengirim course request ke Trainer
router.post(
  '/',
  authMiddleware,
  roleMiddleware('HR', 'MANAGER'),
  async (req, res) => {
    try {
      const programId = Number(req.body.program_id)
      const trainerId = Number(req.body.trainer_id)

      if (
        !Number.isInteger(programId) ||
        !Number.isInteger(trainerId)
      ) {
        return res.status(400).json({
          message: 'Program dan Trainer wajib dipilih'
        })
      }

      const program = await prisma.trainingProgram.findUnique({
        where: {
          id: programId
        }
      })

      if (!program) {
        return res.status(404).json({
          message: 'Program tidak ditemukan'
        })
      }

      if (
        req.user.role === 'HR' &&
        program.program_type !== 'GENERAL'
      ) {
        return res.status(403).json({
          message: 'HR hanya dapat mengirim request untuk General Program'
        })
      }

      if (
        req.user.role === 'MANAGER' &&
        (
          program.program_type !== 'DEPARTMENT' ||
          program.department_id !== req.user.department_id
        )
      ) {
        return res.status(403).json({
          message: 'Manager hanya dapat mengirim request untuk program departemennya'
        })
      }

      const trainer = await prisma.user.findFirst({
        where: {
          id: trainerId,
          status: 'active',
          role: {
            name: {
              equals: 'TRAINER',
              mode: 'insensitive'
            }
          }
        },
        select: {
          id: true,
          full_name: true,
          email: true
        }
      })

      if (!trainer) {
        return res.status(400).json({
          message: 'Trainer tidak ditemukan atau akun Trainer tidak aktif'
        })
      }

      const duplicateRequest = await prisma.courseRequest.findFirst({
        where: {
          program_id: programId,
          status: {
            in: [
              'pending',
              'in_progress',
              'submitted',
              'revision'
            ]
          }
        }
      })

      if (duplicateRequest) {
        return res.status(409).json({
          message: 'Program ini masih memiliki course request aktif'
        })
      }

      const result = await prisma.$transaction(async (tx) => {
        const request = await tx.courseRequest.create({
          data: {
            program_id: programId,
            trainer_id: trainerId,
            requested_by: req.user.user_id,
            status: 'pending'
          },
          include: {
            program: true,
            trainer: {
              select: {
                id: true,
                full_name: true,
                email: true
              }
            }
          }
        })

        await tx.trainingProgram.update({
          where: {
            id: programId
          },
          data: {
            status: 'requesting_course'
          }
        })

        await tx.notification.create({
          data: {
            user_id: trainerId,
            title: 'Permintaan Kursus Baru',
            message: `Anda mendapat permintaan untuk membuat kursus pada program: ${program.program_name}`
          }
        })

        await tx.auditLog.create({
          data: {
            user_id: req.user.user_id,
            action: 'CREATE_COURSE_REQUEST',
            entity: 'CourseRequest',
            entity_id: request.id,
            description: `Course request dikirim kepada ${trainer.full_name}`
          }
        })

        return request
      })

      res.status(201).json({
        message: 'Course request berhasil dikirim kepada Trainer',
        request: result
      })
    } catch (err) {
      console.error('CREATE REQUEST ERROR:', err)

      res.status(500).json({
        message: 'Gagal mengirim course request'
      })
    }
  }
)

// Trainer mulai mengerjakan request
router.patch(
  '/:id/start',
  authMiddleware,
  roleMiddleware('TRAINER'),
  async (req, res) => {
    try {
      const requestId = Number(req.params.id)

      const existingRequest = await prisma.courseRequest.findUnique({
        where: {
          id: requestId
        }
      })

      if (!existingRequest) {
        return res.status(404).json({
          message: 'Course request tidak ditemukan'
        })
      }

      if (existingRequest.trainer_id !== req.user.user_id) {
        return res.status(403).json({
          message: 'Course request ini bukan milik Anda'
        })
      }

      if (existingRequest.status !== 'pending') {
        return res.status(400).json({
          message: 'Course request tidak dapat dimulai'
        })
      }

      const request = await prisma.$transaction(async (tx) => {
        const updatedRequest = await tx.courseRequest.update({
          where: {
            id: requestId
          },
          data: {
            status: 'in_progress'
          }
        })

        await tx.trainingProgram.update({
          where: {
            id: existingRequest.program_id
          },
          data: {
            status: 'course_in_progress'
          }
        })

        return updatedRequest
      })

      res.json({
        message: 'Course request mulai dikerjakan',
        request
      })
    } catch (err) {
      console.error('START REQUEST ERROR:', err)

      res.status(500).json({
        message: 'Gagal memulai course request'
      })
    }
  }
)

module.exports = router