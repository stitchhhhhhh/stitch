const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { authMiddleware } = require('../middleware/auth')

const prisma = new PrismaClient()

// Get the top 20 active employees ordered by total points.
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        status: 'active',
        role: {
          name: 'EMPLOYEE'
        }
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        total_points: true,
        department: {
          select: {
            name: true
          }
        },
        role: {
          select: {
            name: true
          }
        }
      },
      orderBy: [
        {
          total_points: 'desc'
        },
        {
          full_name: 'asc'
        }
      ],
      take: 20
    })

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      user_id: user.id,
      full_name: user.full_name,
      email: user.email,
      total_points: user.total_points,
      department: user.department?.name ?? null,
      role: user.role?.name ?? null
    }))

    res.set('Cache-Control', 'private, max-age=60')

    return res.json(leaderboard)
  } catch (error) {
    console.error('Failed to load leaderboard:', error)

    return res.status(500).json({
      message: 'Failed to load leaderboard'
    })
  }
})

module.exports = router