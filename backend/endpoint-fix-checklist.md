# Endpoint Fix Checklist

Gunakan dokumen ini setelah menjalankan:

```bash
./empty-db-test.sh
./functional-api-test.sh
```

Laporan otomatis tersimpan di:

```text
backend/test-reports/
```

Status:

- `[ ]` Belum diperiksa
- `[~]` Sedang diperbaiki
- `[x]` Selesai dan sudah diuji ulang
- `[N/A]` Tidak diwajibkan BRD/ERD

## 1. Empty Database Test

### Startup dan migration

- [ ] Isolated schema atau migration gagal
  - File: `backend/prisma/schema.prisma`, `backend/prisma/migrations/`
  - Expected: migration dapat dijalankan dari database kosong.

### Authentication

- [ ] `POST /api/auth/login` menghasilkan 500 saat user tidak ada
  - File: `backend/src/routes/auth.js`
  - Expected: input kosong `400`, kredensial salah `401`, akun inactive `403`.

- [ ] Endpoint protected tanpa token tidak menghasilkan `401`
  - File: `backend/src/middleware/auth.js`

### Empty lists

- [ ] `GET /api/programs` tidak mengembalikan `[]`
  - File: `backend/src/routes/programs.js`

- [ ] `GET /api/proposals` tidak mengembalikan `[]`
  - File: `backend/src/routes/proposals.js`

- [ ] `GET /api/course-requests` tidak mengembalikan `[]`
  - File: `backend/src/routes/courseRequests.js`

- [ ] `GET /api/courses` tidak mengembalikan `data: []` dan total `0`
  - File: `backend/src/routes/courses.js`

- [ ] `GET /api/enrollments/user/:userId` gagal pada data kosong
  - File: `backend/src/routes/enrollments.js`

- [ ] `GET /api/assessment-results/user/:userId` gagal pada data kosong
  - File: `backend/src/routes/assessmentResults.js`

- [ ] `GET /api/notifications` gagal pada data kosong
  - File: `backend/src/routes/notifications.js`

- [ ] `GET /api/certificates/user/:userId` gagal pada data kosong
  - File: `backend/src/routes/certificates.js`

- [ ] `GET /api/leaderboard` menghasilkan `500` pada data kosong
  - File: `backend/src/routes/leaderboard.js`

### Zero-state aggregates

- [ ] Dashboard mengandung `null`, `undefined`, atau `NaN`
  - Endpoint: `GET /api/dashboard/summary`
  - File: `backend/src/routes/dashboard.js`
  - Expected business totals: `0`.

- [ ] Company analytics gagal pada aggregate kosong
  - Endpoint: `GET /api/analytics/company`
  - File: `backend/src/routes/analytics.js`
  - Gunakan fallback seperti `aggregate._avg.score ?? 0`.

- [ ] HR overview gagal pada database kosong
  - Endpoint: `GET /api/hr/overview`
  - File: `backend/src/routes/hr.js`
  - Hindari pembagian dengan nol; gunakan array kosong dan angka `0`.

## 2. Functional API Test

### Login

- [ ] HR gagal login
- [ ] Manager gagal login
- [ ] Trainer gagal login
- [ ] Employee gagal login
  - Endpoint: `POST /api/auth/login`
  - File: `backend/src/routes/auth.js`

### Program

- [ ] HR gagal membuat program
  - Endpoint: `POST /api/programs`
  - File: `backend/src/routes/programs.js`

- [ ] Employee dapat membuat program
  - Expected: `403`.

### Proposal

- [ ] Manager gagal submit proposal
  - Endpoint: `POST /api/proposals`
  - File: `backend/src/routes/proposals.js`
  - Pastikan `submitted_by` dan department berasal dari user login, bukan dipercaya dari body.

- [ ] Manager dapat melihat proposal di luar scope
  - Endpoint: `GET /api/proposals`
  - Expected: hanya data sesuai department/ownership BRD.

### Course Request

- [ ] HR/Manager gagal membuat course request
  - Endpoint: `POST /api/course-requests`
  - File: `backend/src/routes/courseRequests.js`

- [ ] Trainer lain dapat menerima request yang bukan miliknya
  - Endpoint: `PUT /api/course-requests/:id`
  - Expected: `403` atau `404`.

- [ ] Status request tidak tervalidasi
  - File: `backend/src/routes/courseRequests.js`

### Course

- [ ] Trainer gagal membuat course dari accepted request
  - Endpoint: `POST /api/courses`
  - File: `backend/src/routes/courses.js`
  - Periksa ownership trainer, program match, request status, dan duplicate link.

