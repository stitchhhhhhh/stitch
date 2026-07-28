const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const roleNames = ['HR', 'MANAGER', 'TRAINER', 'EMPLOYEE', 'ADMIN']

  for (const name of roleNames) {
    const existingRole = await prisma.role.findFirst({ where: { name } })
    if (!existingRole) await prisma.role.create({ data: { name } })
  }

  console.log('Reference roles seeded. No demo or business data was created.')
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
