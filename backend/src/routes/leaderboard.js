const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { authMiddleware } = require('../middleware/auth')

const prisma = new PrismaClient()

// GET leaderboard — sudah optimal (select + limit 20), tambah cache header
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
  where: {
    status: "active",
    role: {
      name: "EMPLOYEE",
    },
  },
  select: {
    id: true,
    full_name: true,
    email: true,
    total_points: true,
    department: {
      select: {
        name: true,
      },
    },
    role: {
      select: {
        name: true,
      },
    },
  },
  orderBy: [
    {
      total_points: "desc",
    },
    {
      full_name: "asc",
    },
  ],
});

    // Cache 60 detik di browser, kurangi request berulang dashboard
    res.set('Cache-Control', 'private, max-age=60')
    res.json(leaderboard)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
