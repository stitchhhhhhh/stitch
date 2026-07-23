const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

const FRONTEND_URL =
  process.env.FRONTEND_URL || 'http://localhost:5173'

// ===============================
// Login Email + Password
// ===============================
router.post('/login', async (req, res) => {
  try {
    const email = String(req.body?.email || '')
      .trim()
      .toLowerCase()

    const password = String(req.body?.password || '')

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email dan password wajib diisi.'
      })
    }

    const user = await prisma.user.findUnique({
      where: {
        email
      },
      include: {
        role: true,
        department: true
      }
    })

    if (!user) {
      return res.status(401).json({
        message: 'Email atau password salah.'
      })
    }

    if (String(user.status).toLowerCase() !== 'active') {
      return res.status(403).json({
        message: 'Akun tidak aktif.'
      })
    }

    if (!user.password_hash) {
      return res.status(401).json({
        message:
          'Akun ini belum memiliki password. Silakan login menggunakan Google.'
      })
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.password_hash
    )

    if (!passwordValid) {
      return res.status(401).json({
        message: 'Email atau password salah.'
      })
    }

    const token = jwt.sign(
      {
        user_id: user.id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d'
      }
    )

    const role = String(user.role?.name || '').toUpperCase()

    return res.status(200).json({
      token,
      role,
      user: {
        user_id: user.id,
        email: user.email,
        full_name: user.full_name,
        department_id: user.department_id,
        department: user.department,
        total_points: user.total_points,
        photo_url: user.photo_url,
        role
      }
    })
  } catch (err) {
    console.error('EMAIL LOGIN ERROR:', err)

    return res.status(500).json({
      message: 'Terjadi kesalahan saat login.'
    })
  }
})

// ===============================
// Login Google
// ===============================
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
)

// ===============================
// Callback Google
// ===============================
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${FRONTEND_URL}/login?error=user_not_found`,
    session: false
  }),
  (req, res) => {
    try {
      if (!req.user?.id) {
        return res.redirect(
          `${FRONTEND_URL}/login?error=user_not_found`
        )
      }

      if (String(req.user.status).toLowerCase() !== 'active') {
        return res.redirect(
          `${FRONTEND_URL}/login?error=account_inactive`
        )
      }

      const token = jwt.sign(
        {
          user_id: req.user.id
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1d'
        }
      )

      return res.redirect(
        `${FRONTEND_URL}/auth/callback?token=${encodeURIComponent(token)}`
      )
    } catch (err) {
      console.error('AUTH CALLBACK ERROR:', err)

      return res.redirect(
        `${FRONTEND_URL}/login?error=auth_failed`
      )
    }
  }
)

// ===============================
// Informasi user login
// ===============================
router.get('/me', authMiddleware, (req, res) => {
  return res.json({
    user: {
      user_id: req.user.user_id,
      email: req.user.email,
      full_name: req.user.full_name,
      department_id: req.user.department_id,
      department: req.user.department,
      total_points: req.user.total_points,
      photo_url: req.user.photo_url
    },
    role: req.user.role
  })
})

// ===============================
// Logout
// ===============================
router.get('/logout', (req, res) => {
  return res.redirect(`${FRONTEND_URL}/login`)
})

module.exports = router