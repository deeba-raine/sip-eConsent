import { useState } from 'react'
import axios from 'axios'
import './assessment.css'

function Assessment({ student, onBack, onSaved }) {
  const [form, setForm] = useState({
    vaccine: '',
    dateAdministered: '',
    doseNumber: '',
    notes: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')

    try {
      await axios.post('http://localhost:3000/api/assessments', {
        studentId: student.student_id,
        ...form,
      })
      setMessage('Assessment saved successfully.')
      onSaved()
    } catch (submitError) {
      console.error('Error saving assessment:', submitError)
      setError(
        submitError.response?.data?.message ||
          'The assessment could not be saved.'
      )
    }
  }

  return (
    <section className="assessment-card">
      <div className="assessment-header">
        <div>
          <p className="nurse-label">CLINIC ASSESSMENT</p>
          <h2>{student.first_name} {student.last_name}</h2>
          <p className="assessment-student">
            Class: {student.student_class || 'Not provided'}
          </p>
        </div>
        <button className="nurse-button secondary" type="button" onClick={onBack}>
          Back to records
        </button>
      </div>

      <form
        className="assessment-form"
        onSubmit={handleSubmit}
      >
        <label>
          Vaccine administered
          <select
            name="vaccine"
            value={form.vaccine}
            onChange={updateField}
            required
          >
            <option value="" disabled>Select a vaccine</option>
            <option>Meningococcal</option>
            <option>HPV</option>
            <option>Hepatitis B</option>
          </select>
        </label>

        <label>
          Date administered
          <input
            name="dateAdministered"
            type="date"
            value={form.dateAdministered}
            onChange={updateField}
            required
          />
        </label>

        <label>
          Dose number
          <input
            name="doseNumber"
            type="number"
            min="1"
            placeholder="e.g. 1"
            value={form.doseNumber}
            onChange={updateField}
            required
          />
        </label>

        <label>
          Notes
          <textarea
            name="notes"
            rows="4"
            placeholder="Add clinic notes"
            value={form.notes}
            onChange={updateField}
          />
        </label>

        <button className="assess-submit" type="submit">
          Save assessment
        </button>
        {message && <p className="success-message" role="status">{message}</p>}
        {error && <p className="error-message" role="alert">{error}</p>}
      </form>
    </section>
  )
}

export default Assessment
