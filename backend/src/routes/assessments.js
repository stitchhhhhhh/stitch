const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const {
  authMiddleware,
  roleMiddleware
} = require('../middleware/auth')

const prisma = new PrismaClient()

const EDITABLE_COURSE_STATUSES = [
  'draft',
  'revision',
  'rejected'
]

function parsePositiveInteger(value) {
  const parsed = Number.parseInt(value, 10)

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null
  }

  return parsed
}

function normalizeRole(role) {
  return String(role || '').trim().toUpperCase()
}

function serializeQuestions(questions, includeCorrectAnswer) {
  if (!Array.isArray(questions)) {
    return []
  }

  return questions.map((question) => {
    const serialized = {
      id: question.id,
      assessment_id: question.assessment_id,
      question_text: question.question_text
    }

    if (includeCorrectAnswer) {
      serialized.correct_answer =
        question.correct_answer
    }

    return serialized
  })
}

async function canAccessCourseAssessment({
  user,
  courseId
}) {
  const role = normalizeRole(user?.role)
  const userId = Number(user?.user_id)

  const course = await prisma.course.findUnique({
    where: {
      id: courseId
    },
    select: {
      id: true,
      trainer_id: true,
      approval_status: true
    }
  })

  if (!course) {
    return {
      allowed: false,
      status: 404,
      message: 'Course not found.'
    }
  }

  if (role === 'HR') {
    return {
      allowed: true,
      course,
      includeCorrectAnswer: false
    }
  }

  if (role === 'TRAINER') {
    if (course.trainer_id !== userId) {
      return {
        allowed: false,
        status: 403,
        message:
          'You are not authorized to access assessments for this course.'
      }
    }

    return {
      allowed: true,
      course,
      includeCorrectAnswer: true
    }
  }

  const enrollment =
    await prisma.courseEnrollment.findUnique({
      where: {
        user_id_course_id: {
          user_id: userId,
          course_id: courseId
        }
      },
      select: {
        id: true
      }
    })

  if (!enrollment) {
    return {
      allowed: false,
      status: 403,
      message:
        'You are not enrolled in this course.'
    }
  }

  return {
    allowed: true,
    course,
    includeCorrectAnswer: false
  }
}

async function getTrainerAssessment({
  assessmentId,
  trainerId
}) {
  const assessment =
    await prisma.assessment.findUnique({
      where: {
        id: assessmentId
      },
      include: {
        course: {
          select: {
            id: true,
            trainer_id: true,
            approval_status: true
          }
        }
      }
    })

  if (!assessment) {
    return {
      assessment: null,
      error: {
        status: 404,
        message: 'Assessment not found.'
      }
    }
  }

  if (
    assessment.course.trainer_id !== trainerId
  ) {
    return {
      assessment: null,
      error: {
        status: 403,
        message:
          'You are not authorized to manage this assessment.'
      }
    }
  }

  if (
    !EDITABLE_COURSE_STATUSES.includes(
      assessment.course.approval_status
    )
  ) {
    return {
      assessment: null,
      error: {
        status: 409,
        message:
          `Assessments cannot be changed while the course status is ${assessment.course.approval_status}.`
      }
    }
  }

  return {
    assessment,
    error: null
  }
}

// GET assessments belonging to a course.
router.get(
  '/course/:courseId',
  authMiddleware,
  async (req, res) => {
    try {
      const courseId =
        parsePositiveInteger(req.params.courseId)

      if (!courseId) {
        return res.status(400).json({
          message: 'Invalid course ID.'
        })
      }

      const access =
        await canAccessCourseAssessment({
          user: req.user,
          courseId
        })

      if (!access.allowed) {
        return res
          .status(access.status)
          .json({
            message: access.message
          })
      }

      const assessments =
        await prisma.assessment.findMany({
          where: {
            course_id: courseId
          },
          include: {
            questions: true
          },
          orderBy: {
            id: 'asc'
          }
        })

      const response = assessments.map(
        (assessment) => ({
          ...assessment,
          questions: serializeQuestions(
            assessment.questions,
            access.includeCorrectAnswer
          )
        })
      )

      return res.json(response)
    } catch (error) {
      console.error(
        'GET COURSE ASSESSMENTS ERROR:',
        error
      )

      return res.status(500).json({
        message:
          'Failed to retrieve course assessments.'
      })
    }
  }
)

