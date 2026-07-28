const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { authMiddleware, roleMiddleware } = require('../middleware/auth')

const prisma = new PrismaClient()

// GET semua course (optimized dengan select + pagination)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const courses = await prisma.course.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        course_title: true,
        description: true,
        approval_status: true,
        deadline: true,
        created_date: true,
        program: {
          select: { id: true, program_name: true, program_type: true }
        },
        trainer: {
          select: { id: true, full_name: true }
        },
	materials: {
          select: { id: true, material_title: true, material_type: true, uploaded_date: true, file_url: true }
        },
        assessments: {
          select: { id: true, title: true }
        }
      }
    })

    const total = await prisma.course.count()

    res.json({
      data: courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET course milik trainer yang sedang login
// Diletakkan sebelum route /:id agar path "trainer/me" tidak dianggap sebagai course ID.
router.get('/trainer/me', authMiddleware, roleMiddleware('TRAINER'), async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: { trainer_id: req.user.user_id },
      orderBy: { created_date: 'desc' },
      select: {
        id: true,
        course_title: true,
        description: true,
        approval_status: true,
        deadline: true,
        created_date: true,
        program: {
          select: {
            id: true,
            program_name: true,
            program_type: true,
            department: {
              select: { id: true, name: true }
            }
          }
        },
        materials: {
          select: { id: true }
        },
        assessments: {
          select: { id: true }
        }
      }
    })

    res.json(courses)
  } catch (err) {
    console.error('GET TRAINER COURSES ERROR:', err)
    res.status(500).json({ message: 'Failed to retrieve trainer courses' })
  }
})


// GET department training data for the logged-in manager.
// This endpoint is intentionally placed before /:id so the static path is not parsed as a course ID.
router.get('/manager/department-training', authMiddleware, roleMiddleware('MANAGER'), async (req, res) => {
  try {
    const departmentId = req.user.department_id

    if (!departmentId) {
      return res.status(400).json({ message: 'The manager is not assigned to a department' })
    }

    const courses = await prisma.course.findMany({
      where: {
        program: {
          department_id: departmentId
        }
      },
      orderBy: { created_date: 'desc' },
      select: {
        id: true,
        course_title: true,
        approval_status: true,
        deadline: true,
        created_date: true,
        trainer: {
          select: { id: true, full_name: true }
        },
        program: {
          select: { id: true, program_name: true, status: true }
        },
        enrollments: {
          select: {
            completion_percentage: true,
            status: true
          }
        }
      }
    })

    const formattedCourses = courses.map((course) => {
      const enrollmentCount = course.enrollments.length
      const progress = enrollmentCount === 0
        ? 0
        : Math.round(
            course.enrollments.reduce(
              (sum, enrollment) => sum + enrollment.completion_percentage,
              0
            ) / enrollmentCount
          )

      return {
        id: course.id,
        title: course.course_title,
        trainer: course.trainer?.full_name || '',
        status: course.approval_status,
        deadline: course.deadline,
        createdDate: course.created_date,
        program: course.program,
        progress,
        enrollmentCount
      }
    })

    const stats = {
      waitingForTrainer: formattedCourses.filter((course) => !course.trainer).length,
      inDevelopment: formattedCourses.filter((course) =>
        ['draft', 'revision'].includes(course.status)
      ).length,
      pendingReview: formattedCourses.filter((course) => course.status === 'submitted').length,
      publishedPrograms: formattedCourses.filter((course) => course.status === 'approved').length
    }

    const upcomingDeadlines = formattedCourses
      .filter((course) => course.deadline && new Date(course.deadline) >= new Date())
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 5)
      .map((course) => ({
        courseId: course.id,
        title: course.title,
        deadline: course.deadline
      }))

    const recentActivities = formattedCourses.slice(0, 5).map((course) => ({
      courseId: course.id,
      text: `${course.title} is currently ${course.status.replaceAll('_', ' ')}.`,
      createdDate: course.createdDate
    }))

    const trainerIds = new Set(
      courses.map((course) => course.trainer?.id).filter(Boolean)
    )
    const activeDevelopmentCount = formattedCourses.filter((course) =>
      ['draft', 'revision', 'submitted'].includes(course.status)
    ).length
    const trainerCapacity = trainerIds.size === 0
      ? 0
      : Math.min(100, Math.round((activeDevelopmentCount / (trainerIds.size * 5)) * 100))

    res.json({
      stats,
      courses: formattedCourses,
      upcomingDeadlines,
      recentActivities,
      trainerCapacity
    })
  } catch (err) {
    console.error('GET MANAGER DEPARTMENT TRAINING ERROR:', err)
    res.status(500).json({ message: 'Failed to load department training data' })
  }
})

