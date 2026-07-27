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

function normalizeText(value) {
  return typeof value === 'string'
    ? value.trim()
    : ''
}

const proposalInclude = {
  submitter: {
    select: {
      id: true,
      full_name: true,
      email: true
    }
  },
  approver: {
    select: {
      id: true,
      full_name: true,
      email: true
    }
  },
  department: {
  select: {
    id: true,
    name: true
  }
}
}

// GET proposals.
//
// HR can view all proposals.
// Managers can only view proposals they submitted.
router.get(
  '/',
  authMiddleware,
  roleMiddleware('HR', 'MANAGER'),
  async (req, res) => {
    try {
      const where =
        req.user.role === 'MANAGER'
          ? {
              submitted_by: req.user.user_id
            }
          : {}

      const proposals =
        await prisma.programProposal.findMany({
          where,
          include: proposalInclude,
          orderBy: {
            submitted_date: 'desc'
          }
        })

      return res.json(proposals)
    } catch (error) {
      console.error(
        'GET PROPOSALS ERROR:',
        error
      )

      return res.status(500).json({
        message: 'Failed to load proposals'
      })
    }
  }
)

// POST a new proposal.
//
// A Manager can only create a proposal for their own department.
router.post(
  '/',
  authMiddleware,
  roleMiddleware('MANAGER'),
  async (req, res) => {
    try {
      const proposalTitle = normalizeText(
        req.body.proposal_title
      )

      const description = normalizeText(
        req.body.description
      )

      if (!proposalTitle) {
        return res.status(400).json({
          message: 'Proposal title is required'
        })
      }

      if (!req.user.department_id) {
        return res.status(400).json({
          message:
            'The Manager is not assigned to a department'
        })
      }

      const proposal =
        await prisma.programProposal.create({
          data: {
            proposal_title: proposalTitle,
            description:
              description || null,
            department_id:
              req.user.department_id,
            submitted_by:
              req.user.user_id,
            status: 'pending'
          },
          include: proposalInclude
        })

      return res.status(201).json(proposal)
    } catch (error) {
      console.error(
        'CREATE PROPOSAL ERROR:',
        error
      )

      return res.status(500).json({
        message: 'Failed to create proposal'
      })
    }
  }
)

// PUT a proposal.
//
// Managers can only edit proposals they submitted.
// Only pending or revision proposals can be edited.
// Saving a revision submits it to HR again as pending.
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('MANAGER'),
  async (req, res) => {
    try {
      const proposalId =
        parsePositiveInteger(req.params.id)

      if (!proposalId) {
        return res.status(400).json({
          message: 'Invalid proposal ID'
        })
      }

      const proposalTitle = normalizeText(
        req.body.proposal_title
      )

      const description = normalizeText(
        req.body.description
      )

      if (!proposalTitle) {
        return res.status(400).json({
          message: 'Proposal title is required'
        })
      }

      const existingProposal =
        await prisma.programProposal.findUnique({
          where: {
            id: proposalId
          },
          select: {
            id: true,
            submitted_by: true,
            status: true
          }
        })

      if (!existingProposal) {
        return res.status(404).json({
          message: 'Proposal not found'
        })
      }

      if (
        existingProposal.submitted_by !==
        req.user.user_id
      ) {
        return res.status(403).json({
          message:
            'You can only edit your own proposals'
        })
      }

      if (
        !['pending', 'revision'].includes(
          existingProposal.status
        )
      ) {
        return res.status(409).json({
          message:
            'Only pending or revision proposals can be edited'
        })
      }

      const updatedProposal =
        await prisma.programProposal.update({
          where: {
            id: proposalId
          },
          data: {
            proposal_title: proposalTitle,
            description:
              description || null,
            status:
              existingProposal.status ===
              'revision'
                ? 'pending'
                : existingProposal.status,
            approved_by: null,
            approval_date: null,
            review_note:
              existingProposal.status ===
              'revision'
                ? null
                : undefined
          },
          include: proposalInclude
        })

      return res.json(updatedProposal)
    } catch (error) {
      console.error(
        'UPDATE PROPOSAL ERROR:',
        error
      )

      return res.status(500).json({
        message: 'Failed to update proposal'
      })
    }
  }
)

// PUT HR review result.
router.put(
  '/:id/review',
  authMiddleware,
  roleMiddleware('HR'),
  async (req, res) => {
    try {
      const proposalId =
        parsePositiveInteger(req.params.id)

      if (!proposalId) {
        return res.status(400).json({
          message: 'Invalid proposal ID'
        })
      }

      const status = normalizeText(
        req.body.status
      ).toLowerCase()

      const reviewNote = normalizeText(
        req.body.review_note
      )

      if (
        ![
          'approved',
          'rejected',
          'revision'
        ].includes(status)
      ) {
        return res.status(400).json({
          message:
            'Status must be approved, rejected, or revision'
        })
      }

      const existingProposal =
        await prisma.programProposal.findUnique({
          where: {
            id: proposalId
          }
        })

      if (!existingProposal) {
        return res.status(404).json({
          message: 'Proposal not found'
        })
      }

      if (
        existingProposal.status !== 'pending'
      ) {
        return res.status(409).json({
          message:
            'Only pending proposals can be reviewed'
        })
      }

      const proposal =
        await prisma.$transaction(
          async (transaction) => {
            const reviewedProposal =
              await transaction.programProposal.update({
                where: {
                  id: proposalId
                },
                data: {
                  status,
                  approved_by:
                    req.user.user_id,
                  approval_date: new Date(),
                  review_note:
                    reviewNote || null
                }
              })

            await transaction.notification.create({
              data: {
                user_id:
                  reviewedProposal.submitted_by,
                title: 'Proposal Status',
                message:
                  status === 'approved'
                    ? 'Your proposal has been approved.'
                    : status === 'revision'
                      ? 'Your proposal requires revision.'
                      : 'Your proposal has been rejected.'
              }
            })

            if (status === 'approved') {
              const existingProgram =
                await transaction.trainingProgram.findFirst({
                  where: {
                    proposal_id:
                      reviewedProposal.id
                  }
                })

              if (!existingProgram) {
                await transaction.trainingProgram.create({
                  data: {
                    proposal_id:
                      reviewedProposal.id,
                    program_name:
                      reviewedProposal.proposal_title,
                    description:
                      reviewedProposal.description,
                    program_type:
                      'DEPARTMENT',
                    department_id:
                      reviewedProposal.department_id,
                    created_by:
                      req.user.user_id,
                    status: 'active'
                  }
                })
              }
            }

            return reviewedProposal
          }
        )

      const result =
        await prisma.programProposal.findUnique({
          where: {
            id: proposal.id
          },
          include: proposalInclude
        })

      return res.json(result)
    } catch (error) {
      console.error(
        'REVIEW PROPOSAL ERROR:',
        error
      )

      return res.status(500).json({
        message: 'Failed to review proposal'
      })
    }
  }
)

module.exports = router
