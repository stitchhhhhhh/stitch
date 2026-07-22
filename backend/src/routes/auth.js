const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

const FRONTEND_URL =
  process.env.FRONTEND_URL || 'http://localhost:5173'

// Login Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
)

// Callback Google
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

// Informasi user login
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

// Logout dilakukan dengan menghapus token di frontend
router.get('/logout', (req, res) => {
  return res.redirect(`${FRONTEND_URL}/login`)
})

module.exports = router
