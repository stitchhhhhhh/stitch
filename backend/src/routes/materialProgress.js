const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');

const prisma = new PrismaClient();

/**
 * GET /api/material-progress/course/:courseId
 *
 * Mengambil seluruh material dalam sebuah course beserta status
 * penyelesaiannya untuk employee yang sedang login.
 */
router.get('/course/:courseId', authMiddleware, async (req, res) => {
  try {
    const courseId = Number(req.params.courseId);
    const userId = req.user.user_id;

    if (!Number.isInteger(courseId)) {
      return res.status(400).json({
        message: 'Course ID tidak valid',
      });
    }

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        user_id_course_id: {
          user_id: userId,
          course_id: courseId,
        },
      },
    });

    if (!enrollment) {
      return res.status(403).json({
        message: 'Anda tidak terdaftar pada course ini',
      });
    }

    const materials = await prisma.learningMaterial.findMany({
      where: {
        course_id: courseId,
      },
      orderBy: {
        uploaded_date: 'asc',
      },
      include: {
        progress: {
          where: {
            user_id: userId,
          },
        },
      },
    });

    const formattedMaterials = materials.map((material) => {
      const materialProgress = material.progress[0] ?? null;

      return {
        id: material.id,
        course_id: material.course_id,
        material_title: material.material_title,
        material_type: material.material_type,
        file_url: material.file_url,
        uploaded_date: material.uploaded_date,
        completed: materialProgress?.completed ?? false,
        completed_at: materialProgress?.completed_at ?? null,
      };
    });

    res.json({
      enrollment,
      materials: formattedMaterials,
    });
  } catch (err) {
    console.error('GET MATERIAL PROGRESS ERROR:', err);

    res.status(500).json({
      message: 'Gagal mengambil progress material',
    });
  }
});

/**
 * PUT /api/material-progress/:materialId/complete
 *
 * Menandai satu material selesai dan menghitung ulang persentase course.
 */
router.put('/:materialId/complete', authMiddleware, async (req, res) => {
  try {
    const materialId = Number(req.params.materialId);
    const userId = req.user.user_id;

    if (!Number.isInteger(materialId)) {
      return res.status(400).json({
        message: 'Material ID tidak valid',
      });
    }

    const material = await prisma.learningMaterial.findUnique({
      where: {
        id: materialId,
      },
    });

    if (!material) {
      return res.status(404).json({
        message: 'Material tidak ditemukan',
      });
    }

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        user_id_course_id: {
          user_id: userId,
          course_id: material.course_id,
        },
      },
    });

    if (!enrollment) {
      return res.status(403).json({
        message: 'Anda tidak terdaftar pada course ini',
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const materialProgress = await tx.materialProgress.upsert({
        where: {
          user_id_material_id: {
            user_id: userId,
            material_id: materialId,
          },
        },
        update: {
          completed: true,
          completed_at: new Date(),
        },
        create: {
          user_id: userId,
          material_id: materialId,
          completed: true,
          completed_at: new Date(),
        },
      });

      const totalMaterials = await tx.learningMaterial.count({
        where: {
          course_id: material.course_id,
        },
      });

      const completedMaterials = await tx.materialProgress.count({
        where: {
          user_id: userId,
          completed: true,
          material: {
            course_id: material.course_id,
          },
        },
      });

      /*
       * Material hanya mengisi maksimal 90%.
       * Sisa 10% diberikan setelah assessment lulus.
       */
      const completionPercentage =
        totalMaterials === 0
          ? 0
          : Math.round((completedMaterials / totalMaterials) * 90);

      const enrollmentStatus =
        completionPercentage > 0 ? 'in_progress' : 'assigned';

      const updatedEnrollment = await tx.courseEnrollment.update({
        where: {
          id: enrollment.id,
        },
        data: {
          completion_percentage: completionPercentage,
          status: enrollmentStatus,
        },
      });

      return {
        materialProgress,
        updatedEnrollment,
        totalMaterials,
        completedMaterials,
      };
    });

    res.json({
      message: 'Material berhasil ditandai selesai',
      material_progress: result.materialProgress,
      enrollment: result.updatedEnrollment,
      total_materials: result.totalMaterials,
      completed_materials: result.completedMaterials,
    });
  } catch (err) {
    console.error('COMPLETE MATERIAL ERROR:', err);

    res.status(500).json({
      message: 'Gagal menyimpan progress material',
    });
  }
});

module.exports = router;
