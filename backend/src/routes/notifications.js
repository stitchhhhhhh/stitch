const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { authMiddleware } = require('../middleware/auth')

const prisma = new PrismaClient()

// GET notifikasi user (yang sedang login)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { user_id: req.user.user_id },
      orderBy: { created_date: 'desc' }
    })
    res.json(notifications)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT — tandai notifikasi sudah dibaca
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await prisma.notification.update({
      where: { id: parseInt(req.params.id) },
      data: { is_read: true }
    })
    res.json(notification)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT — tandai semua notifikasi sudah dibaca
router.put('/read-all', authMiddleware, async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { user_id: req.user.user_id, is_read: false },
      data: { is_read: true }
    })
    res.json({ message: 'Semua notifikasi ditandai sudah dibaca' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router