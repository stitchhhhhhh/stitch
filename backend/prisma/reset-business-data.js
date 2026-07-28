const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.$transaction([
    prisma.course.updateMany({ data: { assessment_id: null } }),
    prisma.auditLog.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.certificate.deleteMany(),
    prisma.assessmentResult.deleteMany(),
    prisma.question.deleteMany(),
    prisma.assessment.deleteMany(),
    prisma.learningMaterial.deleteMany(),
    prisma.courseEnrollment.deleteMany(),
    prisma.courseRequest.deleteMany(),
    prisma.course.deleteMany(),
    prisma.trainingProgram.deleteMany(),
    prisma.programProposal.deleteMany(),
    prisma.user.updateMany({ data: { total_points: 0 } }),
  ])

  console.log('Business data cleared. Users, departments, and roles were preserved.')
}

main()
  .catch((error) => {
    console.error('Business-data reset failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
