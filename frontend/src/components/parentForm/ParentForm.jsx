import { useState } from 'react'
import axios from 'axios'
import './parent-form.css'

const initialForm = {
  firstName: '',
  lastName: '',
  studentId: '',
  dateOfBirth: '',
  grade: '',
  school: '',

  meningococcalHistory: '',
  hpvHistory: '',
  hepatitisBHistory: '',

  allergies: '',
  vaccineReaction: '',
  medicalCondition: '',
  healthNotes: '',

  meningococcalConsent: '',
  hpvConsent: '',
  hepatitisBConsent: '',

  relationship: 'Parent',
  parentFirstName: '',
  parentLastName: '',
  email: '',
  phone: '',
  signature: '',
  confirmed: false,
}

function ParentForm() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function updateField(event) {
    const { name, value, type, checked } = event.target

    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(false)
    setSubmitError('')

    try {
      const response = await axios.post(
        'http://localhost:3000/api/consents',
        form
      )

      console.log(response.data)

      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting consent:', error)
      setSubmitError(
        error.response?.data?.message ||
          'The form could not be submitted. Please check that the backend is running.'
      )
    }
  }

  return (
    <main className="parent-form-page">
      <form className="parent-form" onSubmit={handleSubmit}>
        <h1>Parent Consent Form</h1>

        <p className="form-intro">
          School Immunization Consent Program
        </p>

        {/* STUDENT INFORMATION */}

        <fieldset>
          <legend>1. Student Information</legend>

          <div className="form-grid">
            <label>
              First Name
              <input
                name="firstName"
                value={form.firstName}
                onChange={updateField}
                required
              />
            </label>

            <label>
              Last Name
              <input
                name="lastName"
                value={form.lastName}
                onChange={updateField}
                required
              />
            </label>

            <label>
              Student ID
              <input
                name="studentId"
                value={form.studentId}
                onChange={updateField}
                required
              />
            </label>

            <label>
              Date of Birth
              <input
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={updateField}
                required
              />
            </label>

            <label>
              Grade
              <select
                name="grade"
                value={form.grade}
                onChange={updateField}
              >
                <option value="">Select Grade</option>

                {[...Array(12)].map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </label>

            <label>
              School
              <input
                name="school"
                value={form.school}
                onChange={updateField}
              />
            </label>
          </div>
        </fieldset>

        {/* VACCINATION HISTORY */}

        <fieldset>
          <legend>2. Vaccination History</legend>

          <p>
            Has the student previously received the following vaccines?
          </p>

          <div className="choice-row">
            <span>Meningococcal Vaccine:</span>

            <label>
              <input
                type="radio"
                name="meningococcalHistory"
                value="Yes"
                onChange={updateField}
              />
              Yes
            </label>

            <label>
              <input
                type="radio"
                name="meningococcalHistory"
                value="No"
                onChange={updateField}
              />
              No
            </label>
          </div>

          <div className="choice-row">
            <span>HPV Vaccine:</span>

            <label>
              <input
                type="radio"
                name="hpvHistory"
                value="Yes"
                onChange={updateField}
              />
              Yes
            </label>

            <label>
              <input
                type="radio"
                name="hpvHistory"
                value="No"
                onChange={updateField}
              />
              No
            </label>
          </div>

          <div className="choice-row">
            <span>Hepatitis B Vaccine:</span>

            <label>
              <input
                type="radio"
                name="hepatitisBHistory"
                value="Yes"
                onChange={updateField}
              />
              Yes
            </label>

            <label>
              <input
                type="radio"
                name="hepatitisBHistory"
                value="No"
                onChange={updateField}
              />
              No
            </label>
          </div>
        </fieldset>

        {/* HEALTH HISTORY */}

        <fieldset>
          <legend>3. Health History</legend>

          <div className="question">
            <span>
              Does the student have any allergies?
            </span>

            <label>
              <input
                type="radio"
                name="allergies"
                value="Yes"
                onChange={updateField}
              />
              Yes
            </label>

            <label>
              <input
                type="radio"
                name="allergies"
                value="No"
                onChange={updateField}
              />
              No
            </label>
          </div>

          <div className="question">
            <span>
              Has the student ever had a reaction to a vaccine?
            </span>

            <label>
              <input
                type="radio"
                name="vaccineReaction"
                value="Yes"
                onChange={updateField}
              />
              Yes
            </label>

            <label>
              <input
                type="radio"
                name="vaccineReaction"
                value="No"
                onChange={updateField}
              />
              No
            </label>
          </div>

          <div className="question">
            <span>
              Does the student have any medical condition
              that the nurse should know about?
            </span>

            <label>
              <input
                type="radio"
                name="medicalCondition"
                value="Yes"
                onChange={updateField}
              />
              Yes
            </label>

            <label>
              <input
                type="radio"
                name="medicalCondition"
                value="No"
                onChange={updateField}
              />
              No
            </label>
          </div>

          <label>
            Additional Information

            <textarea
              name="healthNotes"
              value={form.healthNotes}
              onChange={updateField}
              rows="4"
              placeholder="Provide any additional health information..."
            />
          </label>
        </fieldset>

        {/* VACCINATION CONSENT */}

        <fieldset>
          <legend>4. Vaccination Consent</legend>

          <p>
            Please indicate whether you consent to each vaccine.
          </p>

          <div className="choice-row">
            <span>Meningococcal Vaccine:</span>

            <label>
              <input
                type="radio"
                name="meningococcalConsent"
                value="Consent"
                onChange={updateField}
              />
              Consent
            </label>

            <label>
              <input
                type="radio"
                name="meningococcalConsent"
                value="Decline"
                onChange={updateField}
              />
              Decline
            </label>
          </div>

          <div className="choice-row">
            <span>HPV Vaccine:</span>

            <label>
              <input
                type="radio"
                name="hpvConsent"
                value="Consent"
                onChange={updateField}
              />
              Consent
            </label>

            <label>
              <input
                type="radio"
                name="hpvConsent"
                value="Decline"
                onChange={updateField}
              />
              Decline
            </label>
          </div>

          <div className="choice-row">
            <span>Hepatitis B Vaccine:</span>

            <label>
              <input
                type="radio"
                name="hepatitisBConsent"
                value="Consent"
                onChange={updateField}
              />
              Consent
            </label>

            <label>
              <input
                type="radio"
                name="hepatitisBConsent"
                value="Decline"
                onChange={updateField}
              />
              Decline
            </label>
          </div>
        </fieldset>

        {/* PARENT INFORMATION */}

        <fieldset>
          <legend>5. Parent / Guardian Information</legend>

          <div className="form-grid">
            <label>
              Relationship

              <select
                name="relationship"
                value={form.relationship}
                onChange={updateField}
              >
                <option value="Parent">Parent</option>
                <option value="Guardian">Guardian</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label>
              First Name

              <input
                name="parentFirstName"
                value={form.parentFirstName}
                onChange={updateField}
              />
            </label>

            <label>
              Last Name

              <input
                name="parentLastName"
                value={form.parentLastName}
                onChange={updateField}
              />
            </label>

            <label>
              Email

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
              />
            </label>

            <label>
              Phone

              <input
                name="phone"
                value={form.phone}
                onChange={updateField}
              />
            </label>

            <label>
              Signature

              <input
                name="signature"
                value={form.signature}
                onChange={updateField}
              />
            </label>
          </div>
        </fieldset>

        {/* CONFIRMATION */}

        <label className="confirm">
          <input
            name="confirmed"
            type="checkbox"
            checked={form.confirmed}
            onChange={updateField}
          />

          I confirm that the information provided is accurate.
        </label>

        <button
          className="submit-button"
          type="submit"
        >
          Submit Consent
        </button>

        {submitted && (
          <p
            className="success-message"
            role="status"
          >
            Consent submitted successfully.
          </p>
        )}

        {submitError && (
          <p className="error-message" role="alert">
            {submitError}
          </p>
        )}
      </form>
    </main>
  )
}

export default ParentForm