// PUT a manager review decision or deadline update.
router.put('/:id/manager-review', authMiddleware, roleMiddleware('MANAGER'), async (req, res) => {
  try {
    const courseId = Number(req.params.id)
    const { approval_status, deadline } = req.body
    const allowedStatuses = ['submitted', 'revision', 'approved', 'rejected']

    if (!Number.isInteger(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' })
    }

    if (approval_status && !allowedStatuses.includes(approval_status)) {
      return res.status(400).json({ message: 'Invalid approval status' })
    }

    const existingCourse = await prisma.course.findFirst({
      where: {
        id: courseId,
        program: { department_id: req.user.department_id }
      },
      select: { id: true }
    })

    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found in your department' })
    }

    const data = {}
    if (approval_status) data.approval_status = approval_status
    if (deadline !== undefined) data.deadline = deadline ? new Date(deadline) : null

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: 'No valid update was provided' })
    }

    const course = await prisma.course.update({
      where: { id: courseId },
      data,
      select: {
        id: true,
        course_title: true,
        approval_status: true,
        deadline: true
      }
    })

    res.json(course)
  } catch (err) {
    console.error('MANAGER COURSE REVIEW ERROR:', err)
    res.status(500).json({ message: 'Failed to update course review' })
  }
})

// GET course by trainer (untuk trainer dashboard, optimized)
router.get('/trainer/:trainerId', authMiddleware, async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: { trainer_id: parseInt(req.params.trainerId) },
      select: {
        id: true,
        course_title: true,
        approval_status: true,
        deadline: true,
        program: {
          select: { id: true, program_name: true }
        },
        materials: {
          select: { id: true, material_title: true }
        },
        assessments: {
          select: { id: true, title: true }
        }
      }
    })
    res.json(courses)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET course by id (optimized dengan select)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(req.params.id) },
      select: {
        id: true,
        course_title: true,
        description: true,
        approval_status: true,
        deadline: true,
        created_date: true,
        program: {
          select: { id: true, program_name: true, program_type: true }
        },
        trainer: {
          select: { id: true, full_name: true, email: true }
        },
        materials: true,
        assessments: {
          select: { id: true, title: true, passing_score: true }
        }
      }
    })
    if (!course) return res.status(404).json({ message: 'Course not found.' })
    res.json(course)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST — Trainer creates a course from an accepted course request.
