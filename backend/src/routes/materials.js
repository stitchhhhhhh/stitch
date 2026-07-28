const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const { PrismaClient } = require('@prisma/client')
const cloudinary = require('../config/cloudinary')
const {
  authMiddleware,
  roleMiddleware
} = require('../middleware/auth')

const prisma = new PrismaClient()

const MAX_FILE_SIZE = 50 * 1024 * 1024
const CLOUDINARY_CHUNK_SIZE = 6 * 1024 * 1024

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE
  }
})

const MATERIAL_FILE_RULES = {
  VIDEO: {
    mimeTypes: [
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/x-msvideo',
      'application/octet-stream'
    ],
    extensions: [
      '.mp4',
      '.webm',
      '.mov',
      '.avi'
    ],
    description:
      'MP4, WebM, MOV, or AVI video'
  },

  DOCUMENT: {
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/octet-stream'
    ],
    extensions: [
      '.pdf',
      '.doc',
      '.docx',
      '.txt'
    ],
    description:
      'PDF, DOC, DOCX, or TXT document'
  },

  PRESENTATION: {
    mimeTypes: [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/octet-stream'
    ],
    extensions: [
      '.ppt',
      '.pptx'
    ],
    description:
      'PPT or PPTX presentation'
  }
}

function parsePositiveInteger(value) {
  const parsedValue =
    Number.parseInt(value, 10)

  if (
    !Number.isInteger(parsedValue) ||
    parsedValue <= 0
  ) {
    return null
  }

  return parsedValue
}

function normalizeMaterialType(value) {
  return String(value || '')
    .trim()
    .toUpperCase()
}

function validateMaterialFile(
  materialType,
  file
) {
  const rule =
    MATERIAL_FILE_RULES[materialType]

  if (!rule) {
    return {
      valid: false,
      message:
        'Material type must be VIDEO, DOCUMENT, or PRESENTATION'
    }
  }

  const extension = path
    .extname(file.originalname || '')
    .toLowerCase()

  const mimeType = String(
    file.mimetype || ''
  )
    .trim()
    .toLowerCase()

  const validExtension =
    rule.extensions.includes(extension)

  const validMimeType =
    rule.mimeTypes.includes(mimeType)

  if (
    !validExtension ||
    !validMimeType
  ) {
    return {
      valid: false,
      message:
        `${materialType} materials must use a ${rule.description} file`
    }
  }

  return {
    valid: true
  }
}

function getCloudinaryResourceType(
  materialType
) {
  if (materialType === 'VIDEO') {
    return 'video'
  }

  return 'raw'
}

function createPublicId(
  filename,
  resourceType
) {
  const parsedFile = path.parse(
    filename || 'material'
  )

  const safeName =
    parsedFile.name
      .replace(
        /[^a-zA-Z0-9_-]/g,
        '-'
      )
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase() ||
    'material'

  const timestamp = Date.now()

  if (resourceType === 'raw') {
    return (
      `${timestamp}-${safeName}` +
      parsedFile.ext.toLowerCase()
    )
  }

  return `${timestamp}-${safeName}`
}

function isCloudinaryTimeout(error) {
  return (
    Number(error?.http_code) === 499 ||
    error?.name === 'TimeoutError' ||
    String(error?.message || '')
      .toLowerCase()
      .includes('timeout')
  )
}

function handleMaterialUpload(
  req,
  res,
  next
) {
  upload.single('file')(
    req,
    res,
    (error) => {
      if (!error) {
        next()
        return
      }

      if (
        error instanceof
          multer.MulterError &&
        error.code ===
          'LIMIT_FILE_SIZE'
      ) {
        return res
          .status(413)
          .json({
            message:
              'The file is too large. Maximum size is 50 MB.'
          })
      }

      console.error(
        'MATERIAL MULTER ERROR:',
        error
      )

      return res
        .status(400)
        .json({
          message:
            error?.message ||
            'Failed to process the uploaded file.'
        })
    }
  )
}

function uploadFileToCloudinary(
  file,
  materialType
) {
  const resourceType =
    getCloudinaryResourceType(
      materialType
    )

  const publicId =
    createPublicId(
      file.originalname,
      resourceType
    )

  const uploadOptions = {
    folder: 'lms-materials',
    resource_type: resourceType,
    type: 'upload',
    public_id: publicId,
    overwrite: false,
    use_filename: false,
    unique_filename: false
  }

  return new Promise(
    (resolve, reject) => {
      let settled = false

      function resolveOnce(result) {
        if (settled) {
          return
        }

        settled = true
        resolve(result)
      }

      function rejectOnce(error) {
        if (settled) {
          return
        }

        settled = true
        reject(error)
      }

      function handleResult(
        error,
        result
      ) {
        if (error) {
          rejectOnce(error)
          return
        }

        if (
          result &&
          result.done === false
        ) {
          return
        }

        if (!result?.secure_url) {
          rejectOnce(
            new Error(
              'Cloudinary did not return a secure URL'
            )
          )
          return
        }

        resolveOnce(result)
      }

      let uploadStream

      try {
        if (
          resourceType === 'video'
        ) {
          uploadStream =
            cloudinary.uploader
              .upload_chunked_stream(
                {
                  ...uploadOptions,
                  chunk_size:
                    CLOUDINARY_CHUNK_SIZE
                },
                handleResult
              )
        } else {
          uploadStream =
            cloudinary.uploader
              .upload_stream(
                uploadOptions,
                handleResult
              )
        }

        uploadStream.on(
          'error',
          rejectOnce
        )

        uploadStream.end(
          file.buffer
        )
      } catch (error) {
        rejectOnce(error)
      }
    }
  )
}