- [ ] Route submit course tidak ditemukan
  - Periksa `PUT /api/courses/:id/submit` atau `submit-for-review`.
  - Pastikan route statis berada sebelum `GET /:id`.

- [ ] Manager dapat approve course department lain
  - Endpoint: `PUT /api/courses/:id/manager-review`
  - Expected: `403` atau `404`.

### Material

- [ ] Read materials gagal ketika kosong
  - Endpoint: `GET /api/materials/course/:courseId`
  - File: `backend/src/routes/materials.js`

- [ ] Trainer dapat upload ke course trainer lain
  - Endpoint: `POST /api/materials/upload`
  - Expected: `403` atau `404`.

- [ ] Cloudinary timeout selalu menjadi generic `500`
  - Expected timeout: `504`.

- [ ] `MaterialProgress` belum dipakai
  - Current finding: tidak ada `prisma.materialProgress`.
  - [ ] Required oleh BRD
  - [ ] N/A

### Assessment

- [ ] Trainer dapat membuat assessment pada course trainer lain
  - Endpoint: `POST /api/assessments`
  - File: `backend/src/routes/assessments.js`

- [ ] Trainer dapat CRUD question milik trainer lain
  - Endpoints: create/update/delete question.

- [ ] `QuestionOption` belum dipakai
  - Current implementation menggunakan `correct_answer` text.
  - [ ] Implement sesuai BRD
  - [ ] N/A

### Enrollment

- [ ] Tidak ada mekanisme create enrollment sesuai BRD
  - File: `backend/src/routes/enrollments.js`, `backend/src/routes/courses.js`

- [ ] Employee dapat update enrollment user lain
  - Endpoint: `PUT /api/enrollments/:id/progress`
  - Expected: `403` atau `404`.

- [ ] Completion percentage menerima nilai di luar `0–100`
  - Expected: `400`.

### Assessment Result

- [ ] User yang tidak enrolled dapat submit assessment
  - Expected: `403`.

- [ ] Assessment dapat dikerjakan dua kali
  - Expected: `409`.

- [ ] Jawaban dari assessment lain diterima
  - Expected: `400`.

- [ ] Poin diberikan walaupun tidak lulus
  - File: `backend/src/routes/assessmentResults.js`

### Certificate

- [ ] Certificate gagal setelah progress `100%`
  - Endpoint: `POST /api/certificates/generate`
  - Periksa enrollment, duplicate prevention, PDF, dan Cloudinary.

- [ ] User dapat membaca certificate user lain
  - Endpoint: `GET /api/certificates/user/:userId`
  - Expected: owner/role yang diizinkan saja.

- [ ] Duplicate certificate dapat dibuat
  - Expected: `409` atau `400`.

### Leaderboard

- [ ] Employee yang mendapat poin tidak muncul
  - Endpoint: `GET /api/leaderboard`
  - File: `backend/src/routes/leaderboard.js`

- [ ] Scope leaderboard tidak sesuai BRD
  - [ ] Employee only
  - [ ] Department scoped
  - [ ] Company wide

### Badge

- [ ] `Badge` dan `UserBadge` belum digunakan
  - Current finding: tidak ada `prisma.badge` atau `prisma.userBadge`.
  - [ ] Required oleh BRD
  - [ ] N/A

## 3. HTTP Status Standard

| Kondisi | Status |
|---|---:|
| Input tidak valid | 400 |
| Token hilang/tidak valid | 401 |
| Role/ownership ditolak | 403 |
| Resource tidak ditemukan | 404 |
| Duplicate/conflict | 409 |
| External timeout | 504 |
| Unexpected server error | 500 |

Jangan mengirim Prisma error internal, stack trace, password hash, atau secret ke frontend.

## 4. Final Retest

```bash
cd /var/www/learningcompany-sandbox/app/backend
node -c src/index.js
npx prisma validate
npx prisma generate
./empty-db-test.sh
./functional-api-test.sh
```

Setelah hasil bersih:

```bash
pm2 restart lms-backend-sandbox
pm2 logs lms-backend-sandbox --lines 100
```

- [ ] Empty database test: `FAIL = 0`
- [ ] Functional API test: `FAIL = 0`
- [ ] Semua `SKIP` telah dijelaskan
- [ ] Tidak ada mock/dummy data production
- [ ] UI tidak berubah
- [ ] Main database tidak pernah di-reset
- [ ] Prisma validate berhasil
- [ ] Backend restart berhasil
