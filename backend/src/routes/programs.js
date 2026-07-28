const express = require('express')
const { PrismaClient } = require('@prisma/client')
const {
  authMiddleware,
  roleMiddleware
} = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

function parsePositiveInteger(value) {
  const parsedValue = Number.parseInt(value, 10)

  if (
    !Number.isInteger(parsedValue) ||
    parsedValue <= 0
  ) {
    return null
  }

  return parsedValue
}

function normalizeRequiredText(value) {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim()
}

function normalizeOptionalText(value) {
  if (value === undefined) {
    return undefined
  }

  if (value === null) {
    return null
  }

  const normalizedValue = String(value).trim()

  return normalizedValue || null
}

const programSelect = {
  id: true,
  proposal_id: true,
  program_name: true,
  description: true,
  program_type: true,
  department_id: true,
  created_by: true,
  status: true,
  department: {
    select: {
      id: true,
      name: true
    }
  },
  creator: {
    select: {
      id: true,
      full_name: true,
      email: true
    }
  },
  courses: {
    select: {
      id: true,
      course_title: true,
      approval_status: true,
      deadline: true,
      trainer_id: true
    }
  }
}

function buildProgramAccessFilter(user) {
  switch (user.role) {
    case 'HR':
      return {}

    case 'MANAGER':
      if (!user.department_id) {
        return {
          id: -1
        }
      }

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

    case 'TRAINER':
      return {
        courses: {
          some: {
            trainer_id: user.user_id
          }
        }
      }

    case 'EMPLOYEE':
      return {
        courses: {
          some: {
            enrollments: {
              some: {
                user_id: user.user_id
              }
            }
          }
        }
      }

    default:
      return {
        id: -1
      }
  }
}

async function canAccessProgram(user, programId) {
  const accessFilter = buildProgramAccessFilter(user)

  return prisma.trainingProgram.findFirst({
    where: {
      id: programId,
      ...accessFilter
    },
    select: {
      id: true
    }
  })
}

// Get programs accessible to the logged-in user.
router.get('/', authMiddleware, async (req, res) => {
  try {
    const programs = await prisma.trainingProgram.findMany({
      where: buildProgramAccessFilter(req.user),
      orderBy: {
        program_name: 'asc'
      },
      select: programSelect
    })

    return res.json(programs)
  } catch (error) {
    console.error('GET PROGRAMS ERROR:', error)

    return res.status(500).json({
      message: 'Failed to retrieve training programs'
    })
  }
})

// Get one program when the logged-in user has access to it.
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const programId = parsePositiveInteger(req.params.id)

    if (!programId) {
      return res.status(400).json({
        message: 'Invalid program ID'
      })
    }

    const program = await prisma.trainingProgram.findFirst({
      where: {
        id: programId,
        ...buildProgramAccessFilter(req.user)
      },
      select: programSelect
    })

    if (!program) {
      return res.status(404).json({
        message: 'Training program not found or access denied'
      })
    }

    return res.json(program)
  } catch (error) {
    console.error('GET PROGRAM BY ID ERROR:', error)

    return res.status(500).json({
      message: 'Failed to retrieve the training program'
    })
  }
})

// HR creates a general training program.
router.post(
  '/',
  authMiddleware,
  roleMiddleware('HR'),
  async (req, res) => {
    try {
      const programName = normalizeRequiredText(
        req.body?.program_name
      )

      const description = normalizeOptionalText(
        req.body?.description
      )

      if (!programName) {
        return res.status(400).json({
          message: 'Program name is required'
        })
      }

      const existingProgram =
        await prisma.trainingProgram.findFirst({
          where: {
            program_name: {
              equals: programName,
              mode: 'insensitive'
            },
            program_type: 'GENERAL'
          },
          select: {
            id: true
          }
        })

      if (existingProgram) {
        return res.status(409).json({
          message:
            'A general training program with this name already exists'
        })
      }

      const program = await prisma.trainingProgram.create({
        data: {
          program_name: programName,
          description,
          program_type: 'GENERAL',
          department_id: null,
          created_by: req.user.user_id,
          status: 'active'
        },
        select: programSelect
      })

      return res.status(201).json(program)
    } catch (error) {
      console.error('CREATE PROGRAM ERROR:', error)

      return res.status(500).json({
        message: 'Failed to create the training program'
      })
    }
  }
)

// HR can update any program.
// A Manager can only update a department program belonging to their department.
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('HR', 'MANAGER'),
  async (req, res) => {
    try {
      const programId = parsePositiveInteger(req.params.id)

      if (!programId) {
        return res.status(400).json({
          message: 'Invalid program ID'
        })
      }

      const existingProgram =
        await prisma.trainingProgram.findUnique({
          where: {
            id: programId
          },
          select: {
            id: true,
            program_type: true,
            department_id: true
          }
        })

      if (!existingProgram) {
        return res.status(404).json({
          message: 'Training program not found'
        })
      }

      if (req.user.role === 'MANAGER') {
        if (!req.user.department_id) {
          return res.status(403).json({
            message:
              'The Manager is not assigned to a department'
          })
        }

        if (
          existingProgram.program_type !== 'DEPARTMENT' ||
          existingProgram.department_id !==
            req.user.department_id
        ) {
          return res.status(403).json({
            message:
              'Managers can only update programs belonging to their own department'
          })
        }
      }

      const data = {}

      if (req.body?.program_name !== undefined) {
        const programName = normalizeRequiredText(
          req.body.program_name
        )

        if (!programName) {
          return res.status(400).json({
            message: 'Program name cannot be empty'
          })
        }

        data.program_name = programName
      }

      if (req.body?.description !== undefined) {
        data.description = normalizeOptionalText(
          req.body.description
        )
      }

      if (req.body?.status !== undefined) {
        const status = normalizeRequiredText(
          req.body.status
        ).toLowerCase()

        if (!status) {
          return res.status(400).json({
            message: 'Program status cannot be empty'
          })
        }

        data.status = status
      }

      if (Object.keys(data).length === 0) {
        return res.status(400).json({
          message: 'No valid program update was provided'
        })
      }

      const duplicateProgram =
        data.program_name
          ? await prisma.trainingProgram.findFirst({
              where: {
                id: {
                  not: programId
                },
                program_name: {
                  equals: data.program_name,
                  mode: 'insensitive'
                },
                program_type:
                  existingProgram.program_type,
                department_id:
                  existingProgram.department_id
              },
              select: {
                id: true
              }
            })
          : null

      if (duplicateProgram) {
        return res.status(409).json({
          message:
            'A training program with this name already exists in the same scope'
        })
      }

      const program = await prisma.trainingProgram.update({
        where: {
          id: programId
        },
        data,
        select: programSelect
      })

      return res.json(program)
    } catch (error) {
      console.error('UPDATE PROGRAM ERROR:', error)

      return res.status(500).json({
        message: 'Failed to update the training program'
      })
    }
  }
)

module.exports = router
