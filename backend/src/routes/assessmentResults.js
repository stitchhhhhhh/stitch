const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { authMiddleware } = require('../middleware/auth')

const prisma = new PrismaClient()

// GET hasil assessment per user
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const results = await prisma.assessmentResult.findMany({
      where: { user_id: parseInt(req.params.userId) },
      include: { assessment: true }
    })
    res.json(results)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST — submit jawaban assessment
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { assessment_id, answers } = req.body
    // answers = [{ question_id, answer_text }, ...]

    const assessment = await prisma.assessment.findUnique({
      where: { id: parseInt(assessment_id) },
      include: { questions: true }
    })

    if (!assessment) return res.status(404).json({ message: 'Assessment tidak ditemukan' })

    // Hitung skor
    let correctCount = 0
    assessment.questions.forEach(q => {
      const userAnswer = answers.find(a => a.question_id === q.id)
      if (userAnswer && userAnswer.answer_text === q.correct_answer) {
        correctCount++
      }
    })

    const score = (correctCount / assessment.questions.length) * 100

    const result = await prisma.assessmentResult.create({
      data: {
        assessment_id: parseInt(assessment_id),
        user_id: req.user.user_id,
        score
      }
    })

    // Kalau lulus (score >= passing_score), tambah poin
    if (score >= assessment.passing_score) {
      await prisma.user.update({
        where: { id: req.user.user_id },
        data: { total_points: { increment: 10 } }
      })
    }

    res.status(201).json({ result, score, passed: score >= assessment.passing_score })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router