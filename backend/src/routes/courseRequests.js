const express = require('express')
const { PrismaClient } = require('@prisma/client')

const {
  authMiddleware,
  roleMiddleware
} = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

const REQUEST_STATUSES = [
  'pending',
  'in_progress',
  'submitted',
  'revision',
  'completed',
  'cancelled'
]

const TRAINER_ALLOWED_TRANSITIONS = {
  pending: ['in_progress', 'cancelled'],
  in_progress: ['submitted', 'cancelled'],
  revision: ['in_progress', 'submitted', 'cancelled'],
  submitted: [],
  completed: [],
  cancelled: []
}

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

/**
 * Get all course requests.
 * Accessible only by HR and Manager.
 */
router.get(
  '/',
  authMiddleware,
  roleMiddleware('HR', 'MANAGER'),
  async (req, res) => {
    try {
      const requests =
        await prisma.courseRequest.findMany({
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

      return res.status(200).json(requests)
    } catch (error) {
      console.error(
        'GET COURSE REQUESTS ERROR:',
        error
      )

      return res.status(500).json({
        message:
          'Failed to retrieve course requests.'
      })
    }
  }
)

/**
 * Get course requests assigned to the logged-in trainer.
 */
router.get(
  '/trainer/:trainerId',
  authMiddleware,
  roleMiddleware('TRAINER'),
  async (req, res) => {
    try {
      const trainerId = parsePositiveInteger(
        req.params.trainerId
      )

      if (!trainerId) {
        return res.status(400).json({
          message: 'Invalid trainer ID.'
        })
      }

      if (trainerId !== req.user.user_id) {
        return res.status(403).json({
          message:
            'You are not authorized to access these course requests.'
        })
      }

      const requests =
        await prisma.courseRequest.findMany({
          where: {
            trainer_id: trainerId
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

      return res.status(200).json(requests)
    } catch (error) {
      console.error(
        'GET TRAINER COURSE REQUESTS ERROR:',
        error
      )

      return res.status(500).json({
        message:
          'Failed to retrieve trainer course requests.'
      })
    }
  }
)

/**
 * HR or Manager sends a course request to a Trainer.
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware('HR', 'MANAGER'),
  async (req, res) => {
    try {
      const programId = parsePositiveInteger(
        req.body?.program_id
      )

      const trainerId = parsePositiveInteger(
        req.body?.trainer_id
      )

      if (!programId || !trainerId) {
        return res.status(400).json({
          message:
            'A valid program ID and trainer ID are required.'
        })
      }

      const [program, trainer] =
        await Promise.all([
          prisma.trainingProgram.findUnique({
            where: {
              id: programId
            }
          }),

          prisma.user.findUnique({
            where: {
              id: trainerId
            },
            include: {
              role: true
            }
          })
        ])

      if (!program) {
        return res.status(404).json({
          message:
            'Training program not found.'
        })
      }

      if (!trainer) {
        return res.status(404).json({
          message: 'Trainer not found.'
        })
      }

      const trainerRole = String(
        trainer.role?.name || ''
      )
        .trim()
        .toUpperCase()

      if (trainerRole !== 'TRAINER') {
        return res.status(400).json({
          message:
            'The selected user is not a trainer.'
        })
      }

      if (
        String(trainer.status).toLowerCase() !==
        'active'
      ) {
        return res.status(400).json({
          message:
            'The selected trainer account is inactive.'
        })
      }

      const existingRequest =
        await prisma.courseRequest.findFirst({
          where: {
            program_id: programId,
            trainer_id: trainerId,
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

      if (existingRequest) {
        return res.status(409).json({
          message:
            'An active course request already exists for this trainer and program.'
        })
      }

      const request =
        await prisma.$transaction(
          async (transaction) => {
            const createdRequest =
              await transaction.courseRequest.create({
                data: {
                  program_id: programId,
                  trainer_id: trainerId,
                  requested_by:
                    req.user.user_id,
                  status: 'pending'
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
                  trainer: {
                    select: {
                      id: true,
                      full_name: true,
                      email: true
                    }
                  },
                  course: true
                }
              })

            await transaction.notification.create({
              data: {
                user_id: trainerId,
                title: 'New Course Request',
                message:
                  `You have received a new course request for ${program.program_name}.`
              }
            })

            return createdRequest
          }
        )

      return res.status(201).json(request)
    } catch (error) {
      console.error(
        'CREATE COURSE REQUEST ERROR:',
        error
      )

      return res.status(500).json({
        message:
          'Failed to create the course request.'
      })
    }
  }
)

/**
 * Trainer updates the status of an assigned request.
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('TRAINER'),
  async (req, res) => {
    try {
      const requestId = parsePositiveInteger(
        req.params.id
      )

      const normalizedStatus = String(
        req.body?.status || ''
      )
        .trim()
        .toLowerCase()

      if (!requestId) {
        return res.status(400).json({
          message:
            'Invalid course request ID.'
        })
      }

      if (
        !REQUEST_STATUSES.includes(
          normalizedStatus
        )
      ) {
        return res.status(400).json({
          message:
            'Invalid course request status.'
        })
      }

      const existingRequest =
        await prisma.courseRequest.findUnique({
          where: {
            id: requestId
          }
        })

      if (!existingRequest) {
        return res.status(404).json({
          message:
            'Course request not found.'
        })
      }

      if (
        existingRequest.trainer_id !==
        req.user.user_id
      ) {
        return res.status(403).json({
          message:
            'You are not authorized to update this course request.'
        })
      }

      const allowedNextStatuses =
        TRAINER_ALLOWED_TRANSITIONS[
          existingRequest.status
        ] || []

      if (
        !allowedNextStatuses.includes(
          normalizedStatus
        )
      ) {
        return res.status(409).json({
          message:
            `The request cannot be changed from ${existingRequest.status} to ${normalizedStatus}.`
        })
      }

      const updatedRequest =
        await prisma.courseRequest.update({
          where: {
            id: requestId
          },
          data: {
            status: normalizedStatus
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
            trainer: {
              select: {
                id: true,
                full_name: true,
                email: true
              }
            },
            course: true
          }
        })

      return res.status(200).json(updatedRequest)
    } catch (error) {
      console.error(
        'UPDATE COURSE REQUEST ERROR:',
        error
      )

      return res.status(500).json({
        message:
          'Failed to update the course request.'
      })
    }
  }
)

module.exports = router