router.post(
  '/',
  authMiddleware,
  roleMiddleware('TRAINER'),
  async (req, res) => {
    try {
      const requestId = Number.parseInt(
        req.body.request_id,
        10
      )

      const programId = Number.parseInt(
        req.body.program_id,
        10
      )

      const courseTitle =
        typeof req.body.course_title === 'string'
          ? req.body.course_title.trim()
          : ''

      const description =
        typeof req.body.description === 'string' &&
        req.body.description.trim()
          ? req.body.description.trim()
          : null

      if (
        !Number.isInteger(requestId) ||
        requestId <= 0
      ) {
        return res.status(400).json({
          message:
            'A valid accepted course request is required.'
        })
      }

      if (
        !Number.isInteger(programId) ||
        programId <= 0
      ) {
        return res.status(400).json({
          message:
            'A valid training program is required.'
        })
      }

      if (!courseTitle) {
        return res.status(400).json({
          message: 'Course title is required.'
        })
      }

      let parsedDeadline = null

      if (req.body.deadline) {
        parsedDeadline = new Date(
          req.body.deadline
        )

        if (
          Number.isNaN(
            parsedDeadline.getTime()
          )
        ) {
          return res.status(400).json({
            message: 'Invalid course deadline.'
          })
        }
      }

      const existingRequest =
        await prisma.courseRequest.findUnique({
          where: {
            id: requestId
          },
          include: {
            program: {
              select: {
                id: true,
                program_name: true
              }
            }
          }
        })

      if (!existingRequest) {
        return res.status(404).json({
          message: 'Course request not found.'
        })
      }

      if (
        existingRequest.trainer_id !==
        req.user.user_id
      ) {
        return res.status(403).json({
          message:
            'You are not authorized to create a course for this request.'
        })
      }

      if (
        existingRequest.program_id !==
        programId
      ) {
        return res.status(400).json({
          message:
            'The selected program does not match the course request.'
        })
      }

      if (
        existingRequest.status !==
        'in_progress'
      ) {
        return res.status(409).json({
          message:
            'The course request must be accepted before creating a course.'
        })
      }

      if (existingRequest.course_id) {
        return res.status(409).json({
          message:
            'A course has already been created for this request.'
        })
      }

      const course = await prisma.$transaction(
        async (transaction) => {
          const createdCourse =
            await transaction.course.create({
              data: {
                program_id: programId,
                trainer_id:
                  req.user.user_id,
                course_title: courseTitle,
                description,
                deadline: parsedDeadline,
                approval_status: 'draft'
              },
              include: {
                program: {
                  select: {
                    id: true,
                    program_name: true,
                    program_type: true
                  }
                },
                trainer: {
                  select: {
                    id: true,
                    full_name: true,
                    email: true
                  }
                }
              }
            })

          /*
           * updateMany makes the operation safer against two
           * simultaneous requests. The request is linked only if
           * it is still accepted and has no course.
           */
          const linkedRequest =
            await transaction.courseRequest.updateMany({
              where: {
                id: requestId,
                trainer_id:
                  req.user.user_id,
                program_id: programId,
                status: 'in_progress',
                course_id: null
              },
              data: {
                course_id: createdCourse.id
              }
            })

          if (linkedRequest.count !== 1) {
            throw new Error(
              'COURSE_REQUEST_ALREADY_LINKED'
            )
          }

          return createdCourse
        }
      )

      return res.status(201).json(course)
    } catch (error) {
      if (
        error.message ===
        'COURSE_REQUEST_ALREADY_LINKED'
      ) {
        return res.status(409).json({
          message:
            'A course has already been created for this request.'
        })
      }

      console.error(
        'CREATE COURSE FROM REQUEST ERROR:',
        error
      )

      return res.status(500).json({
        message:
          'Failed to create the course.'
      })
    }
  }
)

// PUT — Trainer updates a course that belongs to them.
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('TRAINER'),
  async (req, res) => {
    try {
      const courseId = Number.parseInt(
        req.params.id,
        10
      )

      if (
        !Number.isInteger(courseId) ||
        courseId <= 0
      ) {
        return res.status(400).json({
          message: 'Invalid course ID.'
        })
      }

      const existingCourse =
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

      if (!existingCourse) {
        return res.status(404).json({
          message: 'Course not found.'
        })
      }

      if (
        existingCourse.trainer_id !==
        req.user.user_id
      ) {
        return res.status(403).json({
          message:
            'You are not authorized to update this course.'
        })
      }

      if (
        ![
          'draft',
          'revision',
          'rejected'
        ].includes(
          existingCourse.approval_status
        )
      ) {
        return res.status(409).json({
          message:
            `A course with status ${existingCourse.approval_status} cannot be edited.`
        })
      }

      const updateData = {}

      if (
        req.body.course_title !== undefined
      ) {
        const courseTitle =
          typeof req.body.course_title ===
          'string'
            ? req.body.course_title.trim()
            : ''

        if (!courseTitle) {
          return res.status(400).json({
            message:
              'Course title cannot be empty.'
          })
        }

        updateData.course_title =
          courseTitle
      }

      if (
        req.body.description !== undefined
      ) {
        updateData.description =
          typeof req.body.description ===
            'string' &&
          req.body.description.trim()
            ? req.body.description.trim()
            : null
      }

      if (req.body.deadline !== undefined) {
        if (!req.body.deadline) {
          updateData.deadline = null
        } else {
          const parsedDeadline = new Date(
            req.body.deadline
          )

          if (
            Number.isNaN(
              parsedDeadline.getTime()
            )
          ) {
            return res.status(400).json({
              message:
                'Invalid course deadline.'
            })
          }

          updateData.deadline =
            parsedDeadline
        }
      }

      if (
        Object.keys(updateData).length === 0
      ) {
        return res.status(400).json({
          message:
            'No valid course update was provided.'
        })
      }

      const course =
        await prisma.course.update({
          where: {
            id: courseId
          },
          data: updateData,
          include: {
            program: {
              select: {
                id: true,
                program_name: true,
                program_type: true
              }
            },
            materials: {
              select: {
                id: true
              }
            },
            assessments: {
              select: {
                id: true
              }
            }
          }
        })

      return res.json(course)
    } catch (error) {
      console.error(
        'UPDATE COURSE ERROR:',
        error
      )

      return res.status(500).json({
        message:
          'Failed to update the course.'
      })
    }
  }
)

