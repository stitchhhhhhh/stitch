const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { authMiddleware, roleMiddleware } = require('../middleware/auth')

const prisma = new PrismaClient()

// GET assessment by course
router.get('/course/:courseId', authMiddleware, async (req, res) => {
  try {
    const assessments = await prisma.assessment.findMany({
      where: { course_id: parseInt(req.params.courseId) },
      include: { questions: true }
    })
    res.json(assessments)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET assessment detail + soal
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const assessment = await prisma.assessment.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { questions: true }
    })
    if (!assessment) return res.status(404).json({ message: 'Assessment tidak ditemukan' })
    res.json(assessment)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST — Trainer buat assessment
router.post('/', authMiddleware, roleMiddleware('TRAINER'), async (req, res) => {
  try {
    const { course_id, title, passing_score } = req.body
    const assessment = await prisma.assessment.create({
      data: {
        course_id: parseInt(course_id),
        title,
        passing_score: passing_score ? parseInt(passing_score) : 70
      }
    })
    res.status(201).json(assessment)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST — Trainer tambah soal ke assessment
router.post('/:id/questions', authMiddleware, roleMiddleware('TRAINER'), async (req, res) => {
  try {
    const { question_text, correct_answer } = req.body
    const question = await prisma.question.create({
      data: {
        assessment_id: parseInt(req.params.id),
        question_text,
        correct_answer
      }
    })
    res.status(201).json(question)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT — update soal
router.put('/questions/:questionId', authMiddleware, roleMiddleware('TRAINER'), async (req, res) => {
  try {
    const { question_text, correct_answer } = req.body
    const question = await prisma.question.update({
      where: { id: parseInt(req.params.questionId) },
      data: { question_text, correct_answer }
    })
    res.json(question)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE soal
router.delete('/questions/:questionId', authMiddleware, roleMiddleware('TRAINER'), async (req, res) => {
  try {
    await prisma.question.delete({
      where: { id: parseInt(req.params.questionId) }
    })
    res.json({ message: 'Soal berhasil dihapus' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router