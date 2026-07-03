const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { authMiddleware, roleMiddleware } = require('../middleware/auth')

const prisma = new PrismaClient()

router.get('/', authMiddleware, async (req, res) => {
  try {
    const requests = await prisma.courseRequest.findMany({
      include: { program: true, requester: true, trainer: true, course: true }
    })
    res.json(requests)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/trainer/:trainerId', authMiddleware, async (req, res) => {
  try {
    const requests = await prisma.courseRequest.findMany({
      where: { trainer_id: parseInt(req.params.trainerId) },
      include: { program: true, requester: true }
    })
    res.json(requests)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST — HR/Manager request kursus ke Trainer
router.post('/', authMiddleware, roleMiddleware('HR', 'MANAGER'), async (req, res) => {
  try {
    const { program_id, trainer_id } = req.body
    const request = await prisma.courseRequest.create({
      data: {
        program_id: parseInt(program_id),
        trainer_id: parseInt(trainer_id),
        requested_by: req.user.user_id,
        status: 'pending'
      }
    })

    // Kirim notifikasi otomatis ke Trainer
    const program = await prisma.trainingProgram.findUnique({
      where: { id: parseInt(program_id) }
    })

    await prisma.notification.create({
      data: {
        user_id: parseInt(trainer_id),
        title: 'Permintaan Kursus Baru',
        message: `Anda mendapat permintaan untuk membuat kursus pada program: ${program.program_name}`
      }
    })

    res.status(201).json(request)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.put('/:id', authMiddleware, roleMiddleware('TRAINER'), async (req, res) => {
  try {
    const { status } = req.body
    const request = await prisma.courseRequest.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    })
    res.json(request)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router