import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.message || 'Invalid email or password')
        return
      }

      navigate('/nurse-dashboard')
    } catch (submitError) {
      console.error('Login request failed:', submitError)
      setError('Unable to connect to the server. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h1>Nurse Portal</h1>

      <label className="email">
        Email
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>

      <label className="password">
        Password
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </button>

      {error && <p id="message" role="alert">{error}</p>}
    </form>
  )
}

export default Login