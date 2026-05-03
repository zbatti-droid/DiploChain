import { useState } from 'react'
import { getContract } from '../web3'
import axios from 'axios'
import '../App.css'
import { QRCodeSVG } from 'qrcode.react'

function Register() {
  const [form, setForm] = useState({
    studentName: '',
    institution: '',
    diplomaType: '',
  })
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [diplomaCode, setDiplomaCode] = useState(null)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function uploadToPinata(file) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'pinata_api_key': import.meta.env.VITE_PINATA_API_KEY,
          'pinata_secret_api_key': import.meta.env.VITE_PINATA_API_SECRET,
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data.IpfsHash
  }

  async function handleSubmit() {
    if (!form.studentName || !form.institution || !form.diplomaType) {
      setResult({ type: 'error', msg: '❌ Veuillez remplir tous les champs' })
      return
    }

    try {
      setLoading(true)

      // رفع PDF على IPFS
      let ipfsHash = ''
      if (file) {
        ipfsHash = await uploadToPinata(file)
      }

      const { web3, contract, accounts } = await getContract()

      const receipt = await contract.methods
        .registerDiploma(form.studentName, form.institution, form.diplomaType)
        .send({ from: accounts[0], gas: 300000 })

      const diplomaId = web3.utils.soliditySha3(
        { type: 'string', value: form.studentName },
        { type: 'string', value: form.institution },
        { type: 'uint256', value: (await web3.eth.getBlock(receipt.blockNumber)).timestamp }
      )

      setDiplomaCode(diplomaId)
      console.log('Diploma ID:', diplomaId)
      setResult({
        type: 'success',
        msg: `✅ Diplôme enregistré avec succès!${ipfsHash ? `\n📄 PDF sur IPFS: ${ipfsHash}` : ''}`
      })

    } catch (err) {
      setResult({ type: 'error', msg: '❌ Erreur: ' + err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h2>📋 Enregistrer un nouveau diplôme</h2>

      <input
        name="studentName"
        placeholder="Nom de l'étudiant"
        onChange={handleChange}
      />
      <input
        name="institution"
        placeholder="Nom de l'institution"
        onChange={handleChange}
      />
      <select name="diplomaType" onChange={handleChange}>
        <option value="">-- Type de diplôme --</option>
        <option value="Licence">Licence</option>
        <option value="Master">Master</option>
        <option value="Doctorat">Doctorat</option>
      </select>

      <div style={{
        border: '2px dashed #ddd',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        <p style={{ color: '#666', marginBottom: '8px' }}>📄 Ajouter le PDF du diplôme (optionnel)</p>
        <input
          type="file"
          accept=".pdf"
          onChange={e => setFile(e.target.files[0])}
          style={{ width: 'auto' }}
        />
        {file && <p style={{ color: '#185FA5', marginTop: '8px' }}>✅ {file.name}</p>}
      </div>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Enregistrement...' : 'Enregistrer sur la Blockchain'}
      </button>

      {result && (
        <div className={`result ${result.type}`} style={{ whiteSpace: 'pre-line' }}>
          {result.msg}
        </div>
      )}

      {diplomaCode && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#E6F1FB',
          borderRadius: '8px',
          wordBreak: 'break-all'
        }}>
          <p style={{ fontWeight: '500', marginBottom: '8px', color: '#185FA5' }}>
            🔑 Code du diplôme (à conserver):
          </p>
          <p style={{ fontSize: '13px', color: '#0c447c' }}>{diplomaCode}</p>
          <button
            onClick={() => navigator.clipboard.writeText(diplomaCode)}
            style={{ marginTop: '8px', width: 'auto', padding: '6px 16px', fontSize: '13px' }}
          >
            📋 Copier le code
          </button>
     {/* QR Code */}
    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
      <p style={{ fontWeight: '500', color: '#185FA5', marginBottom: '8px' }}>
        📱 QR Code du diplôme:
      </p>
      <QRCodeSVG
        value={diplomaCode}
        size={180}
        bgColor="#ffffff"
        fgColor="#1a1a2e"
        level="H"
      />
    </div>
  </div>
)}
    </div>
  )
}

export default Register