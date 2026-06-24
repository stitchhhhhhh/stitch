const express = require('express')
const cors = require('cors')
const path = require('path')
const session = require('express-session')
const passport = require('passport')
require('dotenv').config()

require('./middleware/passport')

const authRoutes = require('./routes/auth')

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

app.use(session({
  secret: process.env.SESSION_SECRET || 'lms-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'LMS Backend Running!' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})