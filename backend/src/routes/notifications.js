const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { authMiddleware } = require('../middleware/auth')

const prisma = new PrismaClient()

// GET — notifikasi milik user yang sedang login
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        user_id: req.user.user_id
      },
      orderBy: {
        created_date: 'desc'
      }
    })

    res.json(notifications)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT — tandai semua notifikasi user sebagai sudah dibaca
router.put('/read-all', authMiddleware, async (req, res) => {
  try {
    const result = await prisma.notification.updateMany({
      where: {
        user_id: req.user.user_id,
        is_read: false
      },
      data: {
        is_read: true
      }
    })

    res.json({
      message: 'Semua notifikasi ditandai sudah dibaca',
      updated_count: result.count
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT — tandai satu notifikasi milik user sebagai sudah dibaca
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notificationId = Number.parseInt(req.params.id, 10)

    if (Number.isNaN(notificationId)) {
      return res.status(400).json({
        message: 'ID notifikasi tidak valid'
      })
    }

    const result = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        user_id: req.user.user_id
      },
      data: {
        is_read: true
      }
    })

    if (result.count === 0) {
      return res.status(404).json({
        message: 'Notifikasi tidak ditemukan'
      })
    }

    const notification = await prisma.notification.findUnique({
      where: {
        id: notificationId
      }
    })

    res.json(notification)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
