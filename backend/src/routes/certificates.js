const express = require('express')
const PDFDocument = require('pdfkit')
const QRCode = require('qrcode')
const { PrismaClient } = require('@prisma/client')
const cloudinary = require('../config/cloudinary')
const {
  authMiddleware,
  roleMiddleware
} = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

function parsePositiveInteger(value) {
  const parsedValue = Number(value)

  if (
    !Number.isInteger(parsedValue) ||
    parsedValue <= 0
  ) {
    return null
  }

  return parsedValue
}

function formatIssueDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

function buildVerificationUrl(certificateNumber) {
  const frontendUrl = String(
    process.env.FRONTEND_URL ||
      'https://learningcompany.my.id'
  ).replace(/\/+$/, '')

  return `${frontendUrl}/verify-certificate/${encodeURIComponent(
    certificateNumber
  )}`
}

async function hasPassedEveryAssessment(
  userId,
  courseId
) {
  const assessments =
    await prisma.assessment.findMany({
      where: {
        course_id: courseId
      },
      select: {
        id: true,
        passing_score: true
      }
    })

  if (assessments.length === 0) {
    return false
  }

  const results =
    await prisma.assessmentResult.findMany({
      where: {
        user_id: userId,
        assessment_id: {
          in: assessments.map(
            (assessment) => assessment.id
          )
        }
      },
      select: {
        assessment_id: true,
        score: true
      }
    })

  const resultMap = new Map(
    results.map((result) => [
      result.assessment_id,
      Number(result.score)
    ])
  )

  return assessments.every(
    (assessment) => {
      const score = resultMap.get(
        assessment.id
      )

      return (
        Number.isFinite(score) &&
        score >=
          Number(
            assessment.passing_score
          )
      )
    }
  )
}

async function getFinalAssessmentSummary(
  userId,
  courseId
) {
  const assessments =
    await prisma.assessment.findMany({
      where: {
        course_id: courseId
      },
      select: {
        id: true,
        passing_score: true
      }
    })

  if (assessments.length === 0) {
    return {
      averageScore: 0,
      averagePassingScore: 0,
      totalAssessments: 0
    }
  }

  const results =
    await prisma.assessmentResult.findMany({
      where: {
        user_id: userId,
        assessment_id: {
          in: assessments.map(
            (assessment) => assessment.id
          )
        }
      },
      select: {
        assessment_id: true,
        score: true
      }
    })

  const scores = results
    .map((result) => Number(result.score))
    .filter(Number.isFinite)

  const passingScores = assessments
    .map((assessment) =>
      Number(assessment.passing_score)
    )
    .filter(Number.isFinite)

  const averageScore =
    scores.length > 0
      ? Math.round(
          (
            scores.reduce(
              (total, score) =>
                total + score,
              0
            ) / scores.length
          ) * 100
        ) / 100
      : 0

  const averagePassingScore =
    passingScores.length > 0
      ? Math.round(
          (
            passingScores.reduce(
              (total, score) =>
                total + score,
              0
            ) /
            passingScores.length
          ) * 100
        ) / 100
      : 0

  return {
    averageScore,
    averagePassingScore,
    totalAssessments:
      assessments.length
  }
}

async function createCertificatePdf({
  certificateNumber,
  course,
  issueDate,
  user,
  assessmentSummary,
  verificationUrl
}) {
  const qrCodeDataUrl =
    await QRCode.toDataURL(
      verificationUrl,
      {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 220
      }
    )

  const qrCodeBuffer =
    Buffer.from(
      qrCodeDataUrl.split(',')[1],
      'base64'
    )

  const document = new PDFDocument({
    size: 'A4',
    layout: 'landscape',
    margin: 0,
    info: {
      Title:
        'Certificate of Completion',
      Author:
        'Learning Company',
      Subject:
        course.course_title,
      Keywords:
        'certificate, completion, learning, verification'
    }
  })

  const buffers = []

  document.on('data', (buffer) => {
    buffers.push(buffer)
  })

  const pageWidth =
    document.page.width

  const pageHeight =
    document.page.height

  // Background.
  document
    .rect(
      0,
      0,
      pageWidth,
      pageHeight
    )
    .fill('#F8FAFC')

  // Outer and inner frames.
  document
    .lineWidth(5)
    .rect(
      22,
      22,
      pageWidth - 44,
      pageHeight - 44
    )
    .stroke('#1D4ED8')

  document
    .lineWidth(1.5)
    .rect(
      34,
      34,
      pageWidth - 68,
      pageHeight - 68
    )
    .stroke('#94A3B8')

  // Decorative top bar.
  document
    .rect(
      34,
      34,
      pageWidth - 68,
      18
    )
    .fill('#1D4ED8')

  // Watermark.
  document.save()
  document
    .fillColor('#E2E8F0')
    .opacity(0.18)
    .font('Helvetica-Bold')
    .fontSize(58)
    .rotate(-20, {
      origin: [
        pageWidth / 2,
        pageHeight / 2
      ]
    })
    .text(
      'LEARNING COMPANY',
      120,
      pageHeight / 2 - 40,
      {
        width: pageWidth - 240,
        align: 'center'
      }
    )
  document.restore()
  document.opacity(1)

  // Brand.
  document
    .fillColor('#1E3A8A')
    .font('Helvetica-Bold')
    .fontSize(14)
    .text(
      'LEARNING COMPANY',
      72,
      68,
      {
        width: pageWidth - 144,
        align: 'center',
        characterSpacing: 2
      }
    )

  document
    .fillColor('#0F172A')
    .font('Helvetica-Bold')
    .fontSize(34)
    .text(
      'CERTIFICATE OF COMPLETION',
      70,
      103,
      {
        width: pageWidth - 140,
        align: 'center'
      }
    )

  document
    .fillColor('#64748B')
    .font('Helvetica')
    .fontSize(14)
    .text(
      'This certificate is proudly presented to',
      70,
      158,
      {
        width: pageWidth - 140,
        align: 'center'
      }
    )

  document
    .fillColor('#0F172A')
    .font('Helvetica-Bold')
    .fontSize(29)
    .text(
      user.full_name,
      70,
      192,
      {
        width: pageWidth - 140,
        align: 'center'
      }
    )

  document
    .moveTo(
      pageWidth / 2 - 175,
      235
    )
    .lineTo(
      pageWidth / 2 + 175,
      235
    )
    .lineWidth(1)
    .stroke('#CBD5E1')

  document
    .fillColor('#64748B')
    .font('Helvetica')
    .fontSize(14)
    .text(
      'for successfully completing the course',
      70,
      254,
      {
        width: pageWidth - 140,
        align: 'center'
      }
    )

  document
    .fillColor('#1D4ED8')
    .font('Helvetica-Bold')
    .fontSize(23)
    .text(
      course.course_title,
      100,
      290,
      {
        width: pageWidth - 200,
        align: 'center'
      }
    )

  if (
    course.program?.program_name
  ) {
    document
      .fillColor('#475569')
      .font('Helvetica')
      .fontSize(11)
      .text(
        `Training Program: ${course.program.program_name}`,
        90,
        333,
        {
          width:
            pageWidth - 180,
          align: 'center'
        }
      )
  }

  if (
    course.trainer?.full_name
  ) {
    document
      .fillColor('#475569')
      .font('Helvetica')
      .fontSize(11)
      .text(
        `Trainer: ${course.trainer.full_name}`,
        90,
        355,
        {
          width:
            pageWidth - 180,
          align: 'center'
        }
      )
  }

  // Score summary panel.
  const scorePanelX = 72
  const scorePanelY =
    pageHeight - 160

  document
    .roundedRect(
      scorePanelX,
      scorePanelY,
      250,
      76,
      8
    )
    .fillAndStroke(
      '#EFF6FF',
      '#BFDBFE'
    )

  document
    .fillColor('#475569')
    .font('Helvetica')
    .fontSize(10)
    .text(
      'FINAL ASSESSMENT SCORE',
      scorePanelX + 16,
      scorePanelY + 14,
      {
        width: 218,
        align: 'center'
      }
    )

  document
    .fillColor('#1D4ED8')
    .font('Helvetica-Bold')
    .fontSize(24)
    .text(
      `${assessmentSummary.averageScore}%`,
      scorePanelX + 16,
      scorePanelY + 34,
      {
        width: 218,
        align: 'center'
      }
    )

  document
    .fillColor('#64748B')
    .font('Helvetica')
    .fontSize(9)
    .text(
      `Passing score: ${assessmentSummary.averagePassingScore}% · Assessments: ${assessmentSummary.totalAssessments}`,
      scorePanelX + 16,
      scorePanelY + 62,
      {
        width: 218,
        align: 'center'
      }
    )

  // QR verification panel.
  const qrSize = 88
  const qrX =
    pageWidth - 72 - qrSize
  const qrY =
    pageHeight - 177

  document.image(
    qrCodeBuffer,
    qrX,
    qrY,
    {
      width: qrSize,
      height: qrSize
    }
  )

  document
    .fillColor('#334155')
    .font('Helvetica-Bold')
    .fontSize(9)
    .text(
      'SCAN TO VERIFY',
      qrX - 15,
      qrY + qrSize + 5,
      {
        width: qrSize + 30,
        align: 'center'
      }
    )

  // Certificate details.
  document
    .fillColor('#334155')
    .font('Helvetica')
    .fontSize(10)
    .text(
      `Issue Date: ${formatIssueDate(issueDate)}`,
      345,
      pageHeight - 140,
      {
        width: 275,
        align: 'center'
      }
    )

  document
    .text(
      `Certificate Number: ${certificateNumber}`,
      330,
      pageHeight - 117,
      {
        width: 305,
        align: 'center'
      }
    )

  document
    .fillColor('#64748B')
    .font('Helvetica-Oblique')
    .fontSize(8)
    .text(
      'This certificate was generated electronically and can be verified using the QR code.',
      320,
      pageHeight - 90,
      {
        width: 325,
        align: 'center'
      }
    )

  document.end()

  return new Promise(
    (resolve, reject) => {
      document.on('end', () => {
        resolve(
          Buffer.concat(buffers)
        )
      })

      document.on(
        'error',
        reject
      )
    }
  )
}

