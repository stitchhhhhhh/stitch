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

const REQUIRED_OPTION_COUNT = 4

function parsePositiveInteger(value) {
  const parsed = Number.parseInt(value, 10)

  if (
    !Number.isInteger(parsed) ||
    parsed <= 0
  ) {
    return null
  }

  return parsed
}

function normalizeRole(role) {
  return String(role || '')
    .trim()
    .toUpperCase()
}

function normalizeText(value) {
  return typeof value === 'string'
    ? value.trim()
    : ''
}

/**
 * Accept these payload formats:
 *
 * 1. Array of strings:
 * options: [
 *   "Option A",
 *   "Option B",
 *   "Option C",
 *   "Option D"
 * ]
 *
 * 2. Array of objects:
 * options: [
 *   { option_text: "Option A", position: 1 },
 *   { option_text: "Option B", position: 2 },
 *   { option_text: "Option C", position: 3 },
 *   { option_text: "Option D", position: 4 }
 * ]
 */
function normalizeOptions(rawOptions) {
  if (!Array.isArray(rawOptions)) {
    return []
  }

  return rawOptions.map((option, index) => {
    if (typeof option === 'string') {
      return {
        option_text: option.trim(),
        position: index + 1
      }
    }

    const position = Number(option?.position)

    return {
      option_text: normalizeText(
        option?.option_text ??
          option?.text ??
          option?.label ??
          option?.value
      ),
      position:
        Number.isInteger(position) &&
        position > 0
          ? position
          : index + 1
    }
  })
}

/**
 * correct_answer may be:
 *
 * - "A", "B", "C", "D"
 * - "1", "2", "3", "4"
 * - option position as a number
 * - complete option text
 */
function resolveCorrectOption({
  options,
  correctAnswer,
  correctOption
}) {
  const rawValue =
    correctOption ??
    correctAnswer

  if (
    rawValue === undefined ||
    rawValue === null
  ) {
    return null
  }

  const normalizedValue = String(rawValue)
    .trim()

  if (!normalizedValue) {
    return null
  }

  const letterPositions = {
    A: 1,
    B: 2,
    C: 3,
    D: 4
  }

  const upperValue =
    normalizedValue.toUpperCase()

  if (letterPositions[upperValue]) {
    return (
      options.find(
        (option) =>
          option.position ===
          letterPositions[upperValue]
      ) || null
    )
  }

  const numericPosition =
    Number(normalizedValue)

  if (
    Number.isInteger(numericPosition) &&
    numericPosition > 0
  ) {
    const optionByPosition =
      options.find(
        (option) =>
          option.position ===
          numericPosition
      )

    if (optionByPosition) {
      return optionByPosition
    }
  }

  return (
    options.find(
      (option) =>
        option.option_text
          .toLowerCase() ===
        normalizedValue.toLowerCase()
    ) || null
  )
}

function validateQuestionPayload(body) {
  const questionText =
    normalizeText(body?.question_text)

  const options =
    normalizeOptions(body?.options)

  if (!questionText) {
    return {
      error:
        'Question text is required.'
    }
  }

  if (
    options.length !==
    REQUIRED_OPTION_COUNT
  ) {
    return {
      error:
        'Exactly four answer options are required.'
    }
  }

  if (
    options.some(
      (option) =>
        !option.option_text
    )
  ) {
    return {
      error:
        'All answer options are required.'
    }
  }

  const uniquePositions =
    new Set(
      options.map(
        (option) => option.position
      )
    )

  if (
    uniquePositions.size !==
    REQUIRED_OPTION_COUNT
  ) {
    return {
      error:
        'Each answer option must have a unique position.'
    }
  }

  const sortedOptions = [...options].sort(
    (first, second) =>
      first.position - second.position
  )

  const expectedPositions = [1, 2, 3, 4]

  const hasValidPositions =
    sortedOptions.every(
      (option, index) =>
        option.position ===
        expectedPositions[index]
    )

  if (!hasValidPositions) {
    return {
      error:
        'Answer option positions must be 1, 2, 3, and 4.'
    }
  }

  const normalizedOptionTexts =
    sortedOptions.map(
      (option) =>
        option.option_text.toLowerCase()
    )

  if (
    new Set(normalizedOptionTexts).size !==
    REQUIRED_OPTION_COUNT
  ) {
    return {
      error:
        'Answer options must be different from each other.'
    }
  }

  const correctOption =
    resolveCorrectOption({
      options: sortedOptions,
      correctAnswer:
        body?.correct_answer,
      correctOption:
        body?.correct_option
    })

  if (!correctOption) {
    return {
      error:
        'Please select a valid correct answer.'
    }
  }

  return {
    questionText,
    options: sortedOptions,
    correctOption
  }
}

