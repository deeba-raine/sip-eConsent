const express = require('express')
const db = require('./config/db')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }

  next()
})

app.get('/', (req, res) => {
  res.send('Server is running')
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || password === undefined || password === '') {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  try {
    const [nurses] = await db.query(
      'SELECT id, name, email FROM nurses WHERE email = ? AND password = ? LIMIT 1',
      [email, String(password)]
    )

    if (!nurses.length) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.json({
      message: 'Login successful',
      nurse: nurses[0],
    })
  } catch (error) {
    console.error('Login database error:', error)
    res.status(500).json({ message: 'Unable to log in' })
  }
})

app.post('/api/consents', async (req, res) => {
  console.log('POST /api/consents received')
  const b = req.body

  try {
    // 1. Save the student (ignored if this student ID already exists)
    await db.query(
      `INSERT IGNORE INTO students
       (first_name, last_name, student_id, date_of_birth, grade, school)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [b.firstName, b.lastName, b.studentId, b.dateOfBirth, b.grade, b.school]
    )

    // 2. Get the student's database id
    const [rows] = await db.query(
      'SELECT id FROM students WHERE student_id = ?',
      [b.studentId]
    )
    const studentDbId = rows[0].id

    // 3. Save the consent
    const [consent] = await db.query(
      `INSERT INTO consents
       (student_id, parent_relationship, parent_first_name, parent_last_name,
        parent_email, parent_phone, allergies, vaccine_reaction,
        medical_condition, health_notes, signature, confirmed)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        studentDbId, b.relationship, b.parentFirstName, b.parentLastName,
        b.email, b.phone, b.allergies, b.vaccineReaction,
        b.medicalCondition, b.healthNotes, b.signature, b.confirmed ? 1 : 0,
      ]
    )

    // 4. Save each vaccine decision (vaccine ids 1, 2, 3)
    const decisions = [
      [1, b.meningococcalConsent],
      [2, b.hpvConsent],
      [3, b.hepatitisBConsent],
    ]

    for (const [vaccineId, decision] of decisions) {
      if (!decision) continue
      await db.query(
        'INSERT INTO consent_vaccines (consent_id, vaccine_id, decision) VALUES (?, ?, ?)',
        [consent.insertId, vaccineId, decision]
      )
    }

    res.status(201).json({ message: 'Consent saved successfully' })
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ message: 'Failed to save consent' })
  }
})

app.get('/api/consents', async (req, res) => {
  try {
    // 1. Consents joined with students
    const [consents] = await db.query(`
      SELECT c.*, s.first_name, s.last_name, s.student_id, s.grade, s.school,
        a.status AS assessment_status
      FROM consents c
      JOIN students s ON s.id = c.student_id
      LEFT JOIN assessments a ON a.id = (
        SELECT latest.id
        FROM assessments latest
        WHERE latest.student_id = s.id
        ORDER BY latest.assessed_at DESC, latest.id DESC
        LIMIT 1
      )
      ORDER BY c.submitted_at DESC
    `)

    // 2. All vaccine decisions
    const [decisions] = await db.query(`
      SELECT cv.consent_id, v.name, cv.decision
      FROM consent_vaccines cv
      JOIN vaccines v ON v.id = cv.vaccine_id
    `)

    // 3. Attach each consent's vaccines to it
    const result = consents.map((c) => {
      const mine = decisions.filter((d) => d.consent_id === c.id)
      return {
        ...c,
        vaccines_consented: mine.filter((d) => d.decision === 'Consent').map((d) => d.name).join(', '),
        vaccines_declined: mine.filter((d) => d.decision === 'Decline').map((d) => d.name).join(', '),
      }
    })

    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to load consents' })
  }
})

app.post('/api/assessments', async (req, res) => {
  const { studentId, vaccine, dateAdministered, doseNumber, notes } = req.body

  try {
    const [students] = await db.query(
      'SELECT id FROM students WHERE student_id = ?',
      [studentId]
    )

    if (!students.length) {
      return res.status(404).json({ message: 'Student not found' })
    }

    await db.query(
      `INSERT INTO assessments (student_id, status, notes)
       VALUES (?, ?, ?)`,
      [
        students[0].id,
        'Approved',
        JSON.stringify({ vaccine, dateAdministered, doseNumber, notes }),
      ]
    )

    res.status(201).json({ message: 'Assessment saved successfully' })
  } catch (error) {
    console.error('Assessment database error:', error)
    res.status(500).json({ message: 'Failed to save assessment' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`)
})