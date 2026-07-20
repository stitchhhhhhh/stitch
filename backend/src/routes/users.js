const express = require('express')
const router = express.Router()
const multer = require('multer')
const { PrismaClient } = require('@prisma/client')
const cloudinary = require('../config/cloudinary')
const { authMiddleware, roleMiddleware } = require('../middleware/auth')

const prisma = new PrismaClient()
const upload = multer({ storage: multer.memoryStorage() })

router.get('/trainers', authMiddleware, roleMiddleware('HR', 'MANAGER'), async (req, res) => {
  try {
    const trainers = await prisma.user.findMany({
      where: { role: { name: 'TRAINER' }, status: 'active' },
      select: { id: true, full_name: true, email: true }
    })
    res.json(trainers)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.user_id },
      select: {
        id: true,
        full_name: true,
        email: true,
        status: true,
        total_points: true,
        photo_url: true,
        notify_course: true,
        notify_deadline: true,
        notify_certificate: true,
        department: { select: { id: true, name: true } },
        role: { select: { id: true, name: true } }
      }
    })
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { full_name } = req.body
    if (!full_name || !full_name.trim()) {
      return res.status(400).json({ message: 'Nama tidak boleh kosong' })
    }

    const user = await prisma.user.update({
      where: { id: req.user.user_id },
      data: { full_name: full_name.trim() },
      select: {
        id: true,
        full_name: true,
        email: true,
        photo_url: true,
        department: { select: { name: true } },
        role: { select: { name: true } }
      }
    })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.put('/me/notifications', authMiddleware, async (req, res) => {
  try {
    const { notify_course, notify_deadline, notify_certificate } = req.body

    const data = {}
    if (typeof notify_course === 'boolean') data.notify_course = notify_course
    if (typeof notify_deadline === 'boolean') data.notify_deadline = notify_deadline
    if (typeof notify_certificate === 'boolean') data.notify_certificate = notify_certificate

    const user = await prisma.user.update({
      where: { id: req.user.user_id },
      data,
      select: {
        id: true,
        notify_course: true,
        notify_deadline: true,
        notify_certificate: true
      }
    })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/me/photo', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File foto tidak ditemukan' })
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: 'lms-avatars' },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      uploadStream.end(req.file.buffer)
    })

    const user = await prisma.user.update({
      where: { id: req.user.user_id },
      data: { photo_url: result.secure_url },
      select: { id: true, photo_url: true }
    })

    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