function serializeOption(
  option,
  includeCorrectAnswer
) {
  const serialized = {
    id: option.id,
    option_id: option.id,
    question_id:
      option.question_id,
    option_text:
      option.option_text,
    text:
      option.option_text,
    position:
      option.position
  }

  if (includeCorrectAnswer) {
    serialized.is_correct =
      Boolean(option.is_correct)
  }

  return serialized
}

function serializeQuestion(
  question,
  includeCorrectAnswer
) {
  const options = Array.isArray(
    question.options
  )
    ? [...question.options]
        .sort(
          (first, second) =>
            first.position -
            second.position
        )
        .map((option) =>
          serializeOption(
            option,
            includeCorrectAnswer
          )
        )
    : []

  const serialized = {
    id: question.id,
    question_id: question.id,
    assessment_id:
      question.assessment_id,
    question_text:
      question.question_text,
    options
  }

  if (includeCorrectAnswer) {
    serialized.correct_answer =
      question.correct_answer

    const correctOption =
      options.find(
        (option) =>
          option.is_correct
      )

    serialized.correct_option =
      correctOption
        ? correctOption.position
        : null
  }

  return serialized
}

function serializeQuestions(
  questions,
  includeCorrectAnswer
) {
  if (!Array.isArray(questions)) {
    return []
  }

  return questions.map((question) =>
    serializeQuestion(
      question,
      includeCorrectAnswer
    )
  )
}

