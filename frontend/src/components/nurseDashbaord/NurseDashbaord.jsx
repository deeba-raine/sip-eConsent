import { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import './nurse-dashboard.css'
import Assessment from './Assessment'
import ManualEntry from './ManualEntry'
import StudentDetails from './StudentDetails'
import StudentRecords from './StudentRecords'

function NurseDashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [assessmentStudent, setAssessmentStudent] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const showManualEntry = location.pathname === '/nurse-dashboard/manual-entry'

  useEffect(() => {
    async function loadConsents() {
      try {
        const response = await axios.get('http://localhost:3000/api/consents')
        const records = response.data.map((record) => ({
          ...record,
          student_class: record.grade,
          vaccine_consent: record.vaccines_consented
            ? record.vaccines_consented.split(', ').map((vaccine) => ({
                vaccine,
                consent: 'Consent',
              }))
            : [],
        }))
        setStudents(records)
      } catch (error) {
        console.error('Error loading consent records:', error)
        setLoadError('Could not load consent records.')
      }
    }

    loadConsents()
  }, [refreshKey])

  return (
    <div className="app">
      <aside className="sidebar">
        <p className="program-title">School Immunization Consent Program</p>
        <nav className="sidebar-nav">
            
         
          <button
            className={`nav-item${!showManualEntry ? ' active' : ''}`}
            type="button"
            onClick={() => {
              navigate('/nurse-dashboard')
              setSelectedStudent(null)
              setAssessmentStudent(null)
            }}
          >
            📊 Dashboard
          </button>
          
          <button
            className={`nav-item${showManualEntry ? ' active' : ''}`}
            type="button"
            onClick={() => navigate('/nurse-dashboard/manual-entry')}
          >
            ✍️ Manual Entry
          </button>
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">SJ</div>
          <div className="user-info">
            <div className="name">Sarah Johnson</div>
            <div className="role">Public Health Nurse</div>
          </div>
          <button
            className="logout-btn"
            type="button"
            title="Log out"
            aria-label="Log out"
            onClick={() => {
              localStorage.clear()
              sessionStorage.clear()
              navigate('/login')
            }}
          >
            ⏻
          </button>
        </div>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <div className="topbar-title">Nurse Portal</div>
          <div className="topbar-right">
            <span className="clinic-badge">● Clinic Active</span>
            <span className="today-date">October 3, 2026</span>
          </div>
        </header>

        <main className="nurse-main">
          {loadError && <p className="error-message">{loadError}</p>}
          {showManualEntry ? (
            <ManualEntry
              onBack={() => navigate('/nurse-dashboard')}
              onSaved={() => {
                navigate('/nurse-dashboard')
                setRefreshKey((key) => key + 1)
              }}
            />
          ) : assessmentStudent ? (
            <Assessment
              student={assessmentStudent}
              onBack={() => setAssessmentStudent(null)}
              onSaved={() => {
                setAssessmentStudent(null)
                setRefreshKey((key) => key + 1)
              }}
            />
          ) : selectedStudent ? (
            <StudentDetails
              student={selectedStudent}
              onBack={() => setSelectedStudent(null)}
            />
          ) : (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">Total Consents</span>
                  <strong className="stat-value">{students.length}</strong>
                  <span className="stat-sub">Current records</span>
                </div>
                <div className="stat-card green">
                  <span className="stat-label">Submitted</span>
                  <strong className="stat-value">{students.length}</strong>
                  <span className="stat-sub">Ready for review</span>
                </div>
                <div className="stat-card gold">
                  <span className="stat-label">Pending</span>
                  <strong className="stat-value">0</strong>
                  <span className="stat-sub">Awaiting submission</span>
                </div>
                <div className="stat-card red">
                  <span className="stat-label">Assessed Today</span>
                  <strong className="stat-value">0</strong>
                  <span className="stat-sub">Clinic assessments</span>
                </div>
              </div>
              <StudentRecords
                students={students}
                onSelect={setSelectedStudent}
                onAssess={setAssessmentStudent}
              />
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default NurseDashboard