// GET assessment details and questions.
router.get(
  '/:id',
  authMiddleware,
  async (req, res) => {
    try {
      const assessmentId =
        parsePositiveInteger(req.params.id)

      if (!assessmentId) {
        return res.status(400).json({
          message: 'Invalid assessment ID.'
        })
      }

      const assessment =
        await prisma.assessment.findUnique({
          where: {
            id: assessmentId
          },
          include: {
            questions: true
          }
        })

      if (!assessment) {
        return res.status(404).json({
          message: 'Assessment not found.'
        })
      }

      const access =
        await canAccessCourseAssessment({
          user: req.user,
          courseId: assessment.course_id
        })

      if (!access.allowed) {
        return res
          .status(access.status)
          .json({
            message: access.message
          })
      }

      return res.json({
        ...assessment,
        questions: serializeQuestions(
          assessment.questions,
          access.includeCorrectAnswer
        )
      })
    } catch (error) {
      console.error(
        'GET ASSESSMENT DETAIL ERROR:',
        error
      )

      return res.status(500).json({
        message:
          'Failed to retrieve the assessment.'
      })
    }
  }
)

// POST — Trainer creates an assessment.
router.post(
  '/',
  authMiddleware,
  roleMiddleware('TRAINER'),
  async (req, res) => {
    try {
      const courseId =
        parsePositiveInteger(req.body.course_id)

      const title =
        typeof req.body.title === 'string'
          ? req.body.title.trim()
          : ''

      const passingScore =
        req.body.passing_score === undefined ||
        req.body.passing_score === null ||
        req.body.passing_score === ''
          ? 70
          : Number(req.body.passing_score)

      if (!courseId) {
        return res.status(400).json({
          message: 'Invalid course ID.'
        })
      }

      if (!title) {
        return res.status(400).json({
          message:
            'Assessment title is required.'
        })
      }

      if (
        !Number.isInteger(passingScore) ||
        passingScore < 0 ||
        passingScore > 100
      ) {
        return res.status(400).json({
          message:
            'Passing score must be an integer between 0 and 100.'
        })
      }

      const course =
        await prisma.course.findUnique({
          where: {
            id: courseId
          },
          select: {
            id: true,
            trainer_id: true,
            approval_status: true
          }
        })

      if (!course) {
        return res.status(404).json({
          message: 'Course not found.'
        })
      }

      if (
        course.trainer_id !==
        req.user.user_id
      ) {
        return res.status(403).json({
          message:
            'You are not authorized to create an assessment for this course.'
        })
      }

      if (
        !EDITABLE_COURSE_STATUSES.includes(
          course.approval_status
        )
      ) {
        return res.status(409).json({
          message:
            `An assessment cannot be created while the course status is ${course.approval_status}.`
        })
      }

      const assessment =
        await prisma.assessment.create({
          data: {
            course_id: courseId,
            title,
            passing_score: passingScore
          }
        })

      return res
        .status(201)
        .json(assessment)
    } catch (error) {
      console.error(
        'CREATE ASSESSMENT ERROR:',
        error
      )

      return res.status(500).json({
        message:
          'Failed to create the assessment.'
      })
    }
  }
)

// POST — Trainer adds a question.
router.post(
  '/:id/questions',
  authMiddleware,
  roleMiddleware('TRAINER'),
  async (req, res) => {
    try {
      const assessmentId =
        parsePositiveInteger(req.params.id)

      const questionText =
        typeof req.body.question_text ===
        'string'
          ? req.body.question_text.trim()
          : ''

      const correctAnswer =
        typeof req.body.correct_answer ===
        'string'
          ? req.body.correct_answer.trim()
          : ''

      if (!assessmentId) {
        return res.status(400).json({
          message: 'Invalid assessment ID.'
        })
      }

      if (!questionText) {
        return res.status(400).json({
          message:
            'Question text is required.'
        })
      }

      if (!correctAnswer) {
        return res.status(400).json({
          message:
            'Correct answer is required.'
        })
      }

      const lookup =
        await getTrainerAssessment({
          assessmentId,
          trainerId: req.user.user_id
        })

      if (lookup.error) {
        return res
          .status(lookup.error.status)
          .json({
            message: lookup.error.message
          })
      }

      const question =
        await prisma.question.create({
          data: {
            assessment_id: assessmentId,
            question_text: questionText,
            correct_answer: correctAnswer
          }
        })

      return res
        .status(201)
        .json(question)
    } catch (error) {
      console.error(
        'CREATE ASSESSMENT QUESTION ERROR:',
        error
      )

      return res.status(500).json({
        message:
          'Failed to create the assessment question.'
      })
    }
  }
)