// PUT — Trainer submits a course for review.
router.put(
  '/:id/submit',
  authMiddleware,
  roleMiddleware('TRAINER'),
  async (req, res) => {
    try {
      const courseId = Number.parseInt(
        req.params.id,
        10
      )

      if (
        !Number.isInteger(courseId) ||
        courseId <= 0
      ) {
        return res.status(400).json({
          message: 'Invalid course ID.'
        })
      }

      const existingCourse =
        await prisma.course.findUnique({
          where: {
            id: courseId
          },
          include: {
            requests: true
          }
        })

      if (!existingCourse) {
        return res.status(404).json({
          message: 'Course not found.'
        })
      }

      if (
        existingCourse.trainer_id !==
        req.user.user_id
      ) {
        return res.status(403).json({
          message:
            'You are not authorized to submit this course.'
        })
      }

      if (
        ![
          'draft',
          'revision',
          'rejected'
        ].includes(
          existingCourse.approval_status
        )
      ) {
        return res.status(409).json({
          message:
            `A course with status ${existingCourse.approval_status} cannot be submitted.`
        })
      }

      const linkedRequest =
  existingCourse.requests &&
  existingCourse.requests.trainer_id ===
    req.user.user_id &&
  existingCourse.requests.course_id ===
    courseId
    ? existingCourse.requests
    : null
      if (!linkedRequest) {
        return res.status(409).json({
          message:
            'This course is not linked to a course request.'
        })
      }

      if (
        ![
          'in_progress',
          'revision'
        ].includes(linkedRequest.status)
      ) {
        return res.status(409).json({
          message:
            `A course request with status ${linkedRequest.status} cannot be submitted.`
        })
      }

      const course = await prisma.$transaction(
        async (transaction) => {
          const updatedCourse =
            await transaction.course.update({
              where: {
                id: courseId
              },
              data: {
                approval_status:
                  'submitted'
              },
              include: {
                program: {
                  select: {
                    id: true,
                    program_name: true,
                    program_type: true
                  }
                },
                trainer: {
                  select: {
                    id: true,
                    full_name: true,
                    email: true
                  }
                }
              }
            })

          await transaction.courseRequest.update({
            where: {
              id: linkedRequest.id
            },
            data: {
              status: 'submitted'
            }
          })

          if (linkedRequest.requested_by) {
            await transaction.notification.create({
              data: {
                user_id:
                  linkedRequest.requested_by,
                title:
                  'Course Submitted for Review',
                message:
                  `${existingCourse.course_title} has been submitted for review.`
              }
            })
          }

          return updatedCourse
        }
      )

      return res.json(course)
    } catch (error) {
      console.error(
        'SUBMIT COURSE ERROR:',
        error
      )

      return res.status(500).json({
        message:
          'Failed to submit the course.'
      })
    }
  }
)

