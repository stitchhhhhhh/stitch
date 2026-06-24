const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // 1. Seed Roles
  await prisma.role.createMany({
    data: [
      { id: 1, name: 'HR' },
      { id: 2, name: 'MANAGER' },
      { id: 3, name: 'TRAINER' },
      { id: 4, name: 'EMPLOYEE' },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Roles seeded')

  // 2. Seed Departments
  await prisma.department.createMany({
    data: [
      { id: 1, name: 'Human Resource', description: 'HR Department' },
      { id: 2, name: 'Information Technology', description: 'IT Department' },
      { id: 3, name: 'Finance', description: 'Finance Department' },
      { id: 4, name: 'Marketing', description: 'Marketing Department' },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Departments seeded')

  // 3. Seed Users
  // Ganti email dengan email Google asli kalian
  await prisma.user.createMany({
    data: [
      {
        id: 1,
        full_name: 'Ilfa Nur Fatimah',
        email: 'ilfa@gmail.com',       // ganti email Google Ilfa
        role_id: 1,                     // HR
        department_id: 1,               // Human Resource
        status: 'active',
        total_points: 0,
      },
      {
        id: 2,
        full_name: 'Annisa Regita',
        email: 'annisa@gmail.com',      // ganti email Google Annisa
        role_id: 2,                     // MANAGER
        department_id: 2,               // IT
        status: 'active',
        total_points: 0,
      },
      {
        id: 3,
        full_name: 'Bunga Ayu',
        email: 'bunga@gmail.com',       // ganti email Google Bunga
        role_id: 3,                     // TRAINER
        department_id: 2,               // IT
        status: 'active',
        total_points: 0,
      },
      {
        id: 4,
        full_name: 'Sarah Diana',
        email: 'sarah@gmail.com',       // ganti email Google Sarah
        role_id: 4,                     // EMPLOYEE
        department_id: 3,               // Finance
        status: 'active',
        total_points: 0,
      },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Users seeded')

  console.log('🎉 Semua data berhasil diinput!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })