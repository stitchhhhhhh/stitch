const express = require('express')
const cors = require('cors')
const path = require('path')
const passport = require('passport')
require('dotenv').config()

require('./middleware/passport')

const authRoutes = require('./routes/auth')
const departmentRoutes = require('./routes/departments')
const programRoutes = require('./routes/programs')
const proposalRoutes = require('./routes/proposals')
const courseRequestRoutes = require('./routes/courseRequests')
const courseRoutes = require('./routes/courses')
const materialRoutes = require('./routes/materials')
const assessmentRoutes = require('./routes/assessments')
const enrollmentRoutes = require('./routes/enrollments')
const assessmentResultRoutes = require('./routes/assessmentResults')
const notificationRoutes = require('./routes/notifications')
const leaderboardRoutes = require('./routes/leaderboard')
const certificateRoutes = require('./routes/certificates')
const analyticsRoutes = require('./routes/analytics')
const reportRoutes = require('./routes/reports')
const userRoutes = require('./routes/users')
const dashboardRoutes = require('./routes/dashboard')
const hrRoutes = require('./routes/hr')

const app = express()

app.disable('etag')

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      process.env.FRONTEND_URL ||
      'http://localhost:5173',
    credentials: true
  })
)

app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'Surrogate-Control': 'no-store'
    })
  }

  next()
})

app.use((req, res, next) => {
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start

    console.log(
      `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    )
  })

  next()
})

app.use(passport.initialize())

app.use('/api/auth', authRoutes)
app.use('/api/departments', departmentRoutes)
app.use('/api/programs', programRoutes)
app.use('/api/proposals', proposalRoutes)
app.use('/api/course-requests', courseRequestRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/materials', materialRoutes)
app.use('/api/assessments', assessmentRoutes)
app.use('/api/enrollments', enrollmentRoutes)
app.use('/api/assessment-results', assessmentResultRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/certificates', certificateRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/users', userRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/hr', hrRoutes)

app.get('/', (req, res) => {
  res.json({
    message: 'LMS Backend Running!'
  })
})

app.use((req, res) => {
  res.status(404).json({
    message: 'Endpoint not found.'
  })
})

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)

  res.status(500).json({
    message: 'An unexpected server error occurred.'
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})