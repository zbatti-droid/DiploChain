import { useState } from 'react'
import { getContract } from '../web3'
import '../App.css'

function Student() {
  const [code, setCode] = useState('')
  const [diploma, setDiploma] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSearch() {
    if (!code) {
      setError('❌ Veuillez entrer votre code')
      return
    }
    try {
      setLoading(true)
      const { contract } = await getContract()
      const data = await contract.methods.verifyDiploma(code).call()

      if (data.isValid && data.studentName !== '') {
        setDiploma(data)
        setError('')
      } else {
        setError('❌ Diplôme introuvable')
        setDiploma(null)
      }
    } catch (err) {
      setError('❌ Erreur: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h2>🎓 Mon Diplôme</h2>

      <input
        placeholder="Entrez votre code de diplôme"
        onChange={e => setCode(e.target.value)}
      />

      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Recherche...' : 'Afficher mon diplôme'}
      </button>

      {error && <div className="result error">{error}</div>}

      {diploma && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          background: '#EAF3DE',
          borderRadius: '8px',
          borderLeft: '4px solid #3B6D11'
        }}>
          <h3 style={{ color: '#3B6D11', marginBottom: '1rem' }}>
            ✅ Diplôme Authentique
          </h3>
          <p><strong>Étudiant:</strong> {diploma.studentName}</p>
          <p><strong>Institution:</strong> {diploma.institution}</p>
          <p><strong>Type:</strong> {diploma.diplomaType}</p>
        </div>
      )}
    </div>
  )
}

export default Student