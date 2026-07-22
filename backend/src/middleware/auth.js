const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Token tidak ada atau format token salah'
      })
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        message: 'Token tidak ada'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded.user_id) {
      return res.status(401).json({
        message: 'Token tidak memiliki identitas user'
      })
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(decoded.user_id)
      },
      select: {
        id: true,
        email: true,
        full_name: true,
        status: true,
        department_id: true,
        total_points: true,
        photo_url: true,
        role: {
          select: {
            id: true,
            name: true
          }
        },
        department: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!user) {
      return res.status(401).json({
        message: 'User tidak ditemukan'
      })
    }

    if (String(user.status).toLowerCase() !== 'active') {
      return res.status(403).json({
        message: 'Akun tidak aktif'
      })
    }

    req.user = {
      user_id: user.id,
      email: user.email,
      full_name: user.full_name,
      status: user.status,
      department_id: user.department_id,
      department: user.department,
      role_id: user.role.id,
      role: String(user.role.name).toUpperCase(),
      total_points: user.total_points,
      photo_url: user.photo_url
    }

    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token sudah kedaluwarsa'
      })
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Token tidak valid'
      })
    }

    console.error('AUTH MIDDLEWARE ERROR:', err)

    return res.status(500).json({
      message: 'Terjadi kesalahan saat memverifikasi akun'
    })
  }
}

const roleMiddleware = (...allowedRoles) => {
  const normalizedRoles = allowedRoles.map((role) =>
    String(role).toUpperCase()
  )

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Belum login'
      })
    }

    const currentRole = String(req.user.role || '').toUpperCase()

    if (!normalizedRoles.includes(currentRole)) {
      return res.status(403).json({
        message: 'Akses ditolak'
      })
    }

    next()
  }
}

module.exports = {
  authMiddleware,
  roleMiddleware
}
