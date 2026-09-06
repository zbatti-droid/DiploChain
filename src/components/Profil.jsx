import { useState } from 'react'

function Profil({ onClose }) {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}')
  const initials = user.nom ? user.nom.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'IN'

  const [nom, setNom] = useState(user.nom || '')
  const [email, setEmail] = useState(user.email || '')
  const [successInfo, setSuccessInfo] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [successPass, setSuccessPass] = useState('')
  const [errorPass, setErrorPass] = useState('')

  const handleSaveInfo = () => {
    if (!nom.trim() || !email.trim()) { setSuccessInfo('❌ Champs obligatoires.'); return }
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const updated = users.map(u => u.email === user.email ? { ...u, nom, email } : u)
    localStorage.setItem('users', JSON.stringify(updated))
    localStorage.setItem('currentUser', JSON.stringify({ ...user, nom, email }))
    setSuccessInfo('✅ Informations mises à jour !')
    setTimeout(() => setSuccessInfo(''), 3000)
  }

  const handleUpdatePassword = () => {
    setErrorPass(''); setSuccessPass('')
    if (!currentPassword) { setErrorPass('❌ Entrez le mot de passe actuel.'); return }
    if (currentPassword !== user.password) { setErrorPass('❌ Mot de passe actuel incorrect.'); return }
    if (newPassword.length < 6) { setErrorPass('❌ Nouveau mot de passe trop court (min 6).'); return }
    if (newPassword !== confirmPassword) { setErrorPass('❌ Les mots de passe ne correspondent pas.'); return }
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const updated = users.map(u => u.email === user.email ? { ...u, password: newPassword } : u)
    localStorage.setItem('users', JSON.stringify(updated))
    localStorage.setItem('currentUser', JSON.stringify({ ...user, password: newPassword }))
    setSuccessPass('✅ Mot de passe mis à jour !')
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
    setTimeout(() => setSuccessPass(''), 3000)
  }

  const handleLogout = () => {
    localStorage.removeItem('role')
    localStorage.removeItem('currentUser')
    window.location.href = '/'
  }

  const s = {
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
    modal: { background: '#f0f4f8', borderRadius: '20px', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
    title: { fontSize: '24px', fontWeight: '700', color: '#1a1a2e' },
    closeBtn: { background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#888', width: 'auto', padding: '4px 10px' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
    card: { background: 'white', borderRadius: '16px', padding: '1.8rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
    cardTitle: { fontSize: '18px', fontWeight: '700', color: '#1a1a2e', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '6px' },
    input: { width: '100%', padding: '12px 16px', border: '1.5px solid #e8ecf0', borderRadius: '10px', fontSize: '15px', outline: 'none', marginBottom: '1rem', background: '#fafbfc', color: '#1a1a2e' },
    inputRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
    pwdWrap: { position: 'relative', marginBottom: '1rem' },
    pwdInput: { width: '100%', padding: '12px 44px 12px 16px', border: '1.5px solid #e8ecf0', borderRadius: '10px', fontSize: '15px', outline: 'none', background: '#fafbfc', color: '#1a1a2e' },
    eyeBtn: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#888', width: 'auto', padding: '0' },
    saveBtn: { background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', width: 'auto', float: 'right' },
    updateBtn: { background: '#9CA3AF', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', width: 'auto', float: 'right' },
    successMsg: { color: '#2d6a0a', background: '#f0fae8', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', marginBottom: '1rem' },
    errorMsg: { color: '#8b1a1a', background: '#fef0f0', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', marginBottom: '1rem' },
    actionCard: { background: 'white', borderRadius: '16px', padding: '1.2rem 1.8rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    actionLabel: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', fontWeight: '600', color: '#1a1a2e' },
    actionBtn: { background: '#f3f4f6', color: '#1a1a2e', border: 'none', padding: '8px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', width: 'auto' },
  }

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>

        {/* HEADER */}
        <div style={s.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '18px' }}>
              {initials}
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a2e' }}>{user.nom}</div>
              <div style={{ fontSize: '13px', color: '#888' }}>{user.email}</div>
            </div>
          </div>
          <div style={s.title}>Mon Profil</div>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* ROW 1: Info + Sécurité */}
        <div style={s.grid}>

          {/* INFORMATIONS PERSONNELLES */}
          <div style={s.card}>
            <div style={s.cardTitle}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                {initials}
              </div>
              Informations Personnelles
            </div>
            {successInfo && <div style={s.successMsg}>{successInfo}</div>}
            <label style={s.label}>Nom complet</label>
            <input style={s.input} value={nom} onChange={e => setNom(e.target.value)} placeholder="Nom complet" />
            <label style={s.label}>Adresse Email</label>
            <input style={s.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" />
            {user.org && <>
              <label style={s.label}>Institution</label>
              <input style={s.input} value={user.org} readOnly />
            </>}
            <div style={{ overflow: 'hidden' }}>
              <button style={s.saveBtn} onClick={handleSaveInfo}>💾 Enregistrer</button>
            </div>
          </div>

          {/* SÉCURITÉ */}
          <div style={s.card}>
            <div style={s.cardTitle}>
              <span style={{ fontSize: '22px' }}>🔒</span>
              Sécurité
            </div>
            {errorPass && <div style={s.errorMsg}>{errorPass}</div>}
            {successPass && <div style={s.successMsg}>{successPass}</div>}
            <label style={s.label}>Mot de passe actuel</label>
            <div style={s.pwdWrap}>
              <input style={s.pwdInput} type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" />
              <button style={s.eyeBtn} onClick={() => setShowCurrent(!showCurrent)}>{showCurrent ? '🙈' : '👁️'}</button>
            </div>
            <div style={s.inputRow}>
              <div>
                <label style={s.label}>Nouveau mot de passe</label>
                <div style={{ position: 'relative' }}>
                  <input style={{ ...s.pwdInput, marginBottom: 0 }} type={showNew ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" />
                  <button style={s.eyeBtn} onClick={() => setShowNew(!showNew)}>{showNew ? '🙈' : '👁️'}</button>
                </div>
              </div>
              <div>
                <label style={s.label}>Confirmer</label>
                <div style={{ position: 'relative' }}>
                  <input style={{ ...s.pwdInput, marginBottom: 0 }} type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                  <button style={s.eyeBtn} onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? '🙈' : '👁️'}</button>
                </div>
              </div>
            </div>
            <div style={{ overflow: 'hidden', marginTop: '1rem' }}>
              <button style={s.updateBtn} onClick={handleUpdatePassword}>💾 Mettre à jour</button>
            </div>
          </div>
        </div>

        {/* ROW 2: Support + Déconnexion */}
        <div style={s.grid}>
          <div style={s.actionCard}>
            <div style={s.actionLabel}>
              <span style={{ fontSize: '22px' }}>🛟</span>
              Support & Assistance
            </div>
            <button style={s.actionBtn} onClick={() => window.open('mailto:support@diplochain.com')}>
              Contacter
            </button>
          </div>
          <div style={s.actionCard}>
            <div style={s.actionLabel}>
              <span style={{ fontSize: '22px' }}>🚪</span>
              Déconnexion
            </div>
            <button style={{ ...s.actionBtn, color: '#e74c3c' }} onClick={handleLogout}>
              Quitter
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Profil