// Get materials by course
router.get(
  '/course/:courseId',
  authMiddleware,
  async (req, res) => {
    try {
      const courseId =
        parsePositiveInteger(
          req.params.courseId
        )

      if (!courseId) {
        return res
          .status(400)
          .json({
            message:
              'Invalid course ID'
          })
      }

      const materials =
        await prisma
          .learningMaterial
          .findMany({
            where: {
              course_id: courseId
            },
            orderBy: {
              uploaded_date: 'asc'
            }
          })

      return res.json(materials)
    } catch (error) {
      console.error(
        'GET COURSE MATERIALS ERROR:',
        error
      )

      return res
        .status(500)
        .json({
          message:
            'Failed to load course materials'
        })
    }
  }
)

// Trainer uploads a material
router.post(
  '/upload',
  authMiddleware,
  roleMiddleware('TRAINER'),
  handleMaterialUpload,
  async (req, res) => {
    try {
      const courseId =
        parsePositiveInteger(
          req.body.course_id
        )

      const materialTitle =
        String(
          req.body.material_title ||
            ''
        ).trim()

      const materialType =
        normalizeMaterialType(
          req.body.material_type
        )

      if (!courseId) {
        return res
          .status(400)
          .json({
            message:
              'A valid course ID is required'
          })
      }

      if (!materialTitle) {
        return res
          .status(400)
          .json({
            message:
              'Material title is required'
          })
      }

      if (!materialType) {
        return res
          .status(400)
          .json({
            message:
              'Material type is required'
          })
      }

      if (!req.file) {
        return res
          .status(400)
          .json({
            message:
              'A material file is required'
          })
      }

      console.log(
        'MATERIAL UPLOAD DEBUG:',
        {
          courseId,
          materialTitle,
          materialType,
          originalName:
            req.file.originalname,
          mimeType:
            req.file.mimetype,
          size:
            req.file.size
        }
      )

      const fileValidation =
        validateMaterialFile(
          materialType,
          req.file
        )

      if (!fileValidation.valid) {
        return res
          .status(400)
          .json({
            message:
              fileValidation.message
          })
      }

      const course =
        await prisma.course.findUnique({
          where: {
            id: courseId
          },
          select: {
            id: true,
            trainer_id: true,
            approval_status: true
          }
        })

      if (!course) {
        return res
          .status(404)
          .json({
            message:
              'Course not found'
          })
      }

      if (
        Number(
          course.trainer_id
        ) !==
        Number(req.user.user_id)
      ) {
        return res
          .status(403)
          .json({
            message:
              'You can only upload materials to your own courses'
          })
      }

      const editableStatuses = [
        'draft',
        'revision',
        'rejected'
      ]

      const currentStatus =
        String(
          course.approval_status ||
            ''
        )
          .trim()
          .toLowerCase()

      if (
        currentStatus &&
        !editableStatuses.includes(
          currentStatus
        )
      ) {
        return res
          .status(409)
          .json({
            message:
              'Materials can only be uploaded while the course is editable'
          })
      }

      const uploadResult =
        await uploadFileToCloudinary(
          req.file,
          materialType
        )

      const material =
        await prisma
          .learningMaterial
          .create({
            data: {
              course_id: courseId,
              material_title:
                materialTitle,
              material_type:
                materialType,
              file_url:
                uploadResult.secure_url
            }
          })

      return res
        .status(201)
        .json(material)
    } catch (error) {
      console.error(
        'UPLOAD MATERIAL ERROR:',
        error
      )

      if (
        isCloudinaryTimeout(error)
      ) {
        return res
          .status(504)
          .json({
            message:
              'The Cloudinary upload timed out. Please try uploading the file again.'
          })
      }

      return res
        .status(500)
        .json({
          message:
            error?.message ||
            'Failed to upload learning material'
        })
    }
  }
)

// Delete material
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('TRAINER'),
  async (req, res) => {
    try {
      const materialId =
        parsePositiveInteger(
          req.params.id
        )

      if (!materialId) {
        return res
          .status(400)
          .json({
            message:
              'Invalid material ID'
          })
      }

      const material =
        await prisma
          .learningMaterial
          .findUnique({
            where: {
              id: materialId
            },
            include: {
              course: {
                select: {
                  trainer_id: true,
                  approval_status: true
                }
              }
            }
          })

      if (!material) {
        return res
          .status(404)
          .json({
            message:
              'Material not found'
          })
      }

      if (
        Number(
          material.course
            .trainer_id
        ) !==
        Number(req.user.user_id)
      ) {
        return res
          .status(403)
          .json({
            message:
              'You can only delete materials from your own courses'
          })
      }

      const editableStatuses = [
        'draft',
        'revision',
        'rejected'
      ]

      const currentStatus =
        String(
          material.course
            .approval_status || ''
        )
          .trim()
          .toLowerCase()

      if (
        currentStatus &&
        !editableStatuses.includes(
          currentStatus
        )
      ) {
        return res
          .status(409)
          .json({
            message:
              'Materials cannot be deleted after course submission'
          })
      }

      await prisma
        .learningMaterial
        .delete({
          where: {
            id: materialId
          }
        })

      return res.json({
        message:
          'Learning material deleted successfully'
      })
    } catch (error) {
      console.error(
        'DELETE MATERIAL ERROR:',
        error
      )

      return res
        .status(500)
        .json({
          message:
            'Failed to delete learning material'
        })
    }
  }
)

module.exports = router