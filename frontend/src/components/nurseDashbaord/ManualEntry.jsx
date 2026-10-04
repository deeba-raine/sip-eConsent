import { useState } from 'react'
import axios from 'axios'

function ManualEntry({ onBack, onSaved }) {
  const [form, setForm] = useState({
    lastName: '',
    firstName: '',
    dateOfBirth: '',
    studentClass: '',
    parentFullName: '',
    phoneNumber: '',
    meningococcalConsent: '',
    hpvConsent: '',
    hepatitisBConsent: '',
    consentMethod: 'Verbal',
    notes: '',
  })
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  function updateField(event) {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSaving(true)

    const parentName = form.parentFullName.trim().split(/\s+/)
    const studentId = `manual-${form.lastName.trim()}-${form.firstName.trim()}-${form.dateOfBirth}`

    try {
      await axios.post('http://localhost:3000/api/consents', {
        firstName: form.firstName,
        lastName: form.lastName,
        studentId,
        dateOfBirth: form.dateOfBirth,
        grade: form.studentClass,
        school: '',
        parentFirstName: parentName.shift() || '',
        parentLastName: parentName.join(' '),
        phone: form.phoneNumber,
        meningococcalConsent: form.meningococcalConsent,
        hpvConsent: form.hpvConsent,
        hepatitisBConsent: form.hepatitisBConsent,
        healthNotes: `Manual ${form.consentMethod} entry${form.notes ? `: ${form.notes}` : ''}`,
        signature: 'Manual entry',
        confirmed: true,
      })
      onSaved()
    } catch (submitError) {
      console.error('Error saving manual consent:', submitError)
      setError(
        submitError.response?.data?.message ||
          'The manual consent could not be saved.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="nurse-card manual-entry-card">
      <div className="nurse-card-header">
        <div>
          <p className="nurse-label">MANUAL CONSENT ENTRY</p>
          <h2>✍️ Manual Consent Entry</h2>
          <p className="manual-entry-description">
            For verbal or paper consents received outside the system
          </p>
        </div>
        <button className="nurse-button secondary" type="button" onClick={onBack}>
          Cancel
        </button>
      </div>

      <p className="manual-entry-warning" role="note">
        ⚠️ Use this form <strong>only</strong> for consents received verbally or on paper.
        All manual entries are logged in the audit trail.
      </p>

      <form className="manual-entry-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Student Information</legend>
          <div className="manual-entry-grid">
            <label>
              Last Name *
              <input name="lastName" value={form.lastName} onChange={updateField} required />
            </label>
            <label>
              First Name *
              <input name="firstName" value={form.firstName} onChange={updateField} required />
            </label>
            <label>
              Date of Birth *
              <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={updateField} required />
            </label>
            <label>
              Class
              <input name="studentClass" value={form.studentClass} onChange={updateField} />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Parent / Guardian</legend>
          <div className="manual-entry-grid">
            <label>
              Parent Full Name *
              <input name="parentFullName" value={form.parentFullName} onChange={updateField} required />
            </label>
            <label>
              Phone Number
              <input name="phoneNumber" type="tel" value={form.phoneNumber} onChange={updateField} />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Consent Decision</legend>
          <div className="manual-entry-grid">
            {[
              ['Meningococcal Consent', 'meningococcalConsent'],
              ['HPV Consent', 'hpvConsent'],
              ['Hepatitis B Consent', 'hepatitisBConsent'],
            ].map(([label, name]) => (
              <label key={name}>
                {label}
                <select name={name} value={form[name]} onChange={updateField} required>
                  <option value="" disabled>Select</option>
                  <option value="Consent">Yes</option>
                  <option value="Decline">No</option>
                </select>
              </label>
            ))}
            <label>
              Consent Method
              <select name="consentMethod" value={form.consentMethod} onChange={updateField}>
                <option>Verbal</option>
                <option>Paper Form</option>
              </select>
            </label>
          </div>
        </fieldset>

        <label className="manual-entry-notes">
          Notes
          <textarea name="notes" rows="4" value={form.notes} onChange={updateField} />
        </label>

        <div className="manual-entry-actions">
          <button className="nurse-button secondary" type="button" onClick={onBack}>
            Cancel
          </button>
          <button className="assess-submit" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Manual Entry'}
          </button>
        </div>
        {error && <p className="error-message" role="alert">{error}</p>}
      </form>
    </section>
  )
}

export default ManualEntry
