import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [role, setRole] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const credentials = {
    institution: '1234',
    employeur: '5678',
    etudiant: '0000'
  }

  function handleLogin() {
    if (!role) {
      setError('❌ Veuillez choisir un rôle')
      return
    }
    if (password !== credentials[role]) {
      setError('❌ Mot de passe incorrect')
      return
    }
    localStorage.setItem('role', role)
    if (role === 'institution') navigate('/register')
    if (role === 'employeur') navigate('/verify')
    if (role === 'etudiant') navigate('/student')
  }

  return (
    <div className="login-container">
      <div className="login-logo">🎓</div>
      <h2 className="login-title" style={{justifyContent:'center'}}>
        Système de Vérification
      </h2>
      <p className="login-subtitle">
        Plateforme Blockchain de gestion des diplômes
      </p>

      <select onChange={e => setRole(e.target.value)}>
        <option value="">-- Choisir un rôle --</option>
        <option value="institution">🏛️ Institution</option>
        <option value="employeur">🔍 Employeur</option>
        <option value="etudiant">🎓 Étudiant</option>
      </select>

      <input
        type="password"
        placeholder="Mot de passe"
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        🔐 Se connecter
      </button>

      {error && <div className="result error">{error}</div>}

      <div className="roles-hint">
        <p>🏛️ Institution: <strong>1234</strong></p>
        <p>🔍 Employeur: <strong>5678</strong></p>
        <p>🎓 Étudiant: <strong>0000</strong></p>
      </div>
    </div>
  )
}

export default Login