// PUT — HR or Manager approves or rejects a submitted course.
router.put(
  '/:id/approve',
  authMiddleware,
  roleMiddleware('HR', 'MANAGER'),
  async (req, res) => {
    try {
      const courseId = Number.parseInt(
        req.params.id,
        10
      )

      const normalizedStatus = String(
        req.body.status || ''
      )
        .trim()
        .toLowerCase()

      if (
        !Number.isInteger(courseId) ||
        courseId <= 0
      ) {
        return res.status(400).json({
          message: 'Invalid course ID.'
        })
      }

      if (
        ![
          'approved',
          'rejected'
        ].includes(normalizedStatus)
      ) {
        return res.status(400).json({
          message:
            'Status must be approved or rejected.'
        })
      }

      const existingCourse =
        await prisma.course.findUnique({
          where: {
            id: courseId
          },
          include: {
            requests: true,
            program: {
              select: {
                program_type: true,
                department_id: true
              }
            }
          }
        })

      if (!existingCourse) {
        return res.status(404).json({
          message: 'Course not found.'
        })
      }

      if (req.user.role === 'MANAGER') {
        if (!req.user.department_id) {
          return res.status(403).json({
            message:
              'You are not assigned to a department.'
          })
        }

        if (
          existingCourse.program
            ?.department_id !==
          req.user.department_id
        ) {
          return res.status(403).json({
            message:
              'You are not authorized to review courses outside your department.'
          })
        }
      }

      if (
        existingCourse.approval_status !==
        'submitted'
      ) {
        return res.status(409).json({
          message:
            'Only submitted courses can be reviewed.'
        })
      }

      const linkedRequest =
  existingCourse.requests?.course_id ===
  courseId
    ? existingCourse.requests
    : null

      if (!linkedRequest) {
        return res.status(409).json({
          message:
            'This course is not linked to a course request.'
        })
      }

      if (
        existingCourse.program
          ?.program_type !== 'GENERAL' &&
        !existingCourse.program
          ?.department_id
      ) {
        return res.status(409).json({
          message:
            'The department training program is not linked to a department.'
        })
      }

      const course = await prisma.$transaction(
        async (transaction) => {
          const updatedCourse =
            await transaction.course.update({
              where: {
                id: courseId
              },
              data: {
                approval_status:
                  normalizedStatus
              },
              include: {
                program: true,
                trainer: {
                  select: {
                    id: true,
                    full_name: true,
                    email: true
                  }
                }
              }
            })

          await transaction.courseRequest.update({
            where: {
              id: linkedRequest.id
            },
            data: {
              status:
                normalizedStatus ===
                'approved'
                  ? 'completed'
                  : 'revision'
            }
          })

          await transaction.notification.create({
            data: {
              user_id:
                linkedRequest.trainer_id,
              title:
                normalizedStatus ===
                'approved'
                  ? 'Course Approved'
                  : 'Course Revision Required',
              message:
                normalizedStatus ===
                'approved'
                  ? `${existingCourse.course_title} has been approved.`
                  : `${existingCourse.course_title} requires revision.`
            }
          })

          if (
            normalizedStatus ===
            'approved'
          ) {
            const employeeWhere = {
              status: 'active',
              role: {
                name: 'EMPLOYEE'
              }
            }

            if (
              existingCourse.program
                .program_type !== 'GENERAL'
            ) {
              employeeWhere.department_id =
                existingCourse.program
                  .department_id
            }

            const employees =
              await transaction.user.findMany({
                where: employeeWhere,
                select: {
                  id: true
                }
              })

            if (employees.length > 0) {
              const employeeIds =
                employees.map(
                  (employee) => employee.id
                )

              const existingEnrollments =
                await transaction.courseEnrollment.findMany({
                  where: {
                    course_id: courseId,
                    user_id: {
                      in: employeeIds
                    }
                  },
                  select: {
                    user_id: true
                  }
                })

              const enrolledUserIds =
                new Set(
                  existingEnrollments.map(
                    (enrollment) =>
                      enrollment.user_id
                  )
                )

              const employeesToEnroll =
                employees.filter(
                  (employee) =>
                    !enrolledUserIds.has(
                      employee.id
                    )
                )

              if (
                employeesToEnroll.length > 0
              ) {
                await transaction.courseEnrollment.createMany({
                  data:
                    employeesToEnroll.map(
                      (employee) => ({
                        user_id:
                          employee.id,
                        course_id:
                          courseId,
                        status:
                          'assigned'
                      })
                    )
                })

                await transaction.notification.createMany({
                  data:
                    employeesToEnroll.map(
                      (employee) => ({
                        user_id:
                          employee.id,
                        title:
                          'New Course Assigned',
                        message:
                          `You have been assigned to the course: ${existingCourse.course_title}`
                      })
                    )
                })
              }
            }
          }

          return updatedCourse
        }
      )

      return res.json(course)
    } catch (error) {
      console.error(
        'COURSE APPROVAL ERROR:',
        error
      )

      return res.status(500).json({
        message:
          'Failed to review the course.'
      })
    }
  }
)

module.exports = router
