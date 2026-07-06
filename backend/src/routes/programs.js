const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { authMiddleware, roleMiddleware } = require('../middleware/auth')

const prisma = new PrismaClient()

// GET semua program
router.get('/', authMiddleware, async (req, res) => {
  try {
    const programs = await prisma.trainingProgram.findMany({
      include: { department: true, creator: true, courses: true }
    })
    res.json(programs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET program by id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const program = await prisma.trainingProgram.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { department: true, creator: true, courses: true }
    })
    if (!program) return res.status(404).json({ message: 'Program tidak ditemukan' })
    res.json(program)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST — HR buat General Training Program
router.post('/', authMiddleware, roleMiddleware('HR'), async (req, res) => {
  try {
    const { program_name, description } = req.body
    const program = await prisma.trainingProgram.create({
      data: {
        program_name,
        description,
        program_type: 'GENERAL',
        created_by: req.user.user_id,
        status: 'active'
      }
    })
    res.status(201).json(program)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT — update program
router.put('/:id', authMiddleware, roleMiddleware('HR', 'MANAGER'), async (req, res) => {
  try {
    const { program_name, description, status } = req.body
    const program = await prisma.trainingProgram.update({
      where: { id: parseInt(req.params.id) },
      data: { program_name, description, status }
    })
    res.json(program)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router