const express = require('express')
const router = express.Router()
const multer = require('multer')
const { PrismaClient } = require('@prisma/client')
const cloudinary = require('../config/cloudinary')
const { authMiddleware, roleMiddleware } = require('../middleware/auth')

const prisma = new PrismaClient()
const upload = multer({ storage: multer.memoryStorage() })

// GET materi per course
router.get('/course/:courseId', authMiddleware, async (req, res) => {
  try {
    const materials = await prisma.learningMaterial.findMany({
      where: { course_id: parseInt(req.params.courseId) }
    })
    res.json(materials)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST — Trainer upload materi
router.post('/upload', authMiddleware, roleMiddleware('TRAINER'), upload.single('file'), async (req, res) => {
  try {
    const { course_id, material_title, material_type } = req.body

    if (!req.file) {
      return res.status(400).json({ message: 'File tidak ditemukan' })
    }

    // Upload ke Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: 'lms-materials' },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      uploadStream.end(req.file.buffer)
    })

    const material = await prisma.learningMaterial.create({
      data: {
        course_id: parseInt(course_id),
        material_title,
        material_type, // VIDEO / DOC / PRESENTATION
        file_url: result.secure_url
      }
    })

    res.status(201).json(material)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE materi
router.delete('/:id', authMiddleware, roleMiddleware('TRAINER'), async (req, res) => {
  try {
    await prisma.learningMaterial.delete({
      where: { id: parseInt(req.params.id) }
    })
    res.json({ message: 'Materi berhasil dihapus' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router