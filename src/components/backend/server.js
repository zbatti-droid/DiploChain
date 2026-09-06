const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const nodemailer = require('nodemailer')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

// ═══════════════════════════════════════
// دالة تحويل diplomaType → degree_level
// ═══════════════════════════════════════
function mapDegreeLevel(t) {
  const s = (t || '').toLowerCase()
  if (s.includes('master'))   return 'master'
  if (s.includes('doctorat') || s.includes('phd')) return 'doctorat'
  if (s.includes('ingeni'))   return 'ingenieur'
  if (s.includes('bts'))      return 'bts'
  if (s.includes('licence'))  return 'licence'
  return 'autre'
}

// ═══════════════════════════════════════
// قاعدة البيانات
// ═══════════════════════════════════════
const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

pool.connect()
  .then(() => console.log('✅ متصل بقاعدة البيانات PostgreSQL'))
  .catch(err => console.error('❌ خطأ في الاتصال:', err.message))

// ═══════════════════════════════════════
// 1. حفظ شهادة جديدة — الحل النهائي لـ CNE
// ═══════════════════════════════════════
app.post('/api/diplomas', async (req, res) => {
  const { studentName, cne, institution, diplomaType, issueDate, blockchainHash, ipfsHash, walletAddress, studentEmail } = req.body

  console.log('📥 بيانات واردة:', { studentName, cne, institution, diplomaType, issueDate })

  try {
    const cleanCNE = cne && cne.trim() ? cne.trim() : null

    // ══ الخطوة 1: البحث عن الطالب بـ CNE فقط ══
    let studentId = null

    if (cleanCNE) {
      const byCNE = await pool.query('SELECT id FROM students WHERE student_number = $1', [cleanCNE])
      if (byCNE.rows.length > 0) {
        studentId = byCNE.rows[0].id
        console.log('✅ وجد الطالب بـ CNE:', cleanCNE)
      }
    }

    // ══ الخطوة 2: إذا لم يوجد بـ CNE، ابحث بـ walletAddress ثم حدّث CNE ══
    if (!studentId && walletAddress) {
      const byWallet = await pool.query('SELECT id FROM students WHERE student_number = $1', [walletAddress])
      if (byWallet.rows.length > 0) {
        studentId = byWallet.rows[0].id
        console.log('🔄 وجد بـ wallet، يحدّث CNE إلى:', cleanCNE || walletAddress)
        // ✅ تحديث student_number بـ CNE الصحيح
        if (cleanCNE) {
          await pool.query('UPDATE students SET student_number = $1 WHERE id = $2', [cleanCNE, studentId])
          console.log('✅ تم تحديث CNE بنجاح!')
        }
      }
    }

    // ══ الخطوة 3: إذا لم يوجد أصلاً، أنشئه بـ CNE ══
    if (!studentId) {
      const email = studentEmail || `${(studentName || 'student').replace(/\s/g, '').toLowerCase()}@diplochain.ma`

      // ابحث عن user موجود
      const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email])
      let userId

      if (existingUser.rows.length > 0) {
        userId = existingUser.rows[0].id
        // تحديث CNE إذا كان موجوداً
        if (cleanCNE) {
          await pool.query('UPDATE students SET student_number = $1 WHERE user_id = $2', [cleanCNE, userId])
        }
        // تحقق من وجود سجل student
        const existingStudent = await pool.query('SELECT id FROM students WHERE user_id = $1', [userId])
        if (existingStudent.rows.length > 0) {
          studentId = existingStudent.rows[0].id
        }
      }

      if (!studentId) {
        // أنشئ user جديد
        if (!existingUser.rows.length) {
          const userResult = await pool.query(
            `INSERT INTO users (full_name, email, password_hash, role, wallet_address, is_verified)
             VALUES ($1, $2, 'blockchain_user', 'student', $3, true) RETURNING id`,
            [studentName, email, walletAddress]
          )
          userId = userResult.rows[0].id
        }
        // أنشئ student بـ CNE
        const newStudent = await pool.query(
          `INSERT INTO students (user_id, student_number) VALUES ($1, $2) RETURNING id`,
          [userId, cleanCNE || walletAddress || studentName]
        )
        studentId = newStudent.rows[0].id
        console.log('✅ طالب جديد بـ CNE:', cleanCNE || walletAddress)
      }
    }

    // ══ الخطوة 4: المؤسسة ══
    let institutionResult = await pool.query('SELECT id FROM institutions WHERE name = $1', [institution])
    let institutionId

    if (institutionResult.rows.length === 0) {
      const instEmail = `contact@${institution.replace(/\s/g, '').toLowerCase()}.ma`
      const existingInst = await pool.query('SELECT id FROM users WHERE email = $1', [instEmail])
      let instUserId

      if (existingInst.rows.length > 0) {
        instUserId = existingInst.rows[0].id
      } else {
        const userResult = await pool.query(
          `INSERT INTO users (full_name, email, password_hash, role, is_verified)
           VALUES ($1, $2, 'blockchain_institution', 'institution', true) RETURNING id`,
          [institution, instEmail]
        )
        instUserId = userResult.rows[0].id
      }
      const newInst = await pool.query(
        `INSERT INTO institutions (user_id, name, is_approved) VALUES ($1, $2, true) RETURNING id`,
        [instUserId, institution]
      )
      institutionId = newInst.rows[0].id
    } else {
      institutionId = institutionResult.rows[0].id
    }

    // ══ الخطوة 5: حفظ الشهادة ══
    const degreeLevel = mapDegreeLevel(diplomaType)
    console.log('🎓 degree_level:', degreeLevel)

    const diplomaResult = await pool.query(
      `INSERT INTO diplomas (student_id, institution_id, diploma_title, degree_level, graduation_date, blockchain_hash, ipfs_hash, status, issued_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'issued', NOW()) RETURNING *`,
      [studentId, institutionId, diplomaType, degreeLevel, issueDate, blockchainHash, ipfsHash || null]
    )
    console.log('✅ شهادة محفوظة! ID:', diplomaResult.rows[0].id)

    // سجل العمليات
    await pool.query(
      `INSERT INTO audit_logs (action, target_type, target_id, details) VALUES ('diploma.created', 'diploma', $1, $2)`,
      [diplomaResult.rows[0].id, JSON.stringify({ studentName, cne: cleanCNE, institution, diplomaType })]
    )

    // إرسال Email
    if (studentEmail && process.env.EMAIL_USER) {
      try {
        const transporter = nodemailer.createTransporter({
          service: 'gmail',
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        })
        await transporter.sendMail({
          from: `DiploChain <${process.env.EMAIL_USER}>`,
          to: studentEmail,
          subject: '🎓 Votre diplôme a été enregistré sur la blockchain',
          html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
            <h2 style="color:#1d4ed8">Félicitations, ${studentName}!</h2>
            <p>Votre diplôme <strong>${diplomaType}</strong> de <strong>${institution}</strong> a été enregistré.</p>
            <p><strong>Code:</strong> <code>${blockchainHash}</code></p>
          </div>`
        })
      } catch (e) { console.error('⚠️ Email:', e.message) }
    }

    res.json({ success: true, diploma: diplomaResult.rows[0] })
  } catch (err) {
    console.error('❌ خطأ:', err.message)
    res.status(500).json({ success: false, error: err.message })
  }
})

// ═══════════════════════════════════════
// جلب شهادات بـ CNE
// ═══════════════════════════════════════
app.get('/api/diplomas/cne/:cne', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, u.full_name as student_name, i.name as institution_name, s.student_number as cne
       FROM diplomas d
       JOIN students s ON d.student_id = s.id
       JOIN users u ON s.user_id = u.id
       JOIN institutions i ON d.institution_id = i.id
       WHERE s.student_number = $1
       ORDER BY d.created_at DESC`,
      [req.params.cne]
    )
    console.log('🔍 CNE:', req.params.cne, '← شهادات:', result.rows.length)
    if (result.rows.length === 0)
      return res.json({ success: false, message: 'Aucun diplôme trouvé pour ce CNE' })
    res.json({ success: true, diplomas: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ═══════════════════════════════════════
// جلب كل الشهادات
// ═══════════════════════════════════════
app.get('/api/diplomas', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, u.full_name as student_name, i.name as institution_name
       FROM diplomas d
       JOIN students s ON d.student_id = s.id
       JOIN users u ON s.user_id = u.id
       JOIN institutions i ON d.institution_id = i.id
       ORDER BY d.created_at DESC`
    )
    res.json({ success: true, diplomas: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ═══════════════════════════════════════
// التحقق من شهادة بـ Hash
// ✅ مُصحَّح: أضفنا s.student_number as cne + LEFT JOIN
// ═══════════════════════════════════════
app.get('/api/diplomas/verify/:hash', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, u.full_name as student_name, i.name as institution_name, s.student_number as cne
       FROM diplomas d
       LEFT JOIN students s ON d.student_id = s.id
       LEFT JOIN users u ON s.user_id = u.id
       JOIN institutions i ON d.institution_id = i.id
       WHERE d.blockchain_hash = $1`,
      [req.params.hash]
    )
    if (result.rows.length === 0)
      return res.json({ success: false, message: 'Diplôme introuvable' })
    res.json({ success: true, diploma: result.rows[0] })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ═══════════════════════════════════════
// سجل تحققات الطالب
// ═══════════════════════════════════════
app.post('/api/student-verifications', async (req, res) => {
  const { cne, studentName, institution, diplomaType, issueDate, blockchainHash, isValid } = req.body
  try {
    await pool.query(
      `INSERT INTO student_verifications (cne, student_name, institution, diploma_type, issue_date, blockchain_hash, is_valid)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [cne, studentName, institution, diplomaType, issueDate, blockchainHash, isValid]
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.get('/api/student-verifications/:cne', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM student_verifications WHERE cne = $1 ORDER BY verified_at DESC`,
      [req.params.cne]
    )
    res.json({ success: true, verifications: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ═══════════════════════════════════════
// إحصائيات
// ═══════════════════════════════════════
app.get('/api/stats', async (req, res) => {
  try {
    const total    = await pool.query('SELECT COUNT(*) FROM diplomas')
    const month    = await pool.query(`SELECT COUNT(*) FROM diplomas WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())`)
    const withPDF  = await pool.query('SELECT COUNT(*) FROM diplomas WHERE ipfs_hash IS NOT NULL')
    const byType   = await pool.query('SELECT degree_level, COUNT(*) FROM diplomas GROUP BY degree_level')
    res.json({ success: true, stats: {
      total: parseInt(total.rows[0].count),
      thisMonth: parseInt(month.rows[0].count),
      withPDF: parseInt(withPDF.rows[0].count),
      byType: byType.rows
    }})
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ═══════════════════════════════════════
// مزامنة Ganache → PostgreSQL
// ═══════════════════════════════════════
app.post('/api/sync', async (req, res) => {
  const { diplomas } = req.body
  if (!diplomas || !Array.isArray(diplomas))
    return res.status(400).json({ success: false, error: 'Invalid data' })

  let synced = 0, skipped = 0
  for (const d of diplomas) {
    try {
      const exists = await pool.query('SELECT id FROM diplomas WHERE blockchain_hash = $1', [d.blockchainHash])
      if (exists.rows.length > 0) { skipped++; continue }

      const cneVal = d.cne && d.cne.trim() ? d.cne.trim() : null
      let studentResult = await pool.query(
        'SELECT id FROM students WHERE student_number = $1',
        [cneVal || d.studentName]
      )
      let studentId
      if (studentResult.rows.length === 0) {
        const email = `${d.studentName.replace(/\s/g, '').toLowerCase()}@sync.ma`
        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email])
        let userId
        if (existingUser.rows.length > 0) {
          userId = existingUser.rows[0].id
        } else {
          const u = await pool.query(
            `INSERT INTO users (full_name, email, password_hash, role, is_verified) VALUES ($1, $2, 'sync', 'student', true) RETURNING id`,
            [d.studentName, email]
          )
          userId = u.rows[0].id
        }
        const ns = await pool.query(
          `INSERT INTO students (user_id, student_number) VALUES ($1, $2) RETURNING id`,
          [userId, cneVal || d.studentName]
        )
        studentId = ns.rows[0].id
      } else {
        studentId = studentResult.rows[0].id
        // تحديث CNE إذا كان موجوداً
        if (cneVal) {
          await pool.query('UPDATE students SET student_number = $1 WHERE id = $2', [cneVal, studentId])
        }
      }

      let instResult = await pool.query('SELECT id FROM institutions WHERE name = $1', [d.institution])
      let institutionId
      if (instResult.rows.length === 0) {
        const instEmail = `contact@${d.institution.replace(/\s/g,'').toLowerCase()}.ma`
        const ei = await pool.query('SELECT id FROM users WHERE email = $1', [instEmail])
        let iid
        if (ei.rows.length > 0) { iid = ei.rows[0].id } else {
          const ur = await pool.query(
            `INSERT INTO users (full_name, email, password_hash, role, is_verified) VALUES ($1, $2, 'sync', 'institution', true) RETURNING id`,
            [d.institution, instEmail]
          )
          iid = ur.rows[0].id
        }
        const ni = await pool.query(`INSERT INTO institutions (user_id, name, is_approved) VALUES ($1, $2, true) RETURNING id`, [iid, d.institution])
        institutionId = ni.rows[0].id
      } else { institutionId = instResult.rows[0].id }

      await pool.query(
        `INSERT INTO diplomas (student_id, institution_id, diploma_title, degree_level, graduation_date, blockchain_hash, ipfs_hash, status, issued_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'issued', NOW())`,
        [studentId, institutionId, d.diplomaType, mapDegreeLevel(d.diplomaType), d.issueDate, d.blockchainHash, d.ipfsHash || null]
      )
      synced++
    } catch (err) { console.error('Sync error:', err.message) }
  }
  res.json({ success: true, synced, skipped, total: diplomas.length })
})

// ═══════════════════════════════════════
// تقرير
// ═══════════════════════════════════════
app.get('/api/report', async (req, res) => {
  try {
    const diplomas = await pool.query(
      `SELECT d.*, u.full_name as student_name, i.name as institution_name
       FROM diplomas d
       JOIN students s ON d.student_id = s.id
       JOIN users u ON s.user_id = u.id
       JOIN institutions i ON d.institution_id = i.id
       ORDER BY d.created_at DESC`
    )
    const stats = await pool.query(`
      SELECT COUNT(*) as total,
        COUNT(CASE WHEN status='issued' THEN 1 END) as issued,
        COUNT(CASE WHEN status='revoked' THEN 1 END) as revoked,
        COUNT(CASE WHEN ipfs_hash IS NOT NULL THEN 1 END) as with_pdf,
        COUNT(CASE WHEN DATE_TRUNC('month',created_at)=DATE_TRUNC('month',NOW()) THEN 1 END) as this_month
      FROM diplomas
    `)
    res.json({ success: true, report: { generatedAt: new Date().toLocaleString('fr-FR'), stats: stats.rows[0], diplomas: diplomas.rows } })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ═══════════════════════════════════════
// إدارة المستخدمين
// ═══════════════════════════════════════
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query(`SELECT id, full_name, email, role, is_verified, created_at FROM users ORDER BY created_at DESC`)
    res.json({ success: true, users: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.put('/api/users/:id', async (req, res) => {
  const { full_name, email, is_verified } = req.body
  try {
    await pool.query(`UPDATE users SET full_name=$1, email=$2, is_verified=$3 WHERE id=$4`, [full_name, email, is_verified, req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.delete('/api/users/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id=$1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ═══════════════════════════════════════
// تشغيل السيرفر
// ═══════════════════════════════════════
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 السيرفر يعمل على http://localhost:${PORT}`))