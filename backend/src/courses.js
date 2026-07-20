router.get('/upcoming/deadlines', authMiddleware, async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        deadline: {
          gte: new Date()
        }
      },
      orderBy: {
        deadline: 'asc'
      },
      take: 10
    })

    res.json(courses)
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})
