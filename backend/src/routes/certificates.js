const express = require('express')
const PDFDocument = require('pdfkit')
const { PrismaClient } = require('@prisma/client')
const cloudinary = require('../config/cloudinary')
const {
  authMiddleware,
  roleMiddleware
} = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

function parsePositiveInteger(value) {
  const parsedValue = Number.parseInt(value, 10)

  if (
    !Number.isInteger(parsedValue) ||
    parsedValue <= 0
  ) {
    return null
  }

  return parsedValue
}

const certificateSelect = {
  id: true,
  user_id: true,
  course_id: true,
  certificate_number: true,
  issue_date: true,
  file_url: true,
  course: {
    select: {
      id: true,
      course_title: true,
      approval_status: true,
      program: {
        select: {
          id: true,
          program_name: true,
          program_type: true,
          department_id: true
        }
      }
    }
  }
}

const recentCertificateSelect = {
  ...certificateSelect,
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
  }
}

// Get certificate history for a user.
//
// The owner and HR can access the certificate history.
// A Manager can only access users from their own department.
router.get(
  '/user/:userId',
  authMiddleware,
  async (req, res) => {
    try {
      const requestedUserId = parsePositiveInteger(
        req.params.userId
      )

      if (!requestedUserId) {
        return res.status(400).json({
          message: 'Invalid user ID'
        })
      }

      const targetUser = await prisma.user.findUnique({
        where: {
          id: requestedUserId
        },
        select: {
          id: true,
          department_id: true
        }
      })

      if (!targetUser) {
        return res.status(404).json({
          message: 'User not found'
        })
      }

      const isOwner =
        req.user.user_id === requestedUserId

      const isHR =
        req.user.role === 'HR'

      const isManagerSameDepartment =
        req.user.role === 'MANAGER' &&
        Boolean(req.user.department_id) &&
        req.user.department_id ===
          targetUser.department_id

      if (
        !isOwner &&
        !isHR &&
        !isManagerSameDepartment
      ) {
        return res.status(403).json({
          message:
            'You are not authorized to view these certificates'
        })
      }

      const certificates =
        await prisma.certificate.findMany({
          where: {
            user_id: requestedUserId
          },
          orderBy: {
            issue_date: 'desc'
          },
          select: certificateSelect
        })

      return res.json(certificates)
    } catch (error) {
      console.error(
        'GET USER CERTIFICATES ERROR:',
        error
      )

      return res.status(500).json({
        message: 'Failed to retrieve certificates'
      })
    }
  }
)

// Generate a certificate for the logged-in user.
router.post(
  '/generate',
  authMiddleware,
  async (req, res) => {
    try {
      const courseId = parsePositiveInteger(
        req.body?.course_id
      )

      const userId = req.user.user_id

      if (!courseId) {
        return res.status(400).json({
          message: 'A valid course ID is required'
        })
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
            id: true,
            completion_percentage: true,
            status: true
          }
        })

      if (!enrollment) {
        return res.status(403).json({
          message:
            'You are not enrolled in this course'
        })
      }

      if (
        enrollment.completion_percentage < 100 ||
        enrollment.status !== 'completed'
      ) {
        return res.status(409).json({
          message:
            'The course must be fully completed before a certificate can be generated'
        })
      }

      const existingCertificate =
        await prisma.certificate.findFirst({
          where: {
            user_id: userId,
            course_id: courseId
          },
          select: certificateSelect
        })

      if (existingCertificate) {
        return res.status(409).json({
          message:
            'A certificate has already been generated for this course',
          certificate: existingCertificate
        })
      }

      const [course, user] = await Promise.all([
        prisma.course.findUnique({
          where: {
            id: courseId
          },
          select: {
            id: true,
            course_title: true,
            approval_status: true
          }
        }),

        prisma.user.findUnique({
          where: {
            id: userId
          },
          select: {
            id: true,
            full_name: true
          }
        })
      ])

      if (!course) {
        return res.status(404).json({
          message: 'Course not found'
        })
      }

      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        })
      }

      const certificateNumber =
        `CERT-${Date.now()}-${userId}-${courseId}`

      const document = new PDFDocument({
        size: 'A4',
        layout: 'landscape'
      })

      const buffers = []

      document.on('data', (buffer) => {
        buffers.push(buffer)
      })

      document
        .fontSize(30)
        .text(
          'CERTIFICATE OF COMPLETION',
          { align: 'center' }
        )

      document.moveDown()

      document
        .fontSize(16)
        .text(
          'This certificate is awarded to:',
          { align: 'center' }
        )

      document
        .fontSize(24)
        .text(
          user.full_name,
          { align: 'center' }
        )

      document.moveDown()

      document
        .fontSize(16)
        .text(
          'For successfully completing the course:',
          { align: 'center' }
        )

      document
        .fontSize(20)
        .text(
          course.course_title,
          { align: 'center' }
        )

      document.moveDown()

      document
        .fontSize(12)
        .text(
          `Certificate Number: ${certificateNumber}`,
          { align: 'center' }
        )

      document
        .fontSize(12)
        .text(
          `Issue Date: ${new Date().toLocaleDateString('en-US')}`,
          { align: 'center' }
        )

      document.end()

      const pdfBuffer = await new Promise(
        (resolve, reject) => {
          document.on('end', () => {
            resolve(Buffer.concat(buffers))
          })

          document.on('error', reject)
        }
      )

      const uploadResult = await new Promise(
        (resolve, reject) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                resource_type: 'raw',
                folder: 'lms-certificates',
                public_id: certificateNumber
              },
              (error, result) => {
                if (error) {
                  reject(error)
                  return
                }

                resolve(result)
              }
            )

          uploadStream.end(pdfBuffer)
        }
      )

      const certificate =
        await prisma.certificate.create({
          data: {
            user_id: userId,
            course_id: courseId,
            certificate_number:
              certificateNumber,
            file_url:
              uploadResult.secure_url
          },
          select: certificateSelect
        })

      return res.status(201).json(certificate)
    } catch (error) {
      if (error?.code === 'P2002') {
        return res.status(409).json({
          message:
            'A certificate has already been generated for this course'
        })
      }

      console.error(
        'GENERATE CERTIFICATE ERROR:',
        error
      )

      return res.status(500).json({
        message: 'Failed to generate the certificate'
      })
    }
  }
)

// Get recent certificates.
//
// HR can view company-wide certificate activity.
// Managers can only view activity from their department.
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

      const certificates =
        await prisma.certificate.findMany({
          where,
          take: 10,
          orderBy: {
            issue_date: 'desc'
          },
          select: recentCertificateSelect
        })

      return res.json(certificates)
    } catch (error) {
      console.error(
        'GET RECENT CERTIFICATES ERROR:',
        error
      )

      return res.status(500).json({
        message:
          'Failed to retrieve recent certificates'
      })
    }
  }
)

module.exports = router
