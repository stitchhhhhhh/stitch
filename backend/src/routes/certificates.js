const express = require('express')
const router = express.Router()
const PDFDocument = require('pdfkit')
const { PrismaClient } = require('@prisma/client')
const cloudinary = require('../config/cloudinary')
const { authMiddleware } = require('../middleware/auth')

const prisma = new PrismaClient()

// GET riwayat sertifikat user
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { user_id: parseInt(req.params.userId) },
      include: { course: true }
    })
    res.json(certificates)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST — generate sertifikat
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { course_id } = req.body
    const userId = req.user.user_id

    // Cek apakah course sudah selesai 100%
    const enrollment = await prisma.courseEnrollment.findFirst({
      where: { user_id: userId, course_id: parseInt(course_id) }
    })

    if (!enrollment || enrollment.completion_percentage < 100) {
      return res.status(400).json({ message: 'Kursus belum selesai 100%' })
    }

    const course = await prisma.course.findUnique({ where: { id: parseInt(course_id) } })
    const user = await prisma.user.findUnique({ where: { id: userId } })

    const certificateNumber = `CERT-${Date.now()}-${userId}`

    // Generate PDF
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' })
    const buffers = []
    doc.on('data', buffers.push.bind(buffers))

    doc.fontSize(30).text('SERTIFIKAT PENYELESAIAN', { align: 'center' })
    doc.moveDown()
    doc.fontSize(16).text('Diberikan kepada:', { align: 'center' })
    doc.fontSize(24).text(user.full_name, { align: 'center' })
    doc.moveDown()
    doc.fontSize(16).text(`Atas keberhasilan menyelesaikan kursus:`, { align: 'center' })
    doc.fontSize(20).text(course.course_title, { align: 'center' })
    doc.moveDown()
    doc.fontSize(12).text(`Nomor Sertifikat: ${certificateNumber}`, { align: 'center' })
    doc.fontSize(12).text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, { align: 'center' })

    doc.end()

    const pdfBuffer = await new Promise((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)))
    })

    // Upload ke Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'raw', folder: 'lms-certificates', public_id: certificateNumber },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      uploadStream.end(pdfBuffer)
    })

    const certificate = await prisma.certificate.create({
      data: {
        user_id: userId,
        course_id: parseInt(course_id),
        certificate_number: certificateNumber,
        file_url: result.secure_url
      }
    })

    res.status(201).json(certificate)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router