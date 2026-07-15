const express = require('express')
const router = express.Router()
const PDFDocument = require('pdfkit')
const ExcelJS = require('exceljs')
const { PrismaClient } = require('@prisma/client')
const { authMiddleware, roleMiddleware } = require('../middleware/auth')

const prisma = new PrismaClient()

// GET — Export laporan training ke PDF (HR only)
router.get('/export/pdf', authMiddleware, roleMiddleware('HR'), async (req, res) => {
  try {
    const enrollments = await prisma.courseEnrollment.findMany({
      select: {
        completion_percentage: true,
        status: true,
        assigned_date: true,
        user: {
          select: {
            full_name: true,
            department: { select: { name: true } }
          }
        },
        course: {
          select: { course_title: true }
        }
      }
    })

    const doc = new PDFDocument({ margin: 40 })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=training-report.pdf')

    doc.pipe(res)

    doc.fontSize(20).text('Laporan Training Karyawan', { align: 'center' })
    doc.moveDown()
    doc.fontSize(10).text(`Tanggal export: ${new Date().toLocaleDateString('id-ID')}`, { align: 'center' })
    doc.moveDown(2)

    // Header tabel
    doc.fontSize(10)
    let y = doc.y
    doc.text('Nama', 40, y, { width: 120 })
    doc.text('Departemen', 160, y, { width: 100 })
    doc.text('Kursus', 260, y, { width: 150 })
    doc.text('Progress', 410, y, { width: 60 })
    doc.text('Status', 470, y, { width: 80 })
    doc.moveDown()
    doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke()
    doc.moveDown(0.5)

    // Isi tabel
    enrollments.forEach(e => {
      y = doc.y
      doc.text(e.user.full_name, 40, y, { width: 120 })
      doc.text(e.user.department?.name || '-', 160, y, { width: 100 })
      doc.text(e.course.course_title, 260, y, { width: 150 })
      doc.text(`${e.completion_percentage}%`, 410, y, { width: 60 })
      doc.text(e.status, 470, y, { width: 80 })
      doc.moveDown()
    })

    doc.end()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET — Export laporan training ke Excel (HR only)
router.get('/export/excel', authMiddleware, roleMiddleware('HR'), async (req, res) => {
  try {
    const enrollments = await prisma.courseEnrollment.findMany({
      select: {
        completion_percentage: true,
        status: true,
        assigned_date: true,
        user: {
          select: {
            full_name: true,
            email: true,
            department: { select: { name: true } }
          }
        },
        course: {
          select: { course_title: true }
        }
      }
    })

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Training Report')

    sheet.columns = [
      { header: 'Nama Karyawan', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Departemen', key: 'department', width: 20 },
      { header: 'Kursus', key: 'course', width: 30 },
      { header: 'Progress (%)', key: 'progress', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Tanggal Assign', key: 'date', width: 20 }
    ]

    // Style header
    sheet.getRow(1).font = { bold: true }
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9D9D9' }
    }

    enrollments.forEach(e => {
      sheet.addRow({
        name: e.user.full_name,
        email: e.user.email,
        department: e.user.department?.name || '-',
        course: e.course.course_title,
        progress: e.completion_percentage,
        status: e.status,
        date: new Date(e.assigned_date).toLocaleDateString('id-ID')
      })
    })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename=training-report.xlsx')

    await workbook.xlsx.write(res)
    res.end()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET — Export laporan per departemen ke Excel (HR/Manager)
router.get('/export/department/:deptId/excel', authMiddleware, roleMiddleware('HR', 'MANAGER'), async (req, res) => {
  try {
    const deptId = parseInt(req.params.deptId)

    const enrollments = await prisma.courseEnrollment.findMany({
      where: { user: { department_id: deptId } },
      select: {
        completion_percentage: true,
        status: true,
        user: { select: { full_name: true, email: true } },
        course: { select: { course_title: true } }
      }
    })

    const department = await prisma.department.findUnique({ where: { id: deptId } })

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet(`Report - ${department?.name || 'Department'}`)

    sheet.columns = [
      { header: 'Nama Karyawan', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Kursus', key: 'course', width: 30 },
      { header: 'Progress (%)', key: 'progress', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ]

    sheet.getRow(1).font = { bold: true }
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9D9D9' }
    }

    enrollments.forEach(e => {
      sheet.addRow({
        name: e.user.full_name,
        email: e.user.email,
        course: e.course.course_title,
        progress: e.completion_percentage,
        status: e.status
      })
    })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=report-${department?.name || 'department'}.xlsx`)

    await workbook.xlsx.write(res)
    res.end()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router