const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { authMiddleware, roleMiddleware } = require('../middleware/auth')

const prisma = new PrismaClient()

router.get('/', authMiddleware, async (req, res) => {
  try {
    const proposals = await prisma.programProposal.findMany({
      include: { submitter: true, approver: true }
    })
    res.json(proposals)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', authMiddleware, roleMiddleware('MANAGER'), async (req, res) => {
  try {
    const { proposal_title, description } = req.body

    const proposal = await prisma.programProposal.create({
      data: {
        proposal_title,
        description,
        submitted_by: req.user.user_id,
        status: 'pending'
      }
    })

    res.status(201).json(proposal)

	} catch (err) {
	  console.error('CREATE PROPOSAL ERROR:', err)
	  res.status(500).json({
	    message: err.message,
	    code: err.code,
	    meta: err.meta
	  })
	}
})

// PUT — update proposal biasa (sebelum di-approve)
router.put('/:id', authMiddleware, roleMiddleware('MANAGER'), async (req, res) => {
  try {
    const { proposal_title, description } = req.body

    const proposal = await prisma.programProposal.update({
      where: { id: parseInt(req.params.id) },
      data: {
        proposal_title,
        description
      }
    })

    res.json(proposal)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


router.put(
  '/:id/review',
  authMiddleware,
  roleMiddleware('HR'),
  async (req, res) => {
    try {
const { status } = req.body

console.log('STATUS RECEIVED:', status)
      // update proposal
      const proposal = await prisma.programProposal.update({
      where: {
          id: parseInt(req.params.id)
        },
        data: {
          status,
          approved_by: req.user.user_id,
          approval_date: new Date()
        }
      })
await prisma.notification.create({
  data: {
    user_id: proposal.submitted_by,
    title: 'Status Proposal',
    message:
      status === 'approved'
        ? 'Proposal Anda telah disetujui'
        : 'Proposal Anda ditolak'
  }
})

      // jika approve -> buat training program
      if (status === 'approved') {
        const existingProgram =
          await prisma.trainingProgram.findFirst({
            where: {
              proposal_id: proposal.id
            }
          })

        if (!existingProgram) {
          const createdProgram =
            await prisma.trainingProgram.create({
              data: {
                proposal_id: proposal.id,
                program_name: proposal.proposal_title,
                description: proposal.description,
                program_type: 'DEPARTMENT',
                created_by: proposal.submitted_by,
                status: 'active'
              }
            })

          console.log(
            'TRAINING PROGRAM CREATED:',
            createdProgram
          )
        } else {
          console.log(
            `Program already exists for proposal ${proposal.id}`
          )
        }
      }

      res.json(proposal)

    } catch (err) {
      console.error('APPROVE ERROR:', err)

      res.status(500).json({
        message: err.message,
        code: err.code,
        meta: err.meta
      })
    }
  }
);

module.exports = router
