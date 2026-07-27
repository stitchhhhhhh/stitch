const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const {
  authMiddleware,
  roleMiddleware
} = require('../middleware/auth')

const prisma = new PrismaClient()

// Get assessment results for a user.
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const userId = Number(req.params.userId)

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        message: 'Invalid user ID'
      })
    }

    const isOwner = req.user.user_id === userId

    if (!isOwner) {
      return res.status(403).json({
        message: 'You are not authorized to view these assessment results'
      })
    }

    const results = await prisma.assessmentResult.findMany({
      where: {
        user_id: userId
      },
      include: {
        assessment: true
      },
      orderBy: {
        completed_date: 'desc'
      }
    })

    return res.json(results)
  } catch (error) {
    console.error('Failed to load assessment results:', error)

    return res.status(500).json({
      message: 'Failed to load assessment results'
    })
  }
})

// Submit assessment answers.
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { assessment_id, answers } = req.body

    const assessmentId = Number(assessment_id)
    const userId = Number(req.user?.user_id)

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({
        message: 'Invalid user session'
      })
    }

    if (!Number.isInteger(assessmentId) || assessmentId <= 0) {
      return res.status(400).json({
        message: 'Invalid assessment ID'
      })
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        message: 'Answers must be provided as an array'
      })
    }

    const invalidAnswer = answers.find((answer) => {
      const questionId = Number(answer?.question_id)

      return (
        !answer ||
        !Number.isInteger(questionId) ||
        questionId <= 0 ||
        answer.answer_text === undefined ||
        answer.answer_text === null
      )
    })

    if (invalidAnswer) {
      return res.status(400).json({
        message:
          'Each answer must contain a valid question ID and answer text'
      })
    }

    const assessment = await prisma.assessment.findUnique({
      where: {
        id: assessmentId
      },
      include: {
        questions: true
      }
    })

    if (!assessment) {
      return res.status(404).json({
        message: 'Assessment not found'
      })
    }

    if (
      !Array.isArray(assessment.questions) ||
      assessment.questions.length === 0
    ) {
      return res.status(400).json({
        message: 'This assessment does not contain any questions'
      })
    }

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        user_id_course_id: {
          user_id: userId,
          course_id: assessment.course_id
        }
      }
    })

    if (!enrollment) {
      return res.status(403).json({
        message: 'You are not enrolled in this course'
      })
    }

    const existingResult = await prisma.assessmentResult.findUnique({
      where: {
        assessment_id_user_id: {
          assessment_id: assessmentId,
          user_id: userId
        }
      }
    })

    if (existingResult) {
      return res.status(409).json({
        message: 'You have already completed this assessment'
      })
    }

    const validQuestionIds = new Set(
      assessment.questions.map((question) => question.id)
    )

    const submittedQuestionIds = new Set()

    for (const answer of answers) {
      const questionId = Number(answer.question_id)

      if (!validQuestionIds.has(questionId)) {
        return res.status(400).json({
          message:
            'One or more submitted answers do not belong to this assessment'
        })
      }

      if (submittedQuestionIds.has(questionId)) {
        return res.status(400).json({
          message: 'Duplicate answers were submitted for the same question'
        })
      }

      submittedQuestionIds.add(questionId)
    }

    const answerMap = new Map(
      answers.map((answer) => [
        Number(answer.question_id),
        String(answer.answer_text).trim()
      ])
    )

    let correctCount = 0

    assessment.questions.forEach((question) => {
      const submittedAnswer = answerMap.get(question.id)

      if (
        submittedAnswer !== undefined &&
        submittedAnswer === String(question.correct_answer).trim()
      ) {
        correctCount += 1
      }
    })

    const score =
      (correctCount / assessment.questions.length) * 100

    const passed = score >= assessment.passing_score

    const result = await prisma.$transaction(async (transaction) => {
      const createdResult = await transaction.assessmentResult.create({
        data: {
          assessment_id: assessmentId,
          user_id: userId,
          score
        }
      })

      if (passed) {
        await transaction.user.update({
          where: {
            id: userId
          },
          data: {
            total_points: {
              increment: 10
            }
          }
        })
      }

      return createdResult
    })

    return res.status(201).json({
      result,
      score,
      passed
    })
  } catch (error) {
    if (error?.code === 'P2002') {
      return res.status(409).json({
        message: 'You have already completed this assessment'
      })
    }

    console.error('Failed to submit assessment result:', error)

    return res.status(500).json({
      message: 'Failed to submit assessment result'
    })
  }
})

// Get the most recent assessment results.
//
// HR can view company-wide results.
// Managers can only view results from users in their department.
router.get(
  '/recent',
  authMiddleware,
  roleMiddleware('HR', 'MANAGER'),
  async (req, res) => {
    try {
      if (
        req.user.role === 'MANAGER' &&
        !req.user.department_id
      ) {
        return res.json([])
      }

      const where =
        req.user.role === 'MANAGER'
          ? {
              user: {
                department_id:
                  req.user.department_id
              }
            }
          : {}

      const results =
        await prisma.assessmentResult.findMany({
          where,
          take: 10,
          orderBy: {
            completed_date: 'desc'
          },
          select: {
            id: true,
            assessment_id: true,
            user_id: true,
            score: true,
            completed_date: true,
            user: {
              select: {
                id: true,
                full_name: true,
                email: true,
                department_id: true,
                department: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            },
            assessment: {
              select: {
                id: true,
                title: true,
                passing_score: true,
                course_id: true,
                course: {
                  select: {
                    id: true,
                    course_title: true
                  }
                }
              }
            }
          }
        })

      return res.json(results)
    } catch (error) {
      console.error(
        'GET RECENT ASSESSMENT RESULTS ERROR:',
        error
      )

      return res.status(500).json({
        message:
          'Failed to retrieve recent assessment results'
      })
    }
  }
)

module.exports = router