import { useState, useEffect } from 'react'
import { getContract } from '../web3'
import axios from 'axios'
import { QRCodeSVG } from 'qrcode.react'
import Profil from './Profil'

const FILIERES = ['Informatique', 'Mathématiques', 'Physique', 'Chimie', 'Biologie', 'Économie', 'Droit', 'Médecine', 'Ingénierie', 'Lettres', 'Histoire', 'Géographie', 'Autre']

const LANGS = {
  fr: {
    dashboard: 'Dashboard', enregistrer: 'Enregistrer', verification: 'Vérification', historique: 'Historique', admin: '⚙️ Admin',
    profil: 'Mon Profil', logout: 'Déconnexion', newDiploma: '+ Nouveau diplôme',
    dashDesc: "Vue d'ensemble de votre activité", regDesc: 'Enregistrez un nouveau diplôme sur la blockchain',
    verDesc: "Vérifiez l'authenticité d'un diplôme", histDesc: 'Tous les diplômes enregistrés', adminDesc: 'Gestion du système et synchronisation',
    total: 'Total diplômes', month: 'Ce mois', withPDF: 'Avec PDF (IPFS)', onChain: 'Sur blockchain',
    student: "Nom de l'étudiant", institution: "Nom de l'institution", diplomaName: 'Nom du diplôme',
    diplomaType: 'Type de diplôme', filiere: 'Filière / Spécialité', issueDate: "Date d'émission",
    selectType: '— Sélectionnez —', selectFiliere: '— Sélectionnez la filière —',
    pdfLabel: 'PDF du diplôme', pdfOptional: 'optionnel · stocké sur IPFS',
    registerBtn: '🔗 Enregistrer sur la Blockchain', registering: '⏳ Enregistrement en cours...',
    verifyLabel: 'Code du diplôme (Hash)', verifyBtn: '🔍 Vérifier sur la Blockchain', verifying: '⏳ Vérification...',
    enterCode: '❌ Veuillez entrer un code.', fillFields: '❌ Veuillez remplir tous les champs',
    authentic: 'Diplôme Authentique', notFound: '❌ Diplôme introuvable ou invalide.',
    hashCode: 'Code du diplôme (Hash blockchain)', copy: '📋 Copier', qrLabel: 'QR Code — Scannez pour vérifier',
    recentActivity: '🕐 Activité récente', seeAll: 'Tout voir →', noActivity: 'Aucune activité pour le moment',
    listDiplomas: 'Liste des diplômes', noDiplomas: 'Aucun diplôme enregistré', bonjour: 'Bonjour',
    savedDB: '🗄️ Sauvegardé dans la base de données', diplomasCount: 'Diplômes enregistrés',
    etudiant: 'Étudiant', type: 'Type', date: 'Date',
    preview: '👁️ Aperçu avant enregistrement', previewTitle: 'Récapitulatif du diplôme',
    previewDesc: 'Vérifiez les informations avant de les enregistrer sur la blockchain',
    confirm: '✅ Confirmer et enregistrer', cancel: '✕ Annuler',
    printBtn: '🖨️ Imprimer / Exporter PDF', byFiliere: 'Par filière', weekCount: 'Cette semaine',
    syncTitle: 'Synchronisation Ganache → PostgreSQL', syncDesc: 'Importer les diplômes du localStorage vers PostgreSQL',
    syncBtn: '🔄 Synchroniser maintenant', syncing: '⏳ Synchronisation...',
    reportTitle: 'Rapport complet', reportDesc: 'Générer et imprimer un rapport PDF de tous les diplômes',
    loadReport: '📊 Charger le rapport', printReport: '🖨️ Imprimer PDF',
    usersTitle: 'Gestion des utilisateurs', refresh: '🔄 Actualiser',
    noUsers: 'Aucun utilisateur enregistré', verified: '✓ Vérifié', pending: '⏳ En attente',
    cne: 'CNE', email: 'Email étudiant (optionnel)',
  },
  ar: {
    dashboard: 'لوحة التحكم', enregistrer: 'تسجيل', verification: 'التحقق', historique: 'السجل', admin: '⚙️ الإدارة',
    profil: 'ملفي', logout: 'خروج', newDiploma: '+ شهادة جديدة',
    dashDesc: 'نظرة عامة على نشاطك', regDesc: 'سجّل شهادة جديدة على البلوكتشين',
    verDesc: 'تحقق من صحة شهادة', histDesc: 'جميع الشهادات المسجلة', adminDesc: 'إدارة النظام والمزامنة',
    total: 'إجمالي الشهادات', month: 'هذا الشهر', withPDF: 'مع PDF', onChain: 'على البلوكتشين',
    student: 'اسم الطالب', institution: 'اسم المؤسسة', diplomaName: 'اسم الشهادة',
    diplomaType: 'نوع الشهادة', filiere: 'التخصص', issueDate: 'تاريخ الإصدار',
    selectType: '— اختر —', selectFiliere: '— اختر التخصص —',
    pdfLabel: 'ملف PDF', pdfOptional: 'اختياري · على IPFS',
    registerBtn: '🔗 تسجيل على البلوكتشين', registering: '⏳ جارٍ التسجيل...',
    verifyLabel: 'كود الشهادة', verifyBtn: '🔍 التحقق', verifying: '⏳ جارٍ التحقق...',
    enterCode: '❌ أدخل الكود.', fillFields: '❌ أكمل جميع الحقول',
    authentic: 'شهادة أصيلة', notFound: '❌ غير موجودة.',
    hashCode: 'كود الشهادة', copy: '📋 نسخ', qrLabel: 'QR Code',
    recentActivity: '🕐 النشاط الأخير', seeAll: 'عرض الكل ←', noActivity: 'لا يوجد نشاط',
    listDiplomas: 'قائمة الشهادات', noDiplomas: 'لا توجد شهادات', bonjour: 'مرحباً',
    savedDB: '🗄️ تم الحفظ', diplomasCount: 'الشهادات',
    etudiant: 'الطالب', type: 'النوع', date: 'التاريخ',
    preview: '👁️ معاينة قبل التسجيل', previewTitle: 'ملخص الشهادة',
    previewDesc: 'تحقق من المعلومات قبل إرسالها للبلوكتشين',
    confirm: '✅ تأكيد والتسجيل', cancel: '✕ إلغاء',
    printBtn: '🖨️ طباعة / تصدير PDF', byFiliere: 'حسب التخصص', weekCount: 'هذا الأسبوع',
    syncTitle: 'مزامنة Ganache → PostgreSQL', syncDesc: 'استيراد الشهادات من localStorage إلى PostgreSQL',
    syncBtn: '🔄 مزامنة الآن', syncing: '⏳ جارٍ المزامنة...',
    reportTitle: 'تقرير كامل', reportDesc: 'توليد وطباعة تقرير PDF لجميع الشهادات',
    loadReport: '📊 تحميل التقرير', printReport: '🖨️ طباعة PDF',
    usersTitle: 'إدارة المستخدمين', refresh: '🔄 تحديث',
    noUsers: 'لا يوجد مستخدمون', verified: '✓ موثق', pending: '⏳ انتظار',
    cne: 'الرقم الوطني CNE', email: 'بريد الطالب (اختياري)',
  },
  en: {
    dashboard: 'Dashboard', enregistrer: 'Register', verification: 'Verification', historique: 'History', admin: '⚙️ Admin',
    profil: 'My Profile', logout: 'Logout', newDiploma: '+ New Diploma',
    dashDesc: 'Overview of your activity', regDesc: 'Register a new diploma on the blockchain',
    verDesc: 'Verify the authenticity of a diploma', histDesc: 'All registered diplomas', adminDesc: 'System management and synchronization',
    total: 'Total Diplomas', month: 'This Month', withPDF: 'With PDF', onChain: 'On Blockchain',
    student: 'Student Name', institution: 'Institution Name', diplomaName: 'Diploma Name',
    diplomaType: 'Diploma Type', filiere: 'Field of Study', issueDate: 'Issue Date',
    selectType: '— Select —', selectFiliere: '— Select field —',
    pdfLabel: 'Diploma PDF', pdfOptional: 'optional · stored on IPFS',
    registerBtn: '🔗 Register on Blockchain', registering: '⏳ Registering...',
    verifyLabel: 'Diploma Code (Hash)', verifyBtn: '🔍 Verify on Blockchain', verifying: '⏳ Verifying...',
    enterCode: '❌ Please enter a code.', fillFields: '❌ Please fill all fields',
    authentic: 'Authentic Diploma', notFound: '❌ Diploma not found.',
    hashCode: 'Diploma Code (Hash)', copy: '📋 Copy', qrLabel: 'QR Code — Scan to verify',
    recentActivity: '🕐 Recent Activity', seeAll: 'See all →', noActivity: 'No activity yet',
    listDiplomas: 'Diplomas List', noDiplomas: 'No diplomas registered', bonjour: 'Hello',
    savedDB: '🗄️ Saved in database', diplomasCount: 'Registered Diplomas',
    etudiant: 'Student', type: 'Type', date: 'Date',
    preview: '👁️ Preview before registering', previewTitle: 'Diploma Summary',
    previewDesc: 'Check information before sending to blockchain',
    confirm: '✅ Confirm & Register', cancel: '✕ Cancel',
    printBtn: '🖨️ Print / Export PDF', byFiliere: 'By field', weekCount: 'This week',
    syncTitle: 'Sync Ganache → PostgreSQL', syncDesc: 'Import diplomas from localStorage to PostgreSQL',
    syncBtn: '🔄 Sync Now', syncing: '⏳ Syncing...',
    reportTitle: 'Full Report', reportDesc: 'Generate and print a PDF report of all diplomas',
    loadReport: '📊 Load Report', printReport: '🖨️ Print PDF',
    usersTitle: 'User Management', refresh: '🔄 Refresh',
    noUsers: 'No users registered', verified: '✓ Verified', pending: '⏳ Pending',
    cne: 'CNE Number', email: 'Student Email (optional)',
  }
}

