import { useState } from 'react'

function Login() {
  const [role, setRole] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // كلمات المرور الحقيقية (أنت فقط)
  const credentials = {
    admin: '1234',
    employeur: '5678',
    etudiant: '0000'
  }

  // كلمة مرور العرض (للجميع)
  const DEMO_PASSWORD = 'demo'

  function handleLogin() {
    if (!role) { setError('❌ Veuillez choisir un rôle'); return }
    if (!password) { setError('❌ Veuillez entrer le mot de passe'); return }

    const isOwner = password === credentials[role]
    const isDemo  = password === DEMO_PASSWORD

    if (!isOwner && !isDemo) { setError('❌ Mot de passe incorrect'); return }

    // حفظ نوع الدخول
    localStorage.setItem('role', role)
    localStorage.setItem('isDemo', isDemo ? 'true' : 'false')
    localStorage.setItem('currentUser', JSON.stringify({ role, isDemo }))

    if (role === 'admin')     window.location.href = '/register'
    if (role === 'employeur') window.location.href = '/verify'
    if (role === 'etudiant')  window.location.href = '/student'
  }

  return (
    <div className="login-container">
      <div className="login-logo">🎓</div>
      <h2 className="login-title" style={{ justifyContent: 'center' }}>
        Système de Vérification
      </h2>
      <p className="login-subtitle">Plateforme Blockchain de gestion des diplômes</p>

      {error && <div className="result error">{error}</div>}

      <select onChange={e => { setRole(e.target.value); setError('') }} value={role}>
        <option value="">-- Choisir un rôle --</option>
        <option value="admin">⚙️ Admin</option>
        <option value="employeur">🔍 Employeur</option>
        <option value="etudiant">🎓 Étudiant</option>
      </select>

      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={e => { setPassword(e.target.value); setError('') }}
      />

      <button onClick={handleLogin}>🔐 Se connecter</button>

      {/* تلميح للزوار */}
      <div style={{
        marginTop: '1rem', padding: '10px 14px',
        background: 'rgba(59,130,246,0.15)',
        border: '1px solid rgba(59,130,246,0.3)',
        borderRadius: '10px', fontSize: '12px',
        color: 'rgba(255,255,255,0.7)', textAlign: 'center'
      }}>
        👁️ Mode démonstration — mot de passe: <strong style={{ color: '#60a5fa' }}>demo</strong>
      </div>
    </div>
  )
}

export default Login