function uploadCertificatePdf(
  pdfBuffer,
  certificateNumber
) {
  return new Promise(
    (resolve, reject) => {
      const pdfFileName =
        `${certificateNumber}.pdf`

      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw',
            type: 'upload',
            folder: 'lms-certificates',
            public_id: pdfFileName,
            overwrite: false
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

// Public certificate verification endpoint.
router.get(
  '/verify/:certificateNumber',
  async (req, res) => {
    try {
      const certificateNumber =
        String(
          req.params.certificateNumber ||
            ''
        ).trim()

      if (!certificateNumber) {
        return res.status(400).json({
          valid: false,
          message:
            'Certificate number is required'
        })
      }

      const certificate =
        await prisma.certificate.findUnique({
          where: {
            certificate_number:
              certificateNumber
          },
          select: {
            id: true,
            certificate_number: true,
            issue_date: true,
            file_url: true,
            user: {
              select: {
                id: true,
                full_name: true
              }
            },
            course: {
              select: {
                id: true,
                course_title: true,
                approval_status: true,
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
                    full_name: true
                  }
                }
              }
            }
          }
        })

      if (!certificate) {
        return res.status(404).json({
          valid: false,
          message:
            'Certificate not found'
        })
      }

      return res.json({
        valid: true,
        message:
          'Certificate is valid',
        certificate: {
          certificate_number:
            certificate.certificate_number,
          issue_date:
            certificate.issue_date,
          recipient_name:
            certificate.user.full_name,
          course_title:
            certificate.course.course_title,
          program_name:
            certificate.course.program
              ?.program_name || null,
          trainer_name:
            certificate.course.trainer
              ?.full_name || null,
          file_url:
            certificate.file_url
        }
      })
    } catch (error) {
      console.error(
        'VERIFY CERTIFICATE ERROR:',
        error
      )

      return res.status(500).json({
        valid: false,
        message:
          'Failed to verify certificate'
      })
    }
  }
)

// Get certificate history for a user.
router.get(
  '/user/:userId',
  authMiddleware,
  async (req, res) => {
    try {
      const requestedUserId =
        parsePositiveInteger(
          req.params.userId
        )

      if (!requestedUserId) {
        return res.status(400).json({
          message: 'Invalid user ID'
        })
      }

      const targetUser =
        await prisma.user.findUnique({
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
        req.user.user_id ===
        requestedUserId

      const isHR =
        req.user.role === 'HR'

      const isManagerSameDepartment =
        req.user.role ===
          'MANAGER' &&
        Boolean(
          req.user.department_id
        ) &&
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
            user_id:
              requestedUserId
          },
          orderBy: {
            issue_date: 'desc'
          },
          select:
            certificateSelect
        })

      return res.json(
        certificates
      )
    } catch (error) {
      console.error(
        'GET USER CERTIFICATES ERROR:',
        error
      )

      return res.status(500).json({
        message:
          'Failed to retrieve certificates'
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
      const courseId =
        parsePositiveInteger(
          req.body?.course_id
        )

      const userId =
        parsePositiveInteger(
          req.user?.user_id
        )

      if (!userId) {
        return res.status(401).json({
          message:
            'Invalid user session'
        })
      }

      if (!courseId) {
        return res.status(400).json({
          message:
            'A valid course ID is required'
        })
      }

      const existingCertificate =
        await prisma.certificate.findFirst({
          where: {
            user_id: userId,
            course_id: courseId
          },
          select:
            certificateSelect
        })

      if (existingCertificate) {
        return res.status(200).json({
          message:
            'Certificate already exists',
          certificate:
            existingCertificate
        })
      }

      const [
        enrollment,
        course,
        user
      ] = await Promise.all([
        prisma.courseEnrollment.findUnique({
          where: {
            user_id_course_id: {
              user_id: userId,
              course_id: courseId
            }
          },
          select: {
            id: true,
            completion_percentage:
              true,
            status: true
          }
        }),

        prisma.course.findUnique({
          where: {
            id: courseId
          },
          select: {
            id: true,
            course_title: true,
            approval_status: true,
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
                full_name: true
              }
            }
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
          message:
            'Course not found'
        })
      }

      if (!user) {
        return res.status(404).json({
          message:
            'User not found'
        })
      }

      if (!enrollment) {
        return res.status(403).json({
          message:
            'You are not enrolled in this course'
        })
      }

      if (
        course.approval_status !==
        'approved'
      ) {
        return res.status(409).json({
          message:
            'A certificate can only be generated for an approved course'
        })
      }

      if (
        Number(
          enrollment.completion_percentage
        ) < 100 ||
        enrollment.status !==
          'completed'
      ) {
        return res.status(409).json({
          message:
            'The course must be fully completed before a certificate can be generated'
        })
      }

      const passedEveryAssessment =
        await hasPassedEveryAssessment(
          userId,
          courseId
        )

      if (!passedEveryAssessment) {
        return res.status(409).json({
          message:
            'All course assessments must be passed before a certificate can be generated'
        })
      }

      const assessmentSummary =
        await getFinalAssessmentSummary(
          userId,
          courseId
        )

      const issueDate = new Date()

      const certificateNumber =
        [
          'CERT',
          issueDate
            .toISOString()
            .slice(0, 10)
            .replaceAll('-', ''),
          userId,
          courseId,
          issueDate.getTime()
        ].join('-')

      const verificationUrl =
        buildVerificationUrl(
          certificateNumber
        )

      const pdfBuffer =
        await createCertificatePdf({
          certificateNumber,
          course,
          issueDate,
          user,
          assessmentSummary,
          verificationUrl
        })

      const uploadResult =
        await uploadCertificatePdf(
          pdfBuffer,
          certificateNumber
        )

      const certificate =
  await prisma.certificate.create({
    data: {
      user_id: userId,
      course_id: courseId,
      certificate_number:
        certificateNumber,
      issue_date:
        issueDate,
      file_url:
        uploadResult.secure_url
    },
    select:
      certificateSelect
  })

      return res.status(201).json({
        message:
          'Certificate generated successfully',
        verification_url:
          verificationUrl,
        certificate
      })
    } catch (error) {
      if (
        error?.code ===
        'P2002'
      ) {
        const userId =
          parsePositiveInteger(
            req.user?.user_id
          )

        const courseId =
          parsePositiveInteger(
            req.body?.course_id
          )

        if (
          userId &&
          courseId
        ) {
          const certificate =
            await prisma.certificate.findFirst({
              where: {
                user_id: userId,
                course_id: courseId
              },
              select:
                certificateSelect
            })

          if (certificate) {
            return res.status(200).json({
              message:
                'Certificate already exists',
              verification_url:
                buildVerificationUrl(
                  certificate.certificate_number
                ),
              certificate
            })
          }
        }

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
        message:
          'Failed to generate the certificate'
      })
    }
  }
)

// Get recent certificates.
router.get(
  '/recent',
  authMiddleware,
  roleMiddleware(
    'HR',
    'MANAGER'
  ),
  async (req, res) => {
    try {
      if (
        req.user.role ===
          'MANAGER' &&
        !req.user.department_id
      ) {
        return res.json([])
      }

      const where =
        req.user.role ===
        'MANAGER'
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
            issue_date:
              'desc'
          },
          select:
            recentCertificateSelect
        })

      return res.json(
        certificates
      )
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