export default function Register() {
  const isDemo = localStorage.getItem('isDemo') === 'true'
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showProfil, setShowProfil] = useState(false)
  const [lang, setLang] = useState('fr')
  const [darkMode, setDarkMode] = useState(false)
  const t = LANGS[lang]
  const isRTL = lang === 'ar'

  const user = JSON.parse(localStorage.getItem('currentUser') || '{}')
  const initials = user.nom ? user.nom.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'IN'

  // ✅ أضفنا studentEmail في الـ form
  const [form, setForm] = useState({
    studentName: '', cne: '', institution: '',
    diplomaName: '', diplomaType: '', filiere: '',
    issueDate: '', studentEmail: ''
  })
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [diplomaCode, setDiplomaCode] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [verifyCode, setVerifyCode] = useState('')
  const [verifyResult, setVerifyResult] = useState(null)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [historique, setHistorique] = useState(JSON.parse(localStorage.getItem('diplomas') || '[]'))

  // ✅ خانة البحث في Historique
  const [historiqueSearch, setHistoriqueSearch] = useState('')

  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [reportLoading, setReportLoading] = useState(false)
  const [syncLoading, setSyncLoading] = useState(false)
  const [syncResult, setSyncResult] = useState(null)
  const [adminMsg, setAdminMsg] = useState(null)

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }) }

  // ✅ تحويل QR Code (SVG) إلى صورة PNG وتنزيلها
  function downloadQRCode(containerId, fileName) {
    const container = document.getElementById(containerId)
    const svg = container?.querySelector('svg')
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    const img = new Image()
    img.onload = () => {
      const padding = 20
      const canvas = document.createElement('canvas')
      canvas.width = img.width + padding * 2
      canvas.height = img.height + padding * 2
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, padding, padding)
      URL.revokeObjectURL(url)
      const pngUrl = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = pngUrl
      a.download = `QRCode-${(fileName || 'diplome').slice(0, 20)}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
    img.src = url
  }

  const now = new Date()
  const thisMonth = now.toLocaleDateString('fr-FR').slice(3)
  const thisWeekStart = new Date(now); thisWeekStart.setDate(now.getDate() - now.getDay())
  const total = historique.length
  const thisMonthCount = historique.filter(d => d.date?.includes(thisMonth)).length
  const thisWeekCount = historique.filter(d => {
    if (!d.date) return false
    const parts = d.date.split('/'); if (parts.length < 3) return false
    const dDate = new Date(parts[2], parts[1]-1, parts[0])
    return dDate >= thisWeekStart
  }).length
  const withPDF = historique.filter(d => d.ipfsHash).length
  const licenceCount = historique.filter(d => d.diplomaType === 'Licence').length
  const masterCount = historique.filter(d => d.diplomaType === 'Master').length
  const doctoratCount = historique.filter(d => d.diplomaType === 'Doctorat').length
  const monthRate = total ? Math.round((thisMonthCount / total) * 100) : 0
  const filiereStats = FILIERES.map(f => ({ name: f, count: historique.filter(d => d.filiere === f).length })).filter(f => f.count > 0).sort((a, b) => b.count - a.count)

  // ✅ قائمة الديبلومات المُفلترة حسب البحث في Historique
  const filteredHistorique = historique.filter(item => {
    if (!historiqueSearch.trim()) return true
    const q = historiqueSearch.toLowerCase()
    return (
      (item.studentName || '').toLowerCase().includes(q) ||
      (item.cne || '').toLowerCase().includes(q) ||
      (item.institution || '').toLowerCase().includes(q) ||
      (item.diplomaType || '').toLowerCase().includes(q) ||
      (item.filiere || '').toLowerCase().includes(q)
    )
  })

  const colors = darkMode ? {
    bg: '#0f172a', white: '#1e293b', border: '#334155', borderL: '#1e293b',
    text: '#f1f5f9', muted: '#94a3b8', mutedL: '#64748b',
    bluePale: '#1e3a5f', blueMid: '#1e40af',
  } : {
    bg: '#f8fafc', white: '#ffffff', border: '#e2e8f0', borderL: '#f1f5f9',
    text: '#0f172a', muted: '#64748b', mutedL: '#94a3b8',
    bluePale: '#eff6ff', blueMid: '#dbeafe',
  }
  const d = colors

  async function loadUsers() {
    try {
      setUsersLoading(true)
      const res = await fetch('http://localhost:5000/api/users')
      const data = await res.json()
      if (data.success) setUsers(data.users)
    } catch (err) { console.error(err) }
    finally { setUsersLoading(false) }
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
        cne: d.cne || '',
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
      if (data.success) setSyncResult({ type: 'success', msg: `✅ ${data.synced} synchronisés, ${data.skipped} ignorés` })
    } catch (err) { setSyncResult({ type: 'error', msg: '❌ ' + err.message }) }
    finally { setSyncLoading(false) }
  }

  function handlePrintReport() {
    if (!report) return
    const win = window.open('', '_blank')
    win.document.write(`<html><head><title>Rapport DiploChain</title><style>
      body{font-family:Arial,sans-serif;padding:20px;color:#0f172a}
      h1{color:#1d4ed8;border-bottom:2px solid #1d4ed8;padding-bottom:10px}
      .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin:20px 0}
      .stat{background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:14px;text-align:center}
      .stat-num{font-size:28px;font-weight:800;color:#1d4ed8}
      .stat-label{font-size:12px;color:#64748b;margin-top:4px}
      table{width:100%;border-collapse:collapse;margin-top:20px}
      th{background:#1d4ed8;color:white;padding:10px;text-align:left;font-size:12px}
      td{padding:10px;border-bottom:1px solid #e2e8f0;font-size:12px}
      tr:nth-child(even){background:#f8fafc}
      .footer{margin-top:30px;text-align:center;color:#94a3b8;font-size:11px}
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
        ${report.diplomas.map(dp => `<tr><td>${dp.student_name}</td><td>${dp.institution_name}</td><td>${dp.diploma_title}</td><td>${new Date(dp.graduation_date).toLocaleDateString('fr-FR')}</td><td style="color:#059669">✓ Valide</td></tr>`).join('')}
      </table>
      <div class="footer">© 2025 DiploChain · Plateforme Blockchain de gestion des diplômes</div>
    </body></html>`)
    win.document.close(); win.print()
  }

  async function handleDeleteUser(id) {
    if (!window.confirm('Supprimer cet utilisateur ?')) return
    try {
      await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' })
      setAdminMsg({ type: 'success', text: '✅ Utilisateur supprimé' })
      loadUsers()
    } catch (err) { setAdminMsg({ type: 'error', text: '❌ ' + err.message }) }
  }

  useEffect(() => { if (activeTab === 'admin') loadUsers() }, [activeTab])

  // ════════════════════════════════════════
  // ✅ handleSubmit مصلَّح — يرسل CNE + Email
  // ════════════════════════════════════════
  async function handleSubmit() {
    if (!form.studentName || !form.cne || !form.institution || !form.diplomaType || !form.issueDate) {
      setResult({ type: 'error', msg: t.fillFields }); setShowPreview(false); return
    }
    try {
      setLoading(true); setShowPreview(false)

      // رفع PDF على IPFS
      let ipfsHash = ''
      if (file) ipfsHash = await uploadToPinata(file)

      // تسجيل على البلوكتشين
      const { web3, contract, accounts } = await getContract()
      const ts = Math.floor(new Date(form.issueDate).getTime() / 1000)
      const receipt = await contract.methods.registerDiploma(
        form.studentName, form.institution, form.diplomaType, ts, ipfsHash
      ).send({ from: accounts[0], gas: 400000 })

      const diplomaId = web3.utils.soliditySha3(
        { type: 'string', value: form.studentName },
        { type: 'string', value: form.institution },
        { type: 'uint256', value: (await web3.eth.getBlock(receipt.blockNumber)).timestamp }
      )
      setDiplomaCode(diplomaId)

      // ✅ حفظ في PostgreSQL مع CNE + Email
      console.log('📤 إرسال للـ API:', {
        studentName: form.studentName,
        cne: form.cne,
        institution: form.institution,
        diplomaType: form.diplomaType,
        issueDate: form.issueDate,
        blockchainHash: diplomaId,
        ipfsHash,
        walletAddress: accounts[0],
        studentEmail: form.studentEmail || null
      })

      const response = await fetch('http://localhost:5000/api/diplomas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName:   form.studentName,
          cne:           form.cne.trim(),
          institution:   form.institution,
          diplomaType:   form.diplomaType,
          issueDate:     form.issueDate,
          blockchainHash: diplomaId,
          ipfsHash:      ipfsHash || null,
          walletAddress: accounts[0],
          studentEmail:  form.studentEmail || null
        })
      })

      const data = await response.json()
      console.log('📥 رد الـ API:', data)

      if (!data.success) throw new Error(data.error || 'Erreur serveur')

      // حفظ في localStorage
      const entry = {
        id: diplomaId,
        studentName: form.studentName,
        cne: form.cne,
        institution: form.institution,
        diplomaType: form.diplomaType,
        filiere: form.filiere,
        issueDate: form.issueDate,
        ipfsHash,
        date: new Date().toLocaleDateString('fr-FR')
      }
      const updated = [entry, ...JSON.parse(localStorage.getItem('diplomas') || '[]')]
      localStorage.setItem('diplomas', JSON.stringify(updated))
      setHistorique(updated)

      setResult({
        type: 'success',
        msg: `✅ Diplôme enregistré avec succès!\n🪪 CNE: ${form.cne}\n📅 ${form.issueDate}${ipfsHash ? `\n📄 IPFS: ${ipfsHash}` : ''}\n${t.savedDB}`
      })

      // إعادة تعيين النموذج
      setForm({ studentName: '', cne: '', institution: '', diplomaName: '', diplomaType: '', filiere: '', issueDate: '', studentEmail: '' })
      setFile(null)

    } catch (err) {
      console.error('❌ خطأ:', err)
      setResult({ type: 'error', msg: '❌ ' + err.message })
    } finally {
      setLoading(false)
    }
  }

  async function uploadToPinata(f) {
    const fd = new FormData(); fd.append('file', f)
    const r = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', fd, {
      headers: {
        'pinata_api_key': import.meta.env.VITE_PINATA_API_KEY,
        'pinata_secret_api_key': import.meta.env.VITE_PINATA_API_SECRET,
        'Content-Type': 'multipart/form-data'
      }
    })
    return r.data.IpfsHash
  }

  async function handleVerify() {
    if (!verifyCode.trim()) { setVerifyResult({ type: 'error', msg: t.enterCode }); return }
    try {
      setVerifyLoading(true)
      const { contract } = await getContract()
      const diploma = await contract.methods.verifyDiploma(verifyCode).call()
      if (!diploma || !diploma.studentName || diploma.isValid === false) {
        setVerifyResult({ type: 'error', msg: t.notFound }); return
      }
      setVerifyResult({
        type: 'success',
        data: {
          studentName: diploma.studentName,
          institution: diploma.institution,
          diplomaType: diploma.diplomaType,
          issueDate: new Date(Number(diploma.issueDate) * 1000).toLocaleDateString('fr-FR')
        }
      })
    } catch (err) { setVerifyResult({ type: 'error', msg: '❌ ' + err.message }) }
    finally { setVerifyLoading(false) }
  }

  const tabs = [
    { key: 'dashboard',    icon: '📊', label: t.dashboard    },
    { key: 'enregistrer',  icon: '📋', label: t.enregistrer  },
    { key: 'verification', icon: '🔍', label: t.verification },
    { key: 'historique',   icon: '📜', label: t.historique   },
    { key: 'admin',        icon: '⚙️', label: 'Admin'        },
  ]
  const tabDescMap = {
    dashboard: t.dashDesc, enregistrer: t.regDesc,
    verification: t.verDesc, historique: t.histDesc, admin: t.adminDesc
  }

  const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .rr { font-family: 'Plus Jakarta Sans', sans-serif; background: ${d.bg}; min-height: 100vh; display: flex; color: ${d.text}; direction: ${isRTL ? 'rtl' : 'ltr'}; }
  .sb { width: 256px; min-height: 100vh; flex-shrink: 0; background: ${d.white}; border-${isRTL ? 'left' : 'right'}: 1px solid ${d.border}; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; }
  .sb-user { padding: 1.4rem 1.2rem; border-bottom: 1px solid ${d.borderL}; cursor: pointer; }
  .av { width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0; background: linear-gradient(135deg, #1d4ed8, #3b82f6); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; color: white; }
  .sb-brand { padding: 1rem 1.2rem; border-bottom: 1px solid ${d.borderL}; display: flex; align-items: center; gap: 9px; }
  .sb-brand-icon { width: 32px; height: 32px; border-radius: 9px; background: linear-gradient(135deg, #1d4ed8, #3b82f6); display: flex; align-items: center; justify-content: center; font-size: 16px; }
  .sb-nav { padding: 0.8rem 0.75rem; flex: 1; overflow-y: auto; }
  .sb-section-label { font-size: 10px; font-weight: 700; color: ${d.mutedL}; text-transform: uppercase; letter-spacing: 0.1em; padding: 0 8px; margin: 12px 0 6px; }
  .nav-btn { width: 100%; display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; border: none; cursor: pointer; margin-bottom: 2px; font-size: 13.5px; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; text-align: ${isRTL ? 'right' : 'left'}; }
  .nav-btn.active { background: ${d.bluePale}; color: #1d4ed8; font-weight: 700; }
  .nav-btn.inactive { background: transparent; color: ${d.muted}; font-weight: 500; }
  .nav-btn.inactive:hover { background: ${d.bg}; color: ${d.text}; }
  .nav-btn-icon { width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 15px; }
  .nav-btn.active .nav-btn-icon { background: ${d.blueMid}; }
  .nav-btn.inactive .nav-btn-icon { background: ${d.borderL}; }
  .profil-btn { width: 100%; display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; border: 1px solid ${d.border}; cursor: pointer; font-size: 13.5px; font-family: 'Plus Jakarta Sans', sans-serif; background: transparent; color: ${d.muted}; font-weight: 500; margin-top: 4px; }
  .sb-bottom { padding: 0.8rem 0.75rem 1.2rem; border-top: 1px solid ${d.borderL}; }
  .sb-stat-box { background: ${d.bluePale}; border: 1px solid ${d.blueMid}; border-radius: 12px; padding: 12px 14px; margin-bottom: 10px; display: flex; align-items: center; gap: 12px; }
  .logout-b { width: 100%; padding: 9px; border-radius: 10px; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 7px; font-family: 'Plus Jakarta Sans', sans-serif; }
  .main { flex: 1; background: ${d.bg}; overflow-y: auto; min-width: 0; }
  .topbar { background: ${d.white}; border-bottom: 1px solid ${d.border}; padding: 0 2.5rem; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 20; }
  .topbar-badge { display: flex; align-items: center; gap: 7px; background: ${d.bluePale}; border: 1px solid ${d.blueMid}; border-radius: 100px; padding: 6px 14px; }
  .card { background: ${d.white}; border: 1px solid ${d.border}; border-radius: 16px; overflow: hidden; }
  .card-accent::before { content: ''; display: block; height: 3px; background: linear-gradient(90deg, #1d4ed8, #3b82f6, #60a5fa); }
  .card-accent-green::before { content: ''; display: block; height: 3px; background: linear-gradient(90deg, #059669, #10b981); }
  .gl-label { display: block; font-size: 11.5px; font-weight: 700; color: ${d.muted}; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 7px; }
  .gl-input { width: 100%; padding: 11px 14px; background: ${d.bg}; border: 1.5px solid ${d.border}; border-radius: 10px; color: ${d.text}; font-size: 14px; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; }
  .gl-input:focus { border-color: #3b82f6; background: ${d.white}; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
  .gl-input option { background: ${d.white}; color: ${d.text}; }
  .blue-btn { width: 100%; padding: 13px; border: none; border-radius: 12px; cursor: pointer; font-size: 14.5px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; color: white; background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%); transition: all 0.2s; }
  .blue-btn:hover:not(:disabled) { transform: translateY(-1px); }
  .blue-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .preview-btn { width: 100%; padding: 12px; border: 1.5px solid #1d4ed8; border-radius: 12px; cursor: pointer; font-size: 14px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; color: #1d4ed8; background: ${d.bluePale}; transition: all 0.2s; margin-bottom: 10px; }
  .print-btn { width: 100%; padding: 11px; border: 1.5px solid #059669; border-radius: 12px; cursor: pointer; font-size: 13.5px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; color: #059669; background: #f0fdf4; margin-top: 10px; }
  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .kpi-card { background: ${d.white}; border: 1px solid ${d.border}; border-radius: 14px; padding: 1.3rem; transition: all 0.2s; }
  .kpi-card:hover { transform: translateY(-2px); }
  .kpi-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 1rem; }
  .kpi-val { font-size: 30px; font-weight: 800; letter-spacing: -0.03em; line-height: 1; margin-bottom: 4px; }
  .kpi-label { font-size: 12px; color: ${d.muted}; font-weight: 500; }
  .kpi-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 100px; }
  .progress-bg { background: ${d.borderL}; border-radius: 100px; height: 5px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 100px; }
  .activity-item { display: flex; align-items: center; gap: 12px; padding: 11px 0; border-bottom: 1px solid ${d.borderL}; }
  .activity-item:last-child { border-bottom: none; }
  .table-row { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.4rem; border-bottom: 1px solid ${d.borderL}; gap: 12px; }
  .table-row:hover { background: ${d.bg}; }
  .avatar-sm { width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0; background: ${d.bluePale}; border: 1px solid ${d.blueMid}; display: flex; align-items: center; justify-content: center; font-size: 16px; }
  .pill { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; }
  .pill-green { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
  .icell { background: ${d.bg}; border: 1px solid ${d.border}; border-radius: 12px; padding: 13px 15px; }
  .lang-btn { padding: 5px 10px; border-radius: 8px; border: 1px solid ${d.border}; background: ${d.bg}; color: ${d.text}; font-size: 12px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
  .lang-btn.active-lang { background: #1d4ed8; color: white; border-color: #1d4ed8; }
  .dark-toggle { width: 42px; height: 24px; border-radius: 12px; border: none; cursor: pointer; position: relative; background: ${darkMode ? '#1d4ed8' : d.border}; }
  .dark-toggle-dot { position: absolute; top: 3px; width: 18px; height: 18px; border-radius: 50%; background: white; transition: left 0.2s; left: ${darkMode ? '21px' : '3px'}; }
  .modal-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(15,23,42,0.6); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
  .modal-box { background: ${d.white}; border-radius: 20px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 80px rgba(0,0,0,0.2); }
  .main::-webkit-scrollbar { width: 4px; }
  .main::-webkit-scrollbar-thumb { background: ${d.border}; border-radius: 4px; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .fade-up { animation: fadeUp 0.4s ease forwards; }
  @media print {
    .sb, .topbar, .print-btn, .preview-btn, .blue-btn, .lang-btn, .dark-toggle { display: none !important; }
    .main { overflow: visible !important; }
  }
  `

  return (
    <div className="rr">
      <style>{CSS}</style>

      {/* PREVIEW MODAL */}
      {showPreview && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', padding: '1.5rem', borderRadius: '20px 20px 0 0' }}>
              <div style={{ fontWeight: 800, color: 'white', fontSize: 18 }}>👁️ {t.previewTitle}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{t.previewDesc}</div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '1.5rem' }}>
                {[
                  { icon: '👤', label: t.student,     value: form.studentName || '—' },
                  { icon: '🪪', label: 'CNE',          value: form.cne          || '—' },
                  { icon: '🏛️', label: t.institution, value: form.institution  || '—' },
                  { icon: '🎓', label: t.diplomaType, value: form.diplomaType  || '—' },
                  { icon: '📚', label: t.filiere,     value: form.filiere      || '—' },
                  { icon: '📅', label: t.issueDate,   value: form.issueDate    || '—' },
                  { icon: '📄', label: 'PDF',         value: file ? '✅ ' + file.name : '—' },
                  { icon: '📧', label: 'Email',       value: form.studentEmail  || '—' },
                ].map((item, i) => (
                  <div key={i} className="icell">
                    <div style={{ fontSize: 10, color: d.mutedL, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>{item.icon} {item.label}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: d.text, wordBreak: 'break-word' }}>{item.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 12, padding: '12px 14px', marginBottom: '1.2rem', fontSize: 12.5, color: '#92400e' }}>
                ⚠️ Une fois enregistré sur la blockchain, ces données sont <strong>immuables et permanentes</strong>.
              </div>
              <button className="blue-btn" onClick={handleSubmit} disabled={loading} style={{ marginBottom: 10 }}>
                {loading ? '⏳ ...' : t.confirm}
              </button>
              <button onClick={() => setShowPreview(false)} style={{ width: '100%', padding: '11px', border: `1px solid ${d.border}`, borderRadius: 12, background: d.bg, color: d.muted, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="sb">
        <div className="sb-user" onClick={() => setShowProfil(true)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="av">{initials}</div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: d.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.nom || 'Admin'}</div>
              <div style={{ fontSize: 11, color: d.mutedL }}>{user.email}</div>
            </div>
            <span style={{ fontSize: 12, color: d.mutedL }}>›</span>
          </div>
        </div>
        <div className="sb-brand">
          <div className="sb-brand-icon">🎓</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: d.text }}>Diplo<span style={{ color: '#1d4ed8' }}>Chain</span></div>
            <div style={{ fontSize: 10, color: d.mutedL, fontWeight: 600, textTransform: 'uppercase' }}>Admin</div>
          </div>
        </div>
        <div className="sb-nav">
          <div className="sb-section-label">Navigation</div>
          {tabs.map(tab => (
            <button key={tab.key} className={`nav-btn ${activeTab === tab.key ? 'active' : 'inactive'}`} onClick={() => setActiveTab(tab.key)}>
              <span className="nav-btn-icon">{tab.icon}</span>
              <span style={{ flex: 1 }}>{tab.label}</span>
              {activeTab === tab.key && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1d4ed8', flexShrink: 0 }} />}
            </button>
          ))}
          <div className="sb-section-label" style={{ marginTop: 16 }}>Compte</div>
          <button className="profil-btn" onClick={() => setShowProfil(true)}>
            <span className="nav-btn-icon" style={{ background: d.borderL }}>👤</span>
            <span style={{ flex: 1 }}>{t.profil}</span>
          </button>
        </div>
        <div className="sb-bottom">
          <div className="sb-stat-box">
            <div style={{ width: 36, height: 36, borderRadius: 10, background: d.blueMid, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎓</div>
            <div>
              <div style={{ fontSize: 11, color: '#3b82f6', fontWeight: 600 }}>{t.diplomasCount}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1d4ed8' }}>{historique.length}</div>
            </div>
          </div>
          <button className="logout-b" onClick={() => { localStorage.removeItem('role'); localStorage.removeItem('currentUser'); window.location.href = '/'; }}>
            <span>🚪</span> {t.logout}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: d.mutedL, fontWeight: 500 }}>DiploChain</span>
            <span style={{ color: d.border, fontSize: 18 }}>›</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: d.text }}>{tabs.find(tab => tab.key === activeTab)?.icon} {tabs.find(tab => tab.key === activeTab)?.label}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {['fr', 'ar', 'en'].map(l => (
              <button key={l} className={`lang-btn ${lang === l ? 'active-lang' : ''}`} onClick={() => setLang(l)}>
                {l === 'fr' ? '🇫🇷 FR' : l === 'ar' ? '🇲🇦 AR' : '🇬🇧 EN'}
              </button>
            ))}
            <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
              <div className="dark-toggle-dot" />
            </button>
            <span style={{ fontSize: 16 }}>{darkMode ? '🌙' : '☀️'}</span>
            <div className="topbar-badge">
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3b82f6', display: 'inline-block', animation: 'blink 2s infinite' }} />
              <span style={{ fontSize: 12, color: '#1d4ed8', fontWeight: 600 }}>Ethereum · Ganache</span>
            </div>
          </div>
        </div>

        <div style={{ padding: '1.6rem 2.5rem 0', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: d.text }}>{tabs.find(tab => tab.key === activeTab)?.icon} {tabs.find(tab => tab.key === activeTab)?.label}</h1>
            <p style={{ fontSize: 13, color: d.muted, marginTop: 3 }}>{tabDescMap[activeTab]}</p>
          </div>
          {activeTab !== 'enregistrer' && activeTab !== 'admin' && !isDemo && (
            <button onClick={() => setActiveTab('enregistrer')} className="blue-btn" style={{ width: 'auto', padding: '9px 20px', fontSize: 13 }}>{t.newDiploma}</button>
          )}
          {isDemo && (
            <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 10, padding: '7px 14px', fontSize: 12, color: '#92400e', fontWeight: 600 }}>
              👁️ Mode démonstration — lecture seule
            </div>
          )}
        </div>

        <div style={{ padding: '1.5rem 2.5rem 3rem', maxWidth: activeTab === 'dashboard' ? 1000 : 720 }}>

          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="fade-up">
              <div style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 60%, #60a5fa 100%)', borderRadius: 16, padding: '1.4rem 2rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 4 }}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>{t.bonjour}, {user.nom?.split(' ')[0] || 'Admin'} 👋</div>
                </div>
                <div style={{ textAlign: isRTL ? 'left' : 'right' }}>
                  <div style={{ fontSize: 30, fontWeight: 800, color: 'white' }}>{total}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>{t.diplomasCount}</div>
                </div>
              </div>
              <div className="kpi-grid" style={{ marginBottom: '1.5rem' }}>
                {[
                  { icon: '🎓', label: t.total,     val: total,          color: '#1d4ed8', bg: d.bluePale, bdr: d.blueMid, badge: '100%', badgeBg: d.blueMid, badgeColor: '#1d4ed8', bar: 100, barColor: '#3b82f6' },
                  { icon: '📅', label: t.month,     val: thisMonthCount, color: '#059669', bg: '#ecfdf5',  bdr: '#bbf7d0', badge: `${monthRate}%`, badgeBg: '#dcfce7', badgeColor: '#15803d', bar: monthRate, barColor: '#10b981' },
                  { icon: '📆', label: t.weekCount, val: thisWeekCount,  color: '#7c3aed', bg: '#f5f3ff',  bdr: '#ddd6fe', badge: '7j', badgeBg: '#ede9fe', badgeColor: '#7c3aed', bar: total ? Math.round(thisWeekCount/total*100) : 0, barColor: '#8b5cf6' },
                  { icon: '⛓️', label: t.onChain,  val: total,          color: '#0891b2', bg: '#ecfeff',  bdr: '#a5f3fc', badge: '✓', badgeBg: '#cffafe', badgeColor: '#0891b2', bar: 100, barColor: '#06b6d4' },
                ].map((k, i) => (
                  <div key={i} className="kpi-card">
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                      <div className="kpi-icon" style={{ background: k.bg, border: `1px solid ${k.bdr}` }}>{k.icon}</div>
                      <span className="kpi-badge" style={{ background: k.badgeBg, color: k.badgeColor }}>{k.badge}</span>
                    </div>
                    <div className="kpi-val" style={{ color: k.color }}>{k.val}</div>
                    <div className="kpi-label">{k.label}</div>
                    <div className="progress-bg" style={{ marginTop: 10 }}>
                      <div className="progress-fill" style={{ width: `${k.bar}%`, background: k.barColor }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: '1.5rem' }}>
                <div className="card" style={{ padding: '1.4rem' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: d.text, marginBottom: '1.2rem' }}>📊 Répartition par type</div>
                  {[{ label: 'Licence', val: licenceCount, color: '#3b82f6' }, { label: 'Master', val: masterCount, color: '#7c3aed' }, { label: 'Doctorat', val: doctoratCount, color: '#0891b2' }].map((item, i) => (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: d.text }}>{item.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.val} <span style={{ color: d.mutedL, fontWeight: 400 }}>({total ? Math.round(item.val/total*100) : 0}%)</span></span>
                      </div>
                      <div className="progress-bg"><div className="progress-fill" style={{ width: `${total ? (item.val/total*100) : 0}%`, background: item.color }} /></div>
                    </div>
                  ))}
                </div>
                <div className="card" style={{ padding: '1.4rem' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: d.text, marginBottom: '1.2rem' }}>📚 {t.byFiliere}</div>
                  {filiereStats.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: d.mutedL, fontSize: 13 }}>Aucune filière</div>
                  ) : filiereStats.slice(0, 5).map((f, i) => (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: d.text }}>{f.name}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1d4ed8' }}>{f.count}</span>
                      </div>
                      <div className="progress-bg"><div className="progress-fill" style={{ width: `${total ? (f.count/total*100) : 0}%`, background: '#1d4ed8' }} /></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div style={{ padding: '1.1rem 1.4rem', borderBottom: `1px solid ${d.borderL}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: d.text }}>{t.recentActivity}</div>
                  <button onClick={() => setActiveTab('historique')} style={{ fontSize: 12, color: '#1d4ed8', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>{t.seeAll}</button>
                </div>
                <div style={{ padding: '0.4rem 1.4rem' }}>
                  {historique.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2.5rem', color: d.mutedL }}><div style={{ fontSize: 32, marginBottom: 8 }}>📭</div><div style={{ fontSize: 13 }}>{t.noActivity}</div></div>
                  ) : historique.slice(0, 5).map((item, i) => (
                    <div key={i} className="activity-item">
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: d.bluePale, border: `1px solid ${d.blueMid}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🎓</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: d.text }}>{item.studentName}</div>
                        <div style={{ fontSize: 11, color: d.muted }}>{item.diplomaType} {item.filiere ? `· ${item.filiere}` : ''} · {item.institution}</div>
                      </div>
                      <span className="pill pill-green">✓</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ENREGISTRER - Demo */}
          {activeTab === 'enregistrer' && isDemo && (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: d.text, marginBottom: 8 }}>Mode démonstration</div>
              <div style={{ color: d.muted, fontSize: 14 }}>L'enregistrement est réservé à l'administrateur.</div>
            </div>
          )}

          {/* ENREGISTRER */}
          {activeTab === 'enregistrer' && !isDemo && (
            <div className="card card-accent fade-up">
              <div style={{ padding: '1.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.8rem', paddingBottom: '1.2rem', borderBottom: `1px solid ${d.borderL}` }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: d.bluePale, border: `1px solid ${d.blueMid}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📋</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: d.text }}>Nouveau diplôme</div>
                    <div style={{ color: d.mutedL, fontSize: 12, marginTop: 2 }}>{t.regDesc}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                  <div style={{ marginBottom: '1.1rem' }}>
                    <label className="gl-label">👤 {t.student}</label>
                    <input className="gl-input" name="studentName" value={form.studentName} placeholder="Ex: Ahmed Benali" onChange={handleChange} />
                  </div>
                  <div style={{ marginBottom: '1.1rem' }}>
                    <label className="gl-label">🪪 {t.cne}</label>
                    <input className="gl-input" name="cne" value={form.cne} placeholder="Ex: R123456789" onChange={handleChange} />
                  </div>
                  <div style={{ marginBottom: '1.1rem' }}>
                    <label className="gl-label">🏛️ {t.institution}</label>
                    <input className="gl-input" name="institution" value={form.institution} placeholder="Ex: FST Fès" onChange={handleChange} />
                  </div>
                  <div style={{ marginBottom: '1.1rem' }}>
                    <label className="gl-label">🎓 {t.diplomaType}</label>
                    <select className="gl-input" name="diplomaType" value={form.diplomaType} onChange={handleChange}>
                      <option value="">{t.selectType}</option>
                      <option value="Licence">🎓 Licence</option>
                      <option value="Master">🏅 Master</option>
                      <option value="Doctorat">🏆 Doctorat</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '1.1rem' }}>
                    <label className="gl-label">📚 {t.filiere}</label>
                    <select className="gl-input" name="filiere" value={form.filiere} onChange={handleChange}>
                      <option value="">{t.selectFiliere}</option>
                      {FILIERES.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: '1.1rem' }}>
                    <label className="gl-label">📅 {t.issueDate}</label>
                    <input className="gl-input" type="date" name="issueDate" value={form.issueDate} onChange={handleChange} />
                  </div>
                  {/* ✅ حقل Email جديد */}
                  <div style={{ marginBottom: '1.1rem', gridColumn: '1 / -1' }}>
                    <label className="gl-label">📧 {t.email}</label>
                    <input className="gl-input" name="studentEmail" value={form.studentEmail} placeholder="Ex: ahmed@example.com" onChange={handleChange} />
                  </div>
                </div>

                <div style={{ border: `1.5px dashed ${d.blueMid}`, borderRadius: 12, padding: '1rem', marginBottom: '1.4rem', textAlign: 'center', background: d.bg }}>
                  <div style={{ fontSize: 13, color: d.muted, marginBottom: 8 }}>📄 {t.pdfLabel} <span style={{ color: d.mutedL }}>({t.pdfOptional})</span></div>
                  <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])} />
                  {file && <div style={{ color: '#1d4ed8', marginTop: 8, fontSize: 12, fontWeight: 600 }}>✅ {file.name}</div>}
                </div>

                <button className="preview-btn" onClick={() => setShowPreview(true)}>{t.preview}</button>
                <button className="blue-btn" onClick={handleSubmit} disabled={loading}>
                  {loading ? '⏳ ...' : t.registerBtn}
                </button>

                {result && (
                  <div style={{ marginTop: '1rem', padding: '12px 16px', borderRadius: 10, fontSize: 13.5, whiteSpace: 'pre-line', background: result.type === 'success' ? '#f0fdf4' : '#fef2f2', color: result.type === 'success' ? '#15803d' : '#dc2626', borderLeft: `3px solid ${result.type === 'success' ? '#059669' : '#dc2626'}` }}>
                    {result.msg}
                  </div>
                )}

                {diplomaCode && (
                  <div style={{ marginTop: '1.2rem', padding: '1.4rem', background: d.bluePale, borderRadius: 14, border: `1px solid ${d.blueMid}` }}>
                    <div style={{ fontWeight: 700, color: '#1d4ed8', fontSize: 13, marginBottom: 10 }}>🔑 {t.hashCode}</div>
                    <div style={{ fontSize: 11, color: '#1e40af', wordBreak: 'break-all', background: d.white, padding: '10px 12px', borderRadius: 9, fontFamily: 'monospace', marginBottom: 12, border: `1px solid ${d.blueMid}` }}>{diplomaCode}</div>
                    <button onClick={() => navigator.clipboard.writeText(diplomaCode)} style={{ background: d.white, color: '#1d4ed8', border: '1.5px solid #1d4ed8', borderRadius: 8, padding: '7px 16px', fontSize: 12, cursor: 'pointer', fontWeight: 700, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{t.copy}</button>
                    <div style={{ marginTop: '1.2rem', textAlign: 'center', background: d.white, padding: 16, borderRadius: 12, border: `1px solid ${d.blueMid}` }}>
                      <div id="diploma-qr-svg">
                        <QRCodeSVG value={diplomaCode} size={148} bgColor={d.white} fgColor="#1d4ed8" level="H" />
                      </div>
                      <div style={{ fontSize: 11, color: d.mutedL, marginTop: 8 }}>{t.qrLabel}</div>
                    </div>
                    <button className="print-btn" onClick={() => downloadQRCode('diploma-qr-svg', diplomaCode)} style={{ background: '#eff6ff', color: '#1d4ed8', borderColor: '#1d4ed8', marginTop: 8 }}>
                      ⬇️ {lang === 'ar' ? 'تحميل QR Code' : lang === 'en' ? 'Download QR Code' : 'Télécharger le QR Code'}
                    </button>
                    <button className="print-btn" onClick={() => window.print()}>{t.printBtn}</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VERIFICATION */}
          {activeTab === 'verification' && (
            <div className="card card-accent fade-up">
              <div style={{ padding: '1.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.8rem', paddingBottom: '1.2rem', borderBottom: `1px solid ${d.borderL}` }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: d.bluePale, border: `1px solid ${d.blueMid}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🔍</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: d.text }}>{t.verification}</div>
                    <div style={{ color: d.mutedL, fontSize: 12, marginTop: 2 }}>{t.verDesc}</div>
                  </div>
                </div>
                <label className="gl-label">🔑 {t.verifyLabel}</label>
                <input className="gl-input" placeholder="0x..." value={verifyCode} onChange={e => { setVerifyCode(e.target.value); setVerifyResult(null) }} style={{ fontFamily: 'monospace', marginBottom: '1.2rem', fontSize: 13 }} />
                <button className="blue-btn" onClick={handleVerify} disabled={verifyLoading}>{verifyLoading ? t.verifying : t.verifyBtn}</button>
                {verifyResult?.type === 'error' && (
                  <div style={{ marginTop: '1rem', padding: '12px 16px', borderRadius: 10, background: '#fef2f2', color: '#dc2626', borderLeft: '3px solid #dc2626', fontSize: 13.5 }}>{verifyResult.msg}</div>
                )}
                {verifyResult?.type === 'success' && (
                  <div style={{ marginTop: '1.2rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderLeft: '3px solid #059669', borderRadius: 14, overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18 }}>✅</span>
                      <span style={{ fontWeight: 700, color: '#15803d', fontSize: 14 }}>{t.authentic}</span>
                    </div>
                    <div style={{ padding: '1.1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {[{ icon: '👤', label: t.etudiant, value: verifyResult.data.studentName }, { icon: '🏛️', label: t.institution, value: verifyResult.data.institution }, { icon: '🎓', label: t.type, value: verifyResult.data.diplomaType }, { icon: '📅', label: t.date, value: verifyResult.data.issueDate }].map((item, i) => (
                        <div key={i} className="icell" style={{ background: d.white }}>
                          <div style={{ fontSize: 10, color: d.mutedL, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>{item.icon} {item.label}</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: d.text }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* HISTORIQUE */}
          {activeTab === 'historique' && (
            <div className="fade-up">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: '1.5rem' }}>
                {[{ label: t.total, value: total, color: '#1d4ed8', bg: d.bluePale, bdr: d.blueMid, icon: '🎓' }, { label: t.month, value: thisMonthCount, color: '#059669', bg: '#ecfdf5', bdr: '#bbf7d0', icon: '📅' }, { label: t.withPDF, value: withPDF, color: '#7c3aed', bg: '#f5f3ff', bdr: '#ddd6fe', icon: '📄' }].map((s, i) => (
                  <div key={i} style={{ background: s.bg, border: `1px solid ${s.bdr}`, borderRadius: 14, padding: '1.1rem 1.3rem', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{s.icon}</div>
                    <div><div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div><div style={{ fontSize: 12, color: d.muted }}>{s.label}</div></div>
                  </div>
                ))}
              </div>
              <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.4rem', borderBottom: `1px solid ${d.borderL}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: d.text }}>📜 {t.listDiplomas} ({filteredHistorique.length})</span>
                  <input
                    type="text"
                    className="gl-input"
                    placeholder={lang === 'ar' ? '🔍 بحث (اسم، CNE، مؤسسة...)' : lang === 'en' ? '🔍 Search (name, CNE, institution...)' : '🔍 Rechercher (nom, CNE, institution...)'}
                    value={historiqueSearch}
                    onChange={e => setHistoriqueSearch(e.target.value)}
                    style={{ maxWidth: 280, marginBottom: 0, fontSize: 13, flex: '1 1 220px' }}
                  />
                </div>
                {total === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem', color: d.mutedL }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.noDiplomas}</div>
                  </div>
                ) : filteredHistorique.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem', color: d.mutedL }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{lang === 'ar' ? 'لا توجد نتائج' : lang === 'en' ? 'No results found' : 'Aucun résultat trouvé'}</div>
                  </div>
                ) : filteredHistorique.map((item, i) => (
                  <div key={i} className="table-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                      <div className="avatar-sm">🎓</div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 13.5, color: d.text }}>{item.studentName}</div>
                        <div style={{ fontSize: 11.5, color: d.muted, marginTop: 2 }}>
                          {item.cne && <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: 4, padding: '1px 6px', marginRight: 4, fontSize: 11, fontWeight: 600 }}>🪪 {item.cne}</span>}
                          <span style={{ background: d.borderL, borderRadius: 4, padding: '1px 6px', marginRight: 4, fontWeight: 600 }}>{item.diplomaType}</span>
                          {item.filiere && <span style={{ background: '#f5f3ff', color: '#7c3aed', borderRadius: 4, padding: '1px 6px', marginRight: 4, fontSize: 11, fontWeight: 600 }}>{item.filiere}</span>}
                          {item.institution} · {item.issueDate}
                        </div>
                        {item.ipfsHash && <div style={{ color: '#7c3aed', fontSize: 11, marginTop: 2 }}>📄 IPFS: {item.ipfsHash.slice(0, 18)}...</div>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <span className="pill pill-green">✓</span>
                      <button onClick={() => navigator.clipboard.writeText(item.id)} style={{ background: d.bluePale, color: '#1d4ed8', border: `1px solid ${d.blueMid}`, borderRadius: 7, padding: '5px 11px', fontSize: 11.5, cursor: 'pointer', fontWeight: 600, width: 'auto', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{t.copy}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADMIN */}
          {activeTab === 'admin' && (
            <div className="fade-up">
              {adminMsg && (
                <div style={{ padding: '11px 16px', borderRadius: 10, marginBottom: '1rem', background: adminMsg.type === 'success' ? '#f0fdf4' : '#fef2f2', color: adminMsg.type === 'success' ? '#15803d' : '#dc2626', borderLeft: `3px solid ${adminMsg.type === 'success' ? '#059669' : '#dc2626'}`, fontSize: 13, fontWeight: 600 }}>
                  {adminMsg.text}
                </div>
              )}
              <div className="card card-accent" style={{ marginBottom: '1.2rem' }}>
                <div style={{ padding: '1.4rem' }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: d.text, marginBottom: 6 }}>🔄 {t.syncTitle}</div>
                  <div style={{ fontSize: 13, color: d.muted, marginBottom: '1rem' }}>{t.syncDesc}</div>
                  {syncResult && (
                    <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: '1rem', background: syncResult.type === 'success' ? '#f0fdf4' : '#fef2f2', color: syncResult.type === 'success' ? '#15803d' : '#dc2626', fontSize: 13 }}>
                      {syncResult.msg}
                    </div>
                  )}
                  <button onClick={handleSync} disabled={syncLoading} className="blue-btn" style={{ fontSize: 13, padding: '10px' }}>
                    {syncLoading ? t.syncing : t.syncBtn}
                  </button>
                </div>
              </div>
              <div className="card card-accent-green" style={{ marginBottom: '1.2rem' }}>
                <div style={{ padding: '1.4rem' }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: d.text, marginBottom: 6 }}>📊 {t.reportTitle}</div>
                  <div style={{ fontSize: 13, color: d.muted, marginBottom: '1rem' }}>{t.reportDesc}</div>
                  {report && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: '1rem' }}>
                      {[{ label: 'Total', val: report.stats.total, color: '#1d4ed8' }, { label: 'Émis', val: report.stats.issued, color: '#059669' }, { label: 'Avec PDF', val: report.stats.with_pdf, color: '#7c3aed' }, { label: 'Ce mois', val: report.stats.this_month, color: '#f59e0b' }].map((s, i) => (
                        <div key={i} style={{ background: d.bg, border: `1px solid ${d.border}`, borderRadius: 10, padding: '10px', textAlign: 'center' }}>
                          <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                          <div style={{ fontSize: 11, color: d.muted }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={loadReport} disabled={reportLoading} className="blue-btn" style={{ fontSize: 13, padding: '10px' }}>
                      {reportLoading ? '⏳...' : t.loadReport}
                    </button>
                    {report && (
                      <button onClick={handlePrintReport} style={{ padding: '10px 16px', border: '1px solid #059669', borderRadius: 10, background: '#f0fdf4', color: '#059669', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', whiteSpace: 'nowrap' }}>
                        {t.printReport}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.4rem', borderBottom: `1px solid ${d.borderL}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: d.text }}>👥 {t.usersTitle} ({users.length})</span>
                  <button onClick={loadUsers} style={{ background: d.bg, border: `1px solid ${d.border}`, borderRadius: 8, padding: '5px 12px', fontSize: 12, cursor: 'pointer', color: d.muted, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {t.refresh}
                  </button>
                </div>
                {usersLoading ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: d.mutedL }}>⏳ Chargement...</div>
                ) : users.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: d.mutedL }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
                    <div>{t.noUsers}</div>
                  </div>
                ) : users.map((u, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 1.4rem', borderBottom: `1px solid ${d.borderL}`, gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: u.role === 'admin' ? '#eff6ff' : u.role === 'student' ? '#f0fdf4' : '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                        {u.role === 'admin' ? '⚙️' : u.role === 'student' ? '🎓' : '🏛️'}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: d.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.full_name}</div>
                        <div style={{ fontSize: 11, color: d.muted }}>{u.email} · {u.role}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <span style={{ background: u.is_verified ? '#dcfce7' : '#fef3c7', color: u.is_verified ? '#15803d' : '#92400e', borderRadius: 100, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
                        {u.is_verified ? t.verified : t.pending}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {showProfil && <Profil onClose={() => setShowProfil(false)} />}
    </div>
  )
}