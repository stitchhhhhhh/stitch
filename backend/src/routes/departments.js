const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { authMiddleware } = require('../middleware/auth')

const prisma = new PrismaClient()

// GET semua departemen — data jarang berubah, cache lebih lama
router.get('/', authMiddleware, async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      select: { id: true, name: true, description: true }
    })

    res.set('Cache-Control', 'private, max-age=300') // cache 5 menit
    res.json(departments)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router