async function canAccessCourseAssessment({
  user,
  courseId
}) {
  const role = normalizeRole(user?.role)
  const userId =
    Number(user?.user_id)

  if (
    !Number.isInteger(userId) ||
    userId <= 0
  ) {
    return {
      allowed: false,
      status: 401,
      message:
        'Invalid user session.'
    }
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
    return {
      allowed: false,
      status: 404,
      message:
        'Course not found.'
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
    if (
      course.trainer_id !== userId
    ) {
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
        message:
          'Assessment not found.'
      }
    }
  }

  if (
    assessment.course.trainer_id !==
    trainerId
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
      assessment.course
        .approval_status
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

/**
 * GET /api/assessments/course/:courseId
 *
 * Get all assessments belonging to a course.
 */
router.get(
  '/course/:courseId',
  authMiddleware,
  async (req, res) => {
    try {
      const courseId =
        parsePositiveInteger(
          req.params.courseId
        )

      if (!courseId) {
        return res.status(400).json({
          message:
            'Invalid course ID.'
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
            message:
              access.message
          })
      }

      const assessments =
        await prisma.assessment.findMany({
          where: {
            course_id: courseId
          },
          include: {
            questions: {
              include: {
                options: {
                  orderBy: {
                    position: 'asc'
                  }
                }
              },
              orderBy: {
                id: 'asc'
              }
            }
          },
          orderBy: {
            id: 'asc'
          }
        })

      const response =
        assessments.map(
          (assessment) => ({
            ...assessment,
            questions:
              serializeQuestions(
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

/**
 * GET /api/assessments/:id
 *
 * Get one assessment with its questions and options.
 */
router.get(
  '/:id',
  authMiddleware,
  async (req, res) => {
    try {
      const assessmentId =
        parsePositiveInteger(
          req.params.id
        )

      if (!assessmentId) {
        return res.status(400).json({
          message:
            'Invalid assessment ID.'
        })
      }

      const assessment =
        await prisma.assessment.findUnique({
          where: {
            id: assessmentId
          },
          include: {
            questions: {
              include: {
                options: {
                  orderBy: {
                    position: 'asc'
                  }
                }
              },
              orderBy: {
                id: 'asc'
              }
            }
          }
        })

      if (!assessment) {
        return res.status(404).json({
          message:
            'Assessment not found.'
        })
      }

      const access =
        await canAccessCourseAssessment({
          user: req.user,
          courseId:
            assessment.course_id
        })

      if (!access.allowed) {
        return res
          .status(access.status)
          .json({
            message:
              access.message
          })
      }

      return res.json({
        ...assessment,
        questions:
          serializeQuestions(
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

/**
 * POST /api/assessments
 *
 * Trainer creates an assessment.
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware('TRAINER'),
  async (req, res) => {
    try {
      const courseId =
        parsePositiveInteger(
          req.body.course_id
        )

      const title =
        normalizeText(
          req.body.title
        )

      const passingScore =
        req.body.passing_score ===
          undefined ||
        req.body.passing_score ===
          null ||
        req.body.passing_score === ''
          ? 70
          : Number(
              req.body.passing_score
            )

      if (!courseId) {
        return res.status(400).json({
          message:
            'Invalid course ID.'
        })
      }

      if (!title) {
        return res.status(400).json({
          message:
            'Assessment title is required.'
        })
      }

      if (
        !Number.isInteger(
          passingScore
        ) ||
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
          message:
            'Course not found.'
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
            passing_score:
              passingScore
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

/**
 * POST /api/assessments/:id/questions
 *
 * Trainer creates a question and four answer options.
 *
 * Expected body:
 *
 * {
 *   "question_text": "What is phishing?",
 *   "options": [
 *     "A fake security attack",
 *     "A database backup",
 *     "A programming language",
 *     "A network device"
 *   ],
 *   "correct_answer": "A"
 * }
 */
router.post(
  '/:id/questions',
  authMiddleware,
  roleMiddleware('TRAINER'),
  async (req, res) => {
    try {
      const assessmentId =
        parsePositiveInteger(
          req.params.id
        )

      if (!assessmentId) {
        return res.status(400).json({
          message:
            'Invalid assessment ID.'
        })
      }

      const validation =
        validateQuestionPayload(
          req.body
        )

      if (validation.error) {
        return res.status(400).json({
          message:
            validation.error
        })
      }

      const lookup =
        await getTrainerAssessment({
          assessmentId,
          trainerId:
            req.user.user_id
        })

      if (lookup.error) {
        return res
          .status(
            lookup.error.status
          )
          .json({
            message:
              lookup.error.message
          })
      }

      const createdQuestion =
        await prisma.$transaction(
          async (transaction) => {
            const question =
              await transaction.question.create({
                data: {
                  assessment_id:
                    assessmentId,
                  question_text:
                    validation.questionText,

                  // Keep the correct option text here
                  // because assessmentResults.js compares
                  // submitted answer_text against this value.
                  correct_answer:
                    validation.correctOption
                      .option_text
                }
              })

            await transaction.questionOption.createMany({
              data:
                validation.options.map(
                  (option) => ({
                    question_id:
                      question.id,
                    option_text:
                      option.option_text,
                    position:
                      option.position,
                    is_correct:
                      option.position ===
                      validation.correctOption
                        .position
                  })
                )
            })

            return transaction.question.findUnique({
              where: {
                id: question.id
              },
              include: {
                options: {
                  orderBy: {
                    position: 'asc'
                  }
                }
              }
            })
          }
        )

      return res
        .status(201)
        .json(
          serializeQuestion(
            createdQuestion,
            true
          )
        )
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

/**
 * PUT /api/assessments/questions/:questionId
 *
 * Trainer updates a question and replaces all options.
 */
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
          message:
            'Invalid question ID.'
        })
      }

      const existingQuestion =
        await prisma.question.findUnique({
          where: {
            id: questionId
          },
          select: {
            id: true,
            assessment_id: true
          }
        })

      if (!existingQuestion) {
        return res.status(404).json({
          message:
            'Assessment question not found.'
        })
      }

      const lookup =
        await getTrainerAssessment({
          assessmentId:
            existingQuestion.assessment_id,
          trainerId:
            req.user.user_id
        })

      if (lookup.error) {
        return res
          .status(
            lookup.error.status
          )
          .json({
            message:
              lookup.error.message
          })
      }

      const validation =
        validateQuestionPayload(
          req.body
        )

      if (validation.error) {
        return res.status(400).json({
          message:
            validation.error
        })
      }

      const updatedQuestion =
        await prisma.$transaction(
          async (transaction) => {
            await transaction.question.update({
              where: {
                id: questionId
              },
              data: {
                question_text:
                  validation.questionText,
                correct_answer:
                  validation.correctOption
                    .option_text
              }
            })

            await transaction.questionOption.deleteMany({
              where: {
                question_id:
                  questionId
              }
            })

            await transaction.questionOption.createMany({
              data:
                validation.options.map(
                  (option) => ({
                    question_id:
                      questionId,
                    option_text:
                      option.option_text,
                    position:
                      option.position,
                    is_correct:
                      option.position ===
                      validation.correctOption
                        .position
                  })
                )
            })

            return transaction.question.findUnique({
              where: {
                id: questionId
              },
              include: {
                options: {
                  orderBy: {
                    position: 'asc'
                  }
                }
              }
            })
          }
        )

      return res.json(
        serializeQuestion(
          updatedQuestion,
          true
        )
      )
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

/**
 * DELETE /api/assessments/questions/:questionId
 *
 * Trainer deletes a question.
 * Question options are automatically deleted through onDelete: Cascade.
 */
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
          message:
            'Invalid question ID.'
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
          message:
            'Assessment question not found.'
        })
      }

      const lookup =
        await getTrainerAssessment({
          assessmentId:
            question.assessment_id,
          trainerId:
            req.user.user_id
        })

      if (lookup.error) {
        return res
          .status(
            lookup.error.status
          )
          .json({
            message:
              lookup.error.message
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