const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const router = express.Router()

// GET /api/auth/google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}))

// GET /api/auth/google/callback
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login?error=user_not_found',
    session: false
  }),
  (req, res) => {
    try {
      console.log('REQ USER:', req.user)
      console.log('ROLE:', req.user.role)

      const role = req.user.role?.role_name ?? req.user.role?.name ?? null
      console.log('ROLE NAME:', role)

      const token = jwt.sign(
        {
          user_id: req.user.user_id,
          email: req.user.email,
          full_name: req.user.full_name,
          role: role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      )

      res.redirect(`http://localhost:5173/auth/callback?token=${token}`)
    } catch (err) {
      console.error('AUTH ERROR:', err)
      res.redirect('http://localhost:5173/login?error=auth_failed')
    }
  }
)

// GET /api/auth/me
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'Belum login' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('DECODED TOKEN:', decoded)
    return res.json({
      user: {
        user_id: decoded.user_id,
        email: decoded.email,
        full_name: decoded.full_name,
      },
      role: decoded.role
    })
  } catch {
    return res.status(401).json({ message: 'Token tidak valid' })
  }
})

// GET /api/auth/logout
router.get('/logout', (req, res) => {
  res.redirect('http://localhost:5173/login')
})

module.exports = router