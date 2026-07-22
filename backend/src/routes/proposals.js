const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { authMiddleware, roleMiddleware } = require('../middleware/auth')

const prisma = new PrismaClient()

router.get("/", authMiddleware, async (req, res) => {
  try {
    const currentRole = String(
      req.user.role_name ||
      req.user.role?.role_name ||
      req.user.role ||
      ""
    ).toUpperCase();

    if (!["MANAGER", "HR"].includes(currentRole)) {
      return res.status(403).json({
        message: "Anda tidak memiliki akses ke proposal",
      });
    }

    const where =
      currentRole === "MANAGER"
        ? {
            submitted_by: req.user.user_id,
          }
        : {};

    const proposals =
      await prisma.programProposal.findMany({
        where,
        include: {
          submitter: {
            include: {
              department: true,
            },
          },
          approver: true,
          department: true,
        },
        orderBy: {
          submitted_date: "desc",
        },
      });

    return res.status(200).json(proposals);
  } catch (err) {
    console.error("GET PROPOSALS ERROR:", err);

    return res.status(500).json({
      message: err.message,
    });
  }
});

router.post(
  "/",
  authMiddleware,
  roleMiddleware("MANAGER"),
  async (req, res) => {
    try {
      const { proposal_title, description } = req.body;

      if (
        !proposal_title ||
        !proposal_title.trim()
      ) {
        return res.status(400).json({
          message: "Proposal title wajib diisi",
        });
      }

      const manager = await prisma.user.findFirst({
        where: {
          user_id: req.user.user_id,
        },
        select: {
          user_id: true,
          department_id: true,
        },
      });

      if (!manager) {
        return res.status(404).json({
          message: "Manager tidak ditemukan",
        });
      }

      if (!manager.department_id) {
        return res.status(400).json({
          message:
            "Manager belum memiliki department",
        });
      }

      const proposal =
        await prisma.programProposal.create({
          data: {
            proposal_title:
              proposal_title.trim(),

            description:
              description?.trim() || null,

            submitted_by:
              req.user.user_id,

            department_id:
              manager.department_id,

            status: "pending",
          },
          include: {
            department: true,
          },
        });

      return res.status(201).json({
        message:
          "Proposal berhasil dibuat dan dikirim ke HR",
        proposal,
      });
    } catch (err) {
      console.error(
        "CREATE PROPOSAL ERROR:",
        err
      );

      return res.status(500).json({
        message: err.message,
        code: err.code,
        meta: err.meta,
      });
    }
  }
);

// PUT — update proposal biasa (sebelum di-approve)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("MANAGER"),
  async (req, res) => {
    try {
      const proposalId = Number(
        req.params.id
      );

      const {
        proposal_title,
        description,
      } = req.body;

      if (!Number.isInteger(proposalId)) {
        return res.status(400).json({
          message:
            "Proposal ID tidak valid",
        });
      }

      if (
        !proposal_title ||
        !proposal_title.trim()
      ) {
        return res.status(400).json({
          message:
            "Proposal title wajib diisi",
        });
      }

      const existingProposal =
        await prisma.programProposal.findUnique({
          where: {
            id: proposalId,
          },
        });

      if (!existingProposal) {
        return res.status(404).json({
          message:
            "Proposal tidak ditemukan",
        });
      }

      if (
        existingProposal.submitted_by !==
        req.user.user_id
      ) {
        return res.status(403).json({
          message:
            "Anda tidak memiliki akses untuk mengubah proposal ini",
        });
      }

      if (
        existingProposal.status !== "pending"
      ) {
        return res.status(400).json({
          message:
            "Proposal yang sudah direview tidak dapat diubah",
        });
      }

      const proposal =
        await prisma.programProposal.update({
          where: {
            id: proposalId,
          },
          data: {
            proposal_title:
              proposal_title.trim(),

            description:
              description?.trim() || null,
          },
          include: {
            department: true,
          },
        });

      return res.status(200).json({
        message:
          "Proposal berhasil diperbarui",
        proposal,
      });
    } catch (err) {
      console.error(
        "UPDATE PROPOSAL ERROR:",
        err
      );

      return res.status(500).json({
        message: err.message,
        code: err.code,
        meta: err.meta,
      });
    }
  }
);


router.put(
  '/:id/review',
  authMiddleware,
  roleMiddleware('HR'),
  async (req, res) => {
    try {
      const proposalId = parseInt(req.params.id);
      const { status } = req.body;

      const allowedStatuses = ['approved', 'rejected'];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: 'Status harus approved atau rejected'
        });
      }

      const result = await prisma.$transaction(async (tx) => {
        const existingProposal = await tx.programProposal.findUnique({
          where: {
            id: proposalId
          },
          include: {
            submitter: {
              select: {
                department_id: true
              }
            }
          }
        });

        if (!existingProposal) {
          throw new Error('Proposal tidak ditemukan');
        }

        if (existingProposal.status !== 'pending') {
  throw new Error(
    'Proposal sudah direview dan tidak dapat diproses kembali'
  );
}

        const departmentId =
          existingProposal.department_id ??
          existingProposal.submitter?.department_id;

        if (status === 'approved' && !departmentId) {
          throw new Error(
            'Department proposal dan department pengaju tidak ditemukan'
          );
        }

        const proposal = await tx.programProposal.update({
          where: {
            id: proposalId
          },
          data: {
            status,
            department_id:
              status === 'approved'
                ? departmentId
                : existingProposal.department_id,
            approved_by: req.user.user_id,
            approval_date: new Date()
          }
        });

        await tx.notification.create({
          data: {
            user_id: proposal.submitted_by,
            title: 'Status Proposal',
            message:
              status === 'approved'
                ? 'Proposal Anda telah disetujui'
                : 'Proposal Anda ditolak'
          }
        });

        let trainingProgram = null;

        if (status === 'approved') {
          const existingProgram =
            await tx.trainingProgram.findFirst({
              where: {
                proposal_id: proposal.id
              }
            });

          if (!existingProgram) {
            trainingProgram =
              await tx.trainingProgram.create({
                data: {
                  proposal_id: proposal.id,
                  department_id: departmentId,
                  program_name: proposal.proposal_title,
                  description: proposal.description,
                  program_type: 'DEPARTMENT',
                  created_by: proposal.submitted_by,
                  status: 'draft'
                }
              });
          } else {
            trainingProgram = existingProgram;
          }
        }

        return {
          proposal,
          trainingProgram
        };
      });

      console.log('PROPOSAL REVIEW SUCCESS:', {
        proposalId: result.proposal.id,
        status: result.proposal.status,
        trainingProgramId:
          result.trainingProgram?.id ?? null
      });

      return res.status(200).json({
        message:
          status === 'approved'
            ? 'Proposal berhasil disetujui'
            : 'Proposal berhasil ditolak',
        proposal: result.proposal,
        trainingProgram: result.trainingProgram
      });
    } catch (err) {
  console.error('APPROVE ERROR:', err);

  if (err.message === 'Proposal tidak ditemukan') {
  return res.status(404).json({
    message: err.message
  });
}

return res.status(500).json({
  message: err.message,
  code: err.code,
  meta: err.meta
});

  if (
    err.message ===
    'Proposal sudah direview dan tidak dapat diproses kembali'
  ) {
    return res.status(400).json({
      message: err.message
    });
  }

  return res.status(500).json({
    message: err.message,
    code: err.code,
    meta: err.meta
  });
}
  }
);

module.exports = router