// PUT — Trainer updates a question.
router.put(
  '/questions/:questionId',
  authMiddleware,
  roleMiddleware('TRAINER'),
  async (req, res) => {
    try {
      const questionId =
        parsePositiveInteger(
          req.params.questionId
        )

      if (!questionId) {
        return res.status(400).json({
          message: 'Invalid question ID.'
        })
      }

      const question =
        await prisma.question.findUnique({
          where: {
            id: questionId
          },
          select: {
            id: true,
            assessment_id: true
          }
        })

      if (!question) {
        return res.status(404).json({
          message: 'Question not found.'
        })
      }

      const lookup =
        await getTrainerAssessment({
          assessmentId:
            question.assessment_id,
          trainerId: req.user.user_id
        })

      if (lookup.error) {
        return res
          .status(lookup.error.status)
          .json({
            message: lookup.error.message
          })
      }

      const updateData = {}

      if (
        req.body.question_text !== undefined
      ) {
        const questionText =
          typeof req.body.question_text ===
          'string'
            ? req.body.question_text.trim()
            : ''

        if (!questionText) {
          return res.status(400).json({
            message:
              'Question text cannot be empty.'
          })
        }

        updateData.question_text =
          questionText
      }

      if (
        req.body.correct_answer !== undefined
      ) {
        const correctAnswer =
          typeof req.body.correct_answer ===
          'string'
            ? req.body.correct_answer.trim()
            : ''

        if (!correctAnswer) {
          return res.status(400).json({
            message:
              'Correct answer cannot be empty.'
          })
        }

        updateData.correct_answer =
          correctAnswer
      }

      if (
        Object.keys(updateData).length === 0
      ) {
        return res.status(400).json({
          message:
            'No question changes were provided.'
        })
      }

      const updatedQuestion =
        await prisma.question.update({
          where: {
            id: questionId
          },
          data: updateData
        })

      return res.json(updatedQuestion)
    } catch (error) {
      console.error(
        'UPDATE ASSESSMENT QUESTION ERROR:',
        error
      )

      return res.status(500).json({
        message:
          'Failed to update the assessment question.'
      })
    }
  }
)

// DELETE — Trainer deletes a question.
router.delete(
  '/questions/:questionId',
  authMiddleware,
  roleMiddleware('TRAINER'),
  async (req, res) => {
    try {
      const questionId =
        parsePositiveInteger(
          req.params.questionId
        )

      if (!questionId) {
        return res.status(400).json({
          message: 'Invalid question ID.'
        })
      }

      const question =
        await prisma.question.findUnique({
          where: {
            id: questionId
          },
          select: {
            id: true,
            assessment_id: true
          }
        })

      if (!question) {
        return res.status(404).json({
          message: 'Question not found.'
        })
      }

      const lookup =
        await getTrainerAssessment({
          assessmentId:
            question.assessment_id,
          trainerId: req.user.user_id
        })

      if (lookup.error) {
        return res
          .status(lookup.error.status)
          .json({
            message: lookup.error.message
          })
      }

      await prisma.question.delete({
        where: {
          id: questionId
        }
      })

      return res.json({
        message:
          'Assessment question deleted successfully.'
      })
    } catch (error) {
      console.error(
        'DELETE ASSESSMENT QUESTION ERROR:',
        error
      )

      return res.status(500).json({
        message:
          'Failed to delete the assessment question.'
      })
    }
  }
)

module.exports = router
