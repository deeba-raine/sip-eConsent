import NurseDashboard from './components/nurseDashbaord/NurseDashbaord'
import Login from './components/login/Login'
import ParentForm from './components/parentForm/ParentForm'
import { Navigate, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/nurse-dashboard" element={<NurseDashboard />} />
      <Route path="/nurse-dashboard/manual-entry" element={<NurseDashboard />} />
      <Route path="/parent-form" element={<ParentForm />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App