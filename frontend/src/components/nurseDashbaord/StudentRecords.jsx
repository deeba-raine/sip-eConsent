function formatVaccines(vaccines) {
  if (typeof vaccines === 'string') return vaccines || '—'

  return vaccines?.length
    ? vaccines
      .filter((item) => item.consent !== 'No')
      .map((item) => item.vaccine)
      .join(' · ')
    : '—'
}

function StudentRecords({ students, onSelect, onAssess }) {
  return (
    <section className="nurse-card">
      <div className="nurse-card-header">
        <div>
          <p className="nurse-label">PARENT SUBMISSIONS</p>
          <h2>Consent records</h2>
        </div>
        <span className="record-count">
          {students.length} record{students.length === 1 ? '' : 's'}
        </span>
      </div>

      {students.length === 0 ? (
        <p className="empty-records">No consent forms have been submitted yet.</p>
      ) : (
        <div className="record-table-wrap">
          <table className="record-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Class</th>
                <th>Consent Status</th>
                <th>Vaccines Consented</th>
                <th>Assessment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="record-name">
                    {student.last_name}, {student.first_name}
                  </td>
                  <td>{student.student_class || '—'}</td>
                  <td><span className="record-status">Submitted</span></td>
                  <td>{formatVaccines(student.vaccine_consent)}</td>
                  <td>
                    <span className={`assessment-status${student.assessment_status ? ' completed' : ''}`}>
                      {student.assessment_status ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                  <td className="record-actions">
                    <button className="view-record" onClick={() => onSelect(student)}>
                      View
                    </button>
                    <button
                      className="assess-record"
                      type="button"
                      onClick={() => onAssess(student)}
                    >
                      Assess
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default StudentRecords
