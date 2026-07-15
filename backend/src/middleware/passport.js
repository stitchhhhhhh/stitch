const passport = require('passport')
const { Strategy: GoogleStrategy } = require('passport-google-oauth20')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/api/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true }
    })

    if (!user) {
      return done(null, false, { message: 'user_not_found' })
    }

    return done(null, user)
  } catch (err) {
    return done(err)
  }
}))

passport.serializeUser((user, done) => {
  done(null, user.user_id)
})

passport.deserializeUser(async (user_id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id },
      include: { role: true }
    })
    done(null, user)
  } catch (err) {
    done(err)
  }
})

module.exports = passport
