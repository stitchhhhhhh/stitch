// src/routes/auth.js
// Paste file ini ke src/routes/auth.js di project lo

const express = require('express');
const passport = require('passport');
const router = express.Router();

// ─── GET /api/auth/google ────────────────────────────────────────────────────
// Redirect user ke halaman login Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// ─── GET /api/auth/google/callback ──────────────────────────────────────────
// Google redirect balik ke sini setelah user login
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login.html?error=auth_failed',
    session: true
  }),
  (req, res) => {
    // login berhasil → redirect ke dashboard
    res.redirect('/dashboard.html');
  }
);

// ─── GET /api/auth/me ────────────────────────────────────────────────────────
// Endpoint untuk dashboard.html ambil data user yang sedang login
router.get('/me', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Belum login' });
  }
  return res.json({ user: req.user });
});

// ─── GET /api/auth/logout ────────────────────────────────────────────────────
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/login.html');
  });
});

module.exports = router;