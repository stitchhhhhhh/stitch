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
    res.status(500).json({ message: err.message })
  }
})

// PUT — update proposal biasa (sebelum di-approve)
router.put('/:id', authMiddleware, roleMiddleware('MANAGER'), async (req, res) => {
  try {
    const { proposal_title, description } = req.body

    const proposal = await prisma.programProposal.update({
      where: { id: parseInt(req.params.id) },
      data: { proposal_title, description }
    })

    res.json(proposal)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.put('/:id/review', authMiddleware, roleMiddleware('HR'), async (req, res) => {
  try {
    const { status } = req.body

    const proposal = await prisma.programProposal.update({
      where: { id: parseInt(req.params.id) },
      data: {
        status,
        approved_by: req.user.user_id,
        approval_date: new Date()
      }
    })

    if (status === 'approved') {
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
    }

    res.json(proposal)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router