const passport = require('passport')
const {
  Strategy: GoogleStrategy
} = require('passport-google-oauth20')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value
          ?.trim()
          .toLowerCase()

        if (!email) {
          return done(null, false, {
            message: 'email_not_found'
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
          return done(null, false, {
            message: 'user_not_found'
          })
        }

        if (String(user.status).toLowerCase() !== 'active') {
          return done(null, false, {
            message: 'account_inactive'
          })
        }

        return done(null, user)
      } catch (error) {
        console.error('GOOGLE PASSPORT ERROR:', error)

        return done(error)
      }
    }
  )
)

module.exports = passport