import { useState, useEffect } from 'react'

export default function AdminPanel({ darkMode, d, t }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [reportLoading, setReportLoading] = useState(false)
  const [syncLoading, setSyncLoading] = useState(false)
  const [syncResult, setSyncResult] = useState(null)
  const [msg, setMsg] = useState(null)

  useEffect(() => { loadUsers() }, [])

  async function loadUsers() {
    try {
      setLoading(true)
      const res = await fetch('http://localhost:5000/api/users')
      const data = await res.json()
      if (data.success) setUsers(data.users)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  async function loadReport() {
    try {
      setReportLoading(true)
      const res = await fetch('http://localhost:5000/api/report')
      const data = await res.json()
      if (data.success) setReport(data.report)
    } catch (err) { console.error(err) }
    finally { setReportLoading(false) }
  }

  async function handleSync() {
    try {
      setSyncLoading(true); setSyncResult(null)
      const diplomas = JSON.parse(localStorage.getItem('diplomas') || '[]')
      if (diplomas.length === 0) { setSyncResult({ type: 'error', msg: 'Aucun diplôme dans localStorage' }); return }

      const formatted = diplomas.map(d => ({
        studentName: d.studentName,
        institution: d.institution,
        diplomaType: d.diplomaType,
        issueDate: d.issueDate,
        blockchainHash: d.id,
        ipfsHash: d.ipfsHash || null
      }))

      const res = await fetch('http://localhost:5000/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diplomas: formatted })
      })
      const data = await res.json()
      if (data.success) {
        setSyncResult({ type: 'success', msg: `✅ ${data.synced} synchronisés, ${data.skipped} ignorés` })
      }
    } catch (err) { setSyncResult({ type: 'error', msg: '❌ ' + err.message }) }
    finally { setSyncLoading(false) }
  }

  function handlePrintReport() {
    if (!report) return
    const win = window.open('', '_blank')
    win.document.write(`
      <html><head><title>Rapport DiploChain</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; color: #0f172a; }
        h1 { color: #1d4ed8; border-bottom: 2px solid #1d4ed8; padding-bottom: 10px; }
        .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 20px 0; }
        .stat { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 14px; text-align: center; }
        .stat-num { font-size: 28px; font-weight: 800; color: #1d4ed8; }
        .stat-label { font-size: 12px; color: #64748b; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #1d4ed8; color: white; padding: 10px; text-align: left; font-size: 12px; }
        td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
        tr:nth-child(even) { background: #f8fafc; }
        .valid { color: #059669; font-weight: 700; }
        .footer { margin-top: 30px; text-align: center; color: #94a3b8; font-size: 11px; }
      </style></head><body>
      <h1>📊 Rapport DiploChain</h1>
      <p style="color:#64748b">Généré le: ${report.generatedAt}</p>
      <div class="stats">
        <div class="stat"><div class="stat-num">${report.stats.total}</div><div class="stat-label">Total diplômes</div></div>
        <div class="stat"><div class="stat-num">${report.stats.issued}</div><div class="stat-label">Émis</div></div>
        <div class="stat"><div class="stat-num">${report.stats.with_pdf}</div><div class="stat-label">Avec PDF</div></div>
        <div class="stat"><div class="stat-num">${report.stats.this_month}</div><div class="stat-label">Ce mois</div></div>
      </div>
      <table>
        <tr><th>Étudiant</th><th>Institution</th><th>Type</th><th>Date</th><th>Statut</th></tr>
        ${report.diplomas.map(d => `
          <tr>
            <td>${d.student_name}</td>
            <td>${d.institution_name}</td>
            <td>${d.diploma_title}</td>
            <td>${new Date(d.graduation_date).toLocaleDateString('fr-FR')}</td>
            <td class="valid">✓ Valide</td>
          </tr>
        `).join('')}
      </table>
      <div class="footer">© 2025 DiploChain · Plateforme Blockchain de gestion des diplômes</div>
      </body></html>
    `)
    win.document.close()
    win.print()
  }

  async function handleDeleteUser(id) {
    if (!window.confirm('Supprimer cet utilisateur ?')) return
    try {
      await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' })
      setMsg({ type: 'success', text: '✅ Utilisateur supprimé' })
      loadUsers()
    } catch (err) { setMsg({ type: 'error', text: '❌ ' + err.message }) }
  }

  return (
    <div className="fade-up">
      {msg && (
        <div style={{ padding: '11px 16px', borderRadius: 10, marginBottom: '1rem', background: msg.type === 'success' ? '#f0fdf4' : '#fef2f2', color: msg.type === 'success' ? '#15803d' : '#dc2626', borderLeft: `3px solid ${msg.type === 'success' ? '#059669' : '#dc2626'}`, fontSize: 13, fontWeight: 600 }}>
          {msg.text}
        </div>
      )}

      {/* مزامنة Ganache */}
      <div className="card card-accent" style={{ marginBottom: '1.2rem', padding: '1.4rem' }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: d.text, marginBottom: 8 }}>🔄 Synchronisation Ganache → PostgreSQL</div>
        <div style={{ fontSize: 13, color: d.muted, marginBottom: '1rem' }}>Importer les diplômes du localStorage vers la base de données PostgreSQL</div>
        {syncResult && (
          <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: '1rem', background: syncResult.type === 'success' ? '#f0fdf4' : '#fef2f2', color: syncResult.type === 'success' ? '#15803d' : '#dc2626', fontSize: 13 }}>
            {syncResult.msg}
          </div>
        )}
        <button onClick={handleSync} disabled={syncLoading} className="blue-btn" style={{ fontSize: 13, padding: '10px' }}>
          {syncLoading ? '⏳ Synchronisation...' : '🔄 Synchroniser maintenant'}
        </button>
      </div>

      {/* تقرير PDF */}
      <div className="card card-accent" style={{ marginBottom: '1.2rem', padding: '1.4rem' }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: d.text, marginBottom: 8 }}>📊 Rapport complet</div>
        <div style={{ fontSize: 13, color: d.muted, marginBottom: '1rem' }}>Générer et imprimer un rapport PDF de tous les diplômes</div>
        {report && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: '1rem' }}>
            {[
              { label: 'Total', val: report.stats.total, color: '#1d4ed8' },
              { label: 'Émis', val: report.stats.issued, color: '#059669' },
              { label: 'Avec PDF', val: report.stats.with_pdf, color: '#7c3aed' },
              { label: 'Ce mois', val: report.stats.this_month, color: '#f59e0b' },
            ].map((s, i) => (
              <div key={i} style={{ background: d.bg, border: `1px solid ${d.border}`, borderRadius: 10, padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 11, color: d.muted }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={loadReport} disabled={reportLoading} className="blue-btn" style={{ fontSize: 13, padding: '10px' }}>
            {reportLoading ? '⏳...' : '📊 Charger le rapport'}
          </button>
          {report && (
            <button onClick={handlePrintReport} style={{ padding: '10px 16px', border: '1px solid #059669', borderRadius: 10, background: '#f0fdf4', color: '#059669', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              🖨️ Imprimer PDF
            </button>
          )}
        </div>
      </div>

      {/* إدارة المستخدمين */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.4rem', borderBottom: `1px solid ${d.borderL}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: d.text }}>⚙️ Gestion des utilisateurs ({users.length})</span>
          <button onClick={loadUsers} style={{ background: d.bg, border: `1px solid ${d.border}`, borderRadius: 8, padding: '5px 12px', fontSize: 12, cursor: 'pointer', color: d.muted, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            🔄 Actualiser
          </button>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: d.mutedL }}>⏳ Chargement...</div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: d.mutedL }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
            <div>Aucun utilisateur enregistré</div>
          </div>
        ) : users.map((user, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 1.4rem', borderBottom: `1px solid ${d.borderL}`, gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: user.role === 'admin' ? '#eff6ff' : user.role === 'student' ? '#f0fdf4' : '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                {user.role === 'admin' ? '⚙️' : user.role === 'student' ? '🎓' : '🏛️'}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: d.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.full_name}</div>
                <div style={{ fontSize: 11, color: d.muted }}>{user.email} · {user.role}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <span style={{ background: user.is_verified ? '#dcfce7' : '#fef3c7', color: user.is_verified ? '#15803d' : '#92400e', borderRadius: 100, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
                {user.is_verified ? '✓ Vérifié' : '⏳ En attente'}
              </span>
              <button onClick={() => handleDeleteUser(user.id)} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 7, padding: '4px 10px', fontSize: 11, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}