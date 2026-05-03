import { useState } from 'react'
import { getContract } from '../web3'
import '../App.css'

function Verify() {
  const [hash, setHash] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleVerify() {
    if (!hash) {
      setResult({ type: 'error', msg: '❌ Veuillez entrer le code du diplôme' })
      return
    }

    try {
      setLoading(true)
      const { web3, contract } = await getContract()

      // تحويل الـ hash لـ bytes32
      let diplomaId = hash
      if (!hash.startsWith('0x') || hash.length !== 66) {
        diplomaId = web3.utils.keccak256(hash)
      }

      const data = await contract.methods.verifyDiploma(diplomaId).call()

      if (data.isValid && data.studentName !== '') {
        setResult({
          type: 'success',
          msg: `✅ Diplôme valide!\nÉtudiant: ${data.studentName}\nInstitution: ${data.institution}\nType: ${data.diplomaType}`
        })
      } else {
        setResult({ type: 'error', msg: '❌ Diplôme invalide ou introuvable' })
      }
    } catch (err) {
      setResult({ type: 'error', msg: '❌ Erreur: ' + err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h2>🔍 Vérifier un diplôme</h2>

      <input
        placeholder="Entrez le code du diplôme (Hash)"
        onChange={e => setHash(e.target.value)}
      />

      <button onClick={handleVerify} disabled={loading}>
        {loading ? 'Vérification...' : 'Vérifier maintenant'}
      </button>

      {result && (
        <div className={`result ${result.type}`} style={{whiteSpace: 'pre-line'}}>
          {result.msg}
        </div>
      )}
    </div>
  )
}

export default Verify