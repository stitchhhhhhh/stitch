const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { authMiddleware, roleMiddleware } = require('../middleware/auth')

const prisma = new PrismaClient()

// GET program sesuai role user
router.get('/', authMiddleware, async (req, res) => {
  try {
    let where = {}

    if (req.user.role === 'HR') {
      where = {
        program_type: 'GENERAL'
      }
    } else if (req.user.role === 'MANAGER') {
      where = {
        program_type: 'DEPARTMENT',
        department_id: req.user.department_id
      }
    } else if (req.user.role === 'TRAINER') {
      where = {
        requests: {
          some: {
            trainer_id: req.user.user_id
          }
        }
      }
    } else {
      return res.status(403).json({
        message: 'Akses ditolak'
      })
    }

    const programs = await prisma.trainingProgram.findMany({
      where,
      include: {
        department: true,
        creator: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        },
        courses: true,
        requests: true
      },
      orderBy: {
        created_date: 'desc'
      }
    })

    res.json(programs)
  } catch (err) {
    console.error('GET PROGRAMS ERROR:', err)

    res.status(500).json({
      message: 'Gagal mengambil data program'
    })
  }
})

// GET program berdasarkan ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const programId = Number(req.params.id)

    if (!Number.isInteger(programId)) {
      return res.status(400).json({
        message: 'ID program tidak valid'
      })
    }

    const program = await prisma.trainingProgram.findUnique({
      where: {
        id: programId
      },
      include: {
        department: true,
        creator: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        },
        courses: true,
        requests: {
          include: {
            trainer: {
              select: {
                id: true,
                full_name: true,
                email: true
              }
            }
          }
        }
      }
    })

    if (!program) {
      return res.status(404).json({
        message: 'Program tidak ditemukan'
      })
    }

    if (
      req.user.role === 'MANAGER' &&
      program.department_id !== req.user.department_id
    ) {
      return res.status(403).json({
        message: 'Program bukan milik departemen Anda'
      })
    }

    res.json(program)
  } catch (err) {
    console.error('GET PROGRAM DETAIL ERROR:', err)

    res.status(500).json({
      message: 'Gagal mengambil detail program'
    })
  }
})

// T-009 — HR membuat General Training Program
router.post(
  '/',
  authMiddleware,
  roleMiddleware('HR'),
  async (req, res) => {
    try {
      const programName = String(req.body.program_name || '').trim()
      const description = String(req.body.description || '').trim()

      if (!programName) {
        return res.status(400).json({
          message: 'Nama program wajib diisi'
        })
      }

      const duplicate = await prisma.trainingProgram.findFirst({
        where: {
          program_name: {
            equals: programName,
            mode: 'insensitive'
          },
          program_type: 'GENERAL'
        }
      })

      if (duplicate) {
        return res.status(409).json({
          message: 'General Training Program dengan nama tersebut sudah ada'
        })
      }

      const program = await prisma.$transaction(async (tx) => {
        const createdProgram = await tx.trainingProgram.create({
          data: {
            program_name: programName,
            description: description || null,
            program_type: 'GENERAL',
            created_by: req.user.user_id,
            status: 'draft'
          }
        })

        await tx.auditLog.create({
          data: {
            user_id: req.user.user_id,
            action: 'CREATE_GENERAL_PROGRAM',
            entity: 'TrainingProgram',
            entity_id: createdProgram.id,
            description: `HR membuat General Training Program: ${programName}`
          }
        })

        return createdProgram
      })

      res.status(201).json({
        message: 'General Training Program berhasil dibuat',
        program
      })
    } catch (err) {
      console.error('CREATE PROGRAM ERROR:', err)

      res.status(500).json({
        message: 'Gagal membuat General Training Program'
      })
    }
  }
)

// Update program
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('HR', 'MANAGER'),
  async (req, res) => {
    try {
      const programId = Number(req.params.id)

      if (!Number.isInteger(programId)) {
        return res.status(400).json({
          message: 'ID program tidak valid'
        })
      }

      const existingProgram = await prisma.trainingProgram.findUnique({
        where: {
          id: programId
        }
      })

      if (!existingProgram) {
        return res.status(404).json({
          message: 'Program tidak ditemukan'
        })
      }

      if (
        req.user.role === 'HR' &&
        existingProgram.program_type !== 'GENERAL'
      ) {
        return res.status(403).json({
          message: 'HR hanya dapat mengubah General Training Program'
        })
      }

      if (
        req.user.role === 'MANAGER' &&
        (
          existingProgram.program_type !== 'DEPARTMENT' ||
          existingProgram.department_id !== req.user.department_id
        )
      ) {
        return res.status(403).json({
          message: 'Manager hanya dapat mengubah program departemennya'
        })
      }

      const allowedStatuses = [
        'draft',
        'requesting_course',
        'course_in_progress',
        'waiting_approval',
        'active',
        'rejected',
        'completed'
      ]

      if (
        req.body.status &&
        !allowedStatuses.includes(req.body.status)
      ) {
        return res.status(400).json({
          message: 'Status program tidak valid'
        })
      }

      const program = await prisma.trainingProgram.update({
        where: {
          id: programId
        },
        data: {
          ...(req.body.program_name !== undefined && {
            program_name: String(req.body.program_name).trim()
          }),
          ...(req.body.description !== undefined && {
            description: String(req.body.description).trim() || null
          }),
          ...(req.body.status !== undefined && {
            status: req.body.status
          })
        }
      })

      res.json({
        message: 'Program berhasil diperbarui',
        program
      })
    } catch (err) {
      console.error('UPDATE PROGRAM ERROR:', err)

      res.status(500).json({
        message: 'Gagal memperbarui program'
      })
    }
  }
)

module.exports = router