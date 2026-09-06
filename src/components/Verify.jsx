import { useState, useRef, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { getContract } from '../web3'

const LANGS = {
  fr: {
    verification: 'Vérification', consulter: 'Consulter', profil: 'Profil', historique: 'Historique',
    verDesc: 'Authentifiez un diplôme via son code blockchain',
    consDesc: 'Registre complet des diplômes sur la blockchain',
    profilDesc: 'Informations du compte', histDesc: 'Historique des vérifications',
    logout: 'Déconnexion', employer: 'Employeur',
    hashLabel: 'Code du diplôme (Hash blockchain)',
    verifyBtn: '🔍 Vérifier sur la Blockchain', verifying: '⏳ Vérification...',
    enterCode: '❌ Veuillez entrer le code du diplôme',
    authentic: 'Diplôme Authentique', revoked: 'Diplôme RÉVOQUÉ',
    valid: '✓ Valide', invalid: 'Non valide',
    student: 'Étudiant', cne: 'CNE', institution: 'Institution', type: 'Type de diplôme', date: "Date d'émission",
    loadBtn: '📋 Charger le registre', loading: '⏳ Chargement...',
    total: 'Total diplômes', valides: 'Valides', revoques: 'Révoqués',
    listDiplomas: 'Liste des diplômes', noDiplomas: 'Aucun diplôme sur la blockchain',
    reset: '🔄 Réinitialiser', consulted: 'Diplômes consultés',
    account: 'Informations du compte', security: 'Sécurité',
    oldPw: '🔑 Ancien mot de passe', newPw: '🔒 Nouveau mot de passe',
    confirmPw: '✅ Confirmer', updatePw: '🔒 Mettre à jour',
    member: 'Membre depuis', role: 'Rôle', email: 'Email', name: 'Nom complet',
    reason: '⚠️ Raison: ', immutable: 'Enregistré sur Ethereum · Immuable',
    registre: 'Registre blockchain', registreDesc: 'Accédez au registre complet',
    verCrypto: 'Vérification cryptographique', verCryptoDesc: 'Hash unique et immuable sur Ethereum',
    printBtn: '🖨️ Imprimer le résultat',
    exportBtn: '📧 Copier pour email',
    exportCopied: '✅ Copié!',
    histTotal: 'Total vérifications', histValid: 'Valides', histInvalid: 'Invalides',
    histClear: '🗑️ Effacer', noHist: 'Aucune vérification effectuée',
    searchName: 'Rechercher par nom', searchPlaceholder: 'Ex: Ahmed Benali',
    searchBtn: '🔍 Rechercher', searching: '⏳ Recherche...',
    nameNotFound: 'Aucun résultat pour ce nom',
    scanQR: '📱 Scanner QR Code', scanDesc: 'Cliquez pour activer la caméra',
    todayCount: "Aujourd'hui", weekCount: 'Cette semaine',
    resultCard: '📋 Résultat de vérification',
  },
  ar: {
    verification: 'التحقق', consulter: 'الاستعراض', profil: 'الملف', historique: 'السجل',
    verDesc: 'تحقق من صحة شهادة عبر البلوكتشين',
    consDesc: 'سجل كامل للشهادات', profilDesc: 'معلومات الحساب', histDesc: 'سجل التحققات',
    logout: 'خروج', employer: 'موظِّف',
    hashLabel: 'كود الشهادة (Hash)',
    verifyBtn: '🔍 التحقق', verifying: '⏳ جارٍ...',
    enterCode: '❌ أدخل الكود',
    authentic: 'شهادة أصيلة', revoked: 'شهادة ملغاة',
    valid: '✓ صالحة', invalid: 'غير صالحة',
    student: 'الطالب', cne: 'الرقم الوطني', institution: 'المؤسسة', type: 'النوع', date: 'التاريخ',
    loadBtn: '📋 تحميل السجل', loading: '⏳ جارٍ...',
    total: 'الإجمالي', valides: 'صالحة', revoques: 'ملغاة',
    listDiplomas: 'قائمة الشهادات', noDiplomas: 'لا توجد شهادات',
    reset: '🔄 إعادة', consulted: 'المُستعرضة',
    account: 'المعلومات', security: 'الأمان',
    oldPw: '🔑 القديمة', newPw: '🔒 الجديدة',
    confirmPw: '✅ تأكيد', updatePw: '🔒 تحديث',
    member: 'عضو منذ', role: 'الدور', email: 'البريد', name: 'الاسم',
    reason: '⚠️ السبب: ', immutable: 'مسجّل على Ethereum',
    registre: 'السجل', registreDesc: 'الشهادات على البلوكتشين',
    verCrypto: 'تحقق تشفيري', verCryptoDesc: 'كود فريد وغير قابل للتغيير',
    printBtn: '🖨️ طباعة النتيجة',
    exportBtn: '📧 نسخ للبريد',
    exportCopied: '✅ تم النسخ!',
    histTotal: 'إجمالي التحققات', histValid: 'صالحة', histInvalid: 'غير صالحة',
    histClear: '🗑️ مسح', noHist: 'لا توجد تحققات',
    searchName: 'البحث بالاسم', searchPlaceholder: 'مثال: أحمد بنعلي',
    searchBtn: '🔍 بحث', searching: '⏳ بحث...',
    nameNotFound: 'لا توجد نتائج لهذا الاسم',
    scanQR: '📱 مسح QR Code', scanDesc: 'انقر لتفعيل الكاميرا',
    todayCount: 'اليوم', weekCount: 'هذا الأسبوع',
    resultCard: '📋 نتيجة التحقق',
  },
  en: {
    verification: 'Verification', consulter: 'Browse', profil: 'Profile', historique: 'History',
    verDesc: 'Authenticate a diploma via blockchain',
    consDesc: 'Complete diploma registry', profilDesc: 'Account information', histDesc: 'Verification history',
    logout: 'Logout', employer: 'Employer',
    hashLabel: 'Diploma Code (Hash)',
    verifyBtn: '🔍 Verify on Blockchain', verifying: '⏳ Verifying...',
    enterCode: '❌ Please enter the code',
    authentic: 'Authentic Diploma', revoked: 'REVOKED Diploma',
    valid: '✓ Valid', invalid: 'Invalid',
    student: 'Student', cne: 'CNE', institution: 'Institution', type: 'Type', date: 'Issue Date',
    loadBtn: '📋 Load Registry', loading: '⏳ Loading...',
    total: 'Total', valides: 'Valid', revoques: 'Revoked',
    listDiplomas: 'Diplomas List', noDiplomas: 'No diplomas on blockchain',
    reset: '🔄 Reset', consulted: 'Consulted',
    account: 'Account Info', security: 'Security',
    oldPw: '🔑 Old Password', newPw: '🔒 New Password',
    confirmPw: '✅ Confirm', updatePw: '🔒 Update',
    member: 'Member since', role: 'Role', email: 'Email', name: 'Full Name',
    reason: '⚠️ Reason: ', immutable: 'Registered on Ethereum · Immutable',
    registre: 'Registry', registreDesc: 'Access the complete registry',
    verCrypto: 'Cryptographic Verification', verCryptoDesc: 'Unique and immutable hash',
    printBtn: '🖨️ Print Result',
    exportBtn: '📧 Copy for Email',
    exportCopied: '✅ Copied!',
    histTotal: 'Total', histValid: 'Valid', histInvalid: 'Invalid',
    histClear: '🗑️ Clear', noHist: 'No verifications yet',
    searchName: 'Search by Name', searchPlaceholder: 'Ex: Ahmed Benali',
    searchBtn: '🔍 Search', searching: '⏳ Searching...',
    nameNotFound: 'No results for this name',
    scanQR: '📱 Scan QR Code', scanDesc: 'Click to activate camera',
    todayCount: 'Today', weekCount: 'This week',
    resultCard: '📋 Verification Result',
  }
}

export default function Verify() {
  const [activeTab, setActiveTab] = useState('verification')
  const [lang, setLang] = useState('fr')
  const [darkMode, setDarkMode] = useState(false)
  const t = LANGS[lang]
  const isRTL = lang === 'ar'

  const user = JSON.parse(localStorage.getItem('currentUser') || '{}')
  const initials = user.nom ? user.nom.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'EM'
  const joinDate = user.createdAt || new Date().toLocaleDateString('fr-FR')

  const [hash, setHash] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [exportCopied, setExportCopied] = useState(false)

  const [searchName, setSearchName] = useState('')
  const [searchCNE, setSearchCNE] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchDone, setSearchDone] = useState(false)

  const [verifyHistory, setVerifyHistory] = useState(JSON.parse(localStorage.getItem('verify_history') || '[]'))

  // ✅ خانة البحث في Historique
  const [histSearch, setHistSearch] = useState('')

  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [pwMsg, setPwMsg] = useState(null)

  const [scanning, setScanning] = useState(false)
  const [scannerStarted, setScannerStarted] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const rafRef = useRef(null)

  // ✅ تنظيف الكاميرا عند إغلاق الصفحة/المكوّن
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (streamRef.current) streamRef.current.getTracks().forEach(tr => tr.stop())
    }
  }, [])

  const d = darkMode ? {
    bg: '#0f172a', white: '#1e293b', border: '#334155', borderL: '#1e293b',
    text: '#f1f5f9', muted: '#94a3b8', mutedL: '#64748b',
    bluePale: '#1e3a5f', blueMid: '#1e40af',
  } : {
    bg: '#f8fafc', white: '#ffffff', border: '#e2e8f0', borderL: '#f1f5f9',
    text: '#0f172a', muted: '#64748b', mutedL: '#94a3b8',
    bluePale: '#eff6ff', blueMid: '#dbeafe',
  }

  const now = new Date()
  const todayStr = now.toLocaleDateString('fr-FR')
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay())
  const todayCount = verifyHistory.filter(h => h.date === todayStr).length
  const weekCount = verifyHistory.filter(h => {
    if (!h.date) return false
    const parts = h.date.split('/'); if (parts.length < 3) return false
    const dd = new Date(parts[2], parts[1]-1, parts[0])
    return dd >= weekStart
  }).length
  const validCount   = verifyHistory.filter(h => h.isValid).length
  const invalidCount = verifyHistory.filter(h => !h.isValid).length

  // ✅ قائمة سجل التحققات المُفلترة حسب البحث
  const filteredVerifyHistory = verifyHistory.filter(item => {
    if (!histSearch.trim()) return true
    const q = histSearch.toLowerCase()
    return (
      (item.studentName || '').toLowerCase().includes(q) ||
      (item.cne || '').toLowerCase().includes(q) ||
      (item.institution || '').toLowerCase().includes(q) ||
      (item.diplomaType || '').toLowerCase().includes(q)
    )
  })

  const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .vv { font-family: 'Plus Jakarta Sans', sans-serif; background: ${d.bg}; min-height: 100vh; display: flex; color: ${d.text}; direction: ${isRTL ? 'rtl' : 'ltr'}; }
  .sb { width: 256px; min-height: 100vh; flex-shrink: 0; background: ${d.white}; border-${isRTL ? 'left' : 'right'}: 1px solid ${d.border}; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; }
  .sb-user { padding: 1.4rem 1.2rem; border-bottom: 1px solid ${d.borderL}; cursor: pointer; }
  .av { width: 42px; height: 42px; border-radius: 12px; background: linear-gradient(135deg, #059669, #3b82f6); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; color: white; flex-shrink: 0; }
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
  .sb-bottom { padding: 0.8rem 0.75rem 1.2rem; border-top: 1px solid ${d.borderL}; }
  .logout-b { width: 100%; padding: 9px; border-radius: 10px; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 7px; font-family: 'Plus Jakarta Sans', sans-serif; }
  .main { flex: 1; background: ${d.bg}; overflow-y: auto; min-width: 0; }
  .topbar { background: ${d.white}; border-bottom: 1px solid ${d.border}; padding: 0 2.5rem; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 20; }
  .topbar-badge { display: flex; align-items: center; gap: 7px; background: ${d.bluePale}; border: 1px solid ${d.blueMid}; border-radius: 100px; padding: 6px 14px; }
  .card { background: ${d.white}; border: 1px solid ${d.border}; border-radius: 16px; overflow: hidden; }
  .card-accent::before { content: ''; display: block; height: 3px; background: linear-gradient(90deg, #1d4ed8, #3b82f6); }
  .card-accent-green::before { content: ''; display: block; height: 3px; background: linear-gradient(90deg, #059669, #10b981); }
  .card-accent-red::before { content: ''; display: block; height: 3px; background: linear-gradient(90deg, #dc2626, #f87171); }
  .card-accent-purple::before { content: ''; display: block; height: 3px; background: linear-gradient(90deg, #7c3aed, #8b5cf6); }
  .card-accent-amber::before { content: ''; display: block; height: 3px; background: linear-gradient(90deg, #f59e0b, #fbbf24); }
  .gl-label { display: block; font-size: 11.5px; font-weight: 700; color: ${d.muted}; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 7px; }
  .gl-input { width: 100%; padding: 11px 14px; background: ${d.bg}; border: 1.5px solid ${d.border}; border-radius: 10px; color: ${d.text}; font-size: 13.5px; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; }
  .gl-input::placeholder { color: ${d.mutedL}; }
  .gl-input:focus { border-color: #3b82f6; background: ${d.white}; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
  .blue-btn { width: 100%; padding: 13px; border: none; border-radius: 12px; cursor: pointer; font-size: 14.5px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; color: white; background: linear-gradient(135deg, #1d4ed8, #3b82f6); transition: all 0.2s; }
  .blue-btn:hover:not(:disabled) { transform: translateY(-1px); }
  .blue-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .action-btn { width: 100%; padding: 11px; border-radius: 10px; cursor: pointer; font-size: 13px; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 8px; }
  .table-row { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.4rem; border-bottom: 1px solid ${d.borderL}; gap: 12px; }
  .table-row:hover { background: ${d.bg}; }
  .icell { background: ${d.bg}; border: 1px solid ${d.border}; border-radius: 12px; padding: 13px 15px; }
  .pill { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; }
  .pill-green { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
  .pill-red { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .pw-input { width:100%; padding:10px 42px 10px 14px; background:${d.bg}; border:1.5px solid ${d.border}; border-radius:10px; color:${d.text}; font-size:13.5px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; box-sizing:border-box; }
  .pw-input:focus { border-color:#3b82f6; background:${d.white}; }
  .profil-save-btn { width:100%; padding:13px; border:none; border-radius:12px; background:linear-gradient(135deg,#1d4ed8,#3b82f6); color:white; font-size:14px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; cursor:pointer; }
  .profil-info-card { border:1px solid ${d.border}; border-radius:14px; overflow:hidden; margin-bottom:1rem; }
  .profil-info-card-header { padding:11px 16px; background:${d.bg}; border-bottom:1px solid ${d.border}; display:flex; align-items:center; gap:8px; }
  .profil-info-row { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-bottom:1px solid ${d.borderL}; }
  .profil-info-row:last-child { border-bottom:none; }
  .lang-btn { padding: 5px 10px; border-radius: 8px; border: 1px solid ${d.border}; background: ${d.bg}; color: ${d.text}; font-size: 12px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
  .lang-btn.active-lang { background: #1d4ed8; color: white; border-color: #1d4ed8; }
  .dark-toggle { width: 42px; height: 24px; border-radius: 12px; border: none; cursor: pointer; position: relative; background: ${darkMode ? '#1d4ed8' : d.border}; }
  .dark-toggle-dot { position: absolute; top: 3px; width: 18px; height: 18px; border-radius: 50%; background: white; transition: left 0.2s; left: ${darkMode ? '21px' : '3px'}; }
  .main::-webkit-scrollbar { width: 4px; }
  .main::-webkit-scrollbar-thumb { background: ${d.border}; border-radius: 4px; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .fade-up { animation: fadeUp 0.4s ease forwards; }
  @media print {
    .sb, .topbar, .action-btn, .blue-btn, .lang-btn, .dark-toggle, .logout-b { display: none !important; }
    .main { overflow: visible !important; }
  }
  `

  const tabs = [
    { key: 'verification', icon: '🔍', label: t.verification },
    { key: 'historique',   icon: '📜', label: t.historique   },
    { key: 'profil',       icon: '👤', label: t.profil       },
  ]

  // ✅ التحقق بـ Hash — يجلب CNE من PostgreSQL
  async function handleVerify() {
    if (!hash) { setResult({ type: 'error', msg: t.enterCode }); return }
    try {
      setLoading(true)
      const { web3, contract } = await getContract()
      let diplomaId = hash
      if (!hash.startsWith('0x') || hash.length !== 66) diplomaId = web3.utils.keccak256(hash)
      const data = await contract.methods.verifyDiploma(diplomaId).call()
      if (data.isValid && data.studentName !== '') {
        const issueDate = data.issueDate ? new Date(Number(data.issueDate) * 1000).toLocaleDateString('fr-FR') : '—'

        // ✅ جلب CNE من PostgreSQL
        let cneValue = '—'
        try {
          const dbRes = await fetch(`http://localhost:5000/api/diplomas/verify/${diplomaId}`)
          const dbData = await dbRes.json()
          if (dbData.success && dbData.diploma?.cne) {
            cneValue = dbData.diploma.cne
          }
        } catch (e) { /* تجاهل خطأ الجلب */ }

        const res = {
          type: data.isRevoked ? 'error' : 'success',
          data: {
            studentName: data.studentName,
            cne: cneValue,
            institution: data.institution,
            diplomaType: data.diplomaType,
            issueDate,
            isRevoked: data.isRevoked,
            revokeReason: data.revokeReason || '',
            ipfsHash: data.ipfsHash || ''
          }
        }
        setResult(res)
        const entry = { hash: hash.slice(0, 20) + '...', studentName: data.studentName, cne: cneValue, institution: data.institution, diplomaType: data.diplomaType, issueDate, isValid: !data.isRevoked, date: new Date().toLocaleDateString('fr-FR'), time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
        const prev = JSON.parse(localStorage.getItem('verify_history') || '[]')
        const updated = [entry, ...prev].slice(0, 50)
        localStorage.setItem('verify_history', JSON.stringify(updated))
        setVerifyHistory(updated)
      } else {
        setResult({ type: 'error', msg: '❌ Diplôme invalide ou introuvable' })
        const entry = { hash: hash.slice(0, 20) + '...', studentName: '—', cne: '—', institution: '—', diplomaType: '—', issueDate: '—', isValid: false, date: new Date().toLocaleDateString('fr-FR'), time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
        const prev = JSON.parse(localStorage.getItem('verify_history') || '[]')
        const updated = [entry, ...prev].slice(0, 50)
        localStorage.setItem('verify_history', JSON.stringify(updated))
        setVerifyHistory(updated)
      }
    } catch (err) { setResult({ type: 'error', msg: '❌ ' + err.message }) }
    finally { setLoading(false) }
  }

  async function handleSearchByName() {
    if (!searchName.trim() && !searchCNE.trim()) return
    try {
      setSearchLoading(true); setSearchResults([]); setSearchDone(false)
      if (searchCNE.trim()) {
        const res = await fetch(`http://localhost:5000/api/diplomas/cne/${searchCNE.trim()}`)
        const data = await res.json()
        if (data.success && data.diplomas.length > 0) {
          const found = data.diplomas.map(dd => ({
            id: dd.blockchain_hash,
            studentName: dd.student_name,
            cne: dd.cne,
            institution: dd.institution_name,
            diplomaType: dd.diploma_title,
            issueDate: dd.graduation_date ? new Date(dd.graduation_date).toLocaleDateString('fr-FR') : '—',
            isRevoked: dd.status === 'revoked'
          }))
          setSearchResults(found)
        }
        setSearchDone(true)
        setSearchLoading(false)
        return
      }
      const { contract } = await getContract()
      const total = await contract.methods.getTotalDiplomas().call()
      const found = []
      for (let i = 0; i < Number(total); i++) {
        const id = await contract.methods.getDiplomaByIndex(i).call()
        const data = await contract.methods.verifyDiploma(id).call()
        const matchName = searchName.trim() === '' || data.studentName.toLowerCase().includes(searchName.toLowerCase())
        if (matchName) {
          found.push({ id, studentName: data.studentName, cne: '—', institution: data.institution, diplomaType: data.diplomaType, issueDate: data.issueDate ? new Date(Number(data.issueDate)*1000).toLocaleDateString('fr-FR') : '—', isRevoked: data.isRevoked })
        }
      }
      setSearchResults(found); setSearchDone(true)
    } catch (err) { alert('Erreur: ' + err.message) }
    finally { setSearchLoading(false) }
  }

  function handlePrint() { window.print() }

  function handleExport() {
    if (!result?.data) return
    const text = `📋 ${t.resultCard}\n\n👤 ${t.student}: ${result.data.studentName}\n🪪 ${t.cne}: ${result.data.cne}\n🏛️ ${t.institution}: ${result.data.institution}\n🎓 ${t.type}: ${result.data.diplomaType}\n📅 ${t.date}: ${result.data.issueDate}\n✅ ${t.valid}\n\n🔗 Vérifié sur DiploChain`
    navigator.clipboard.writeText(text)
    setExportCopied(true); setTimeout(() => setExportCopied(false), 2000)
  }

  // ✅ معالجة مشتركة للكود الممسوح (كاميرا أو صورة)
  async function processScannedHash(decodedText) {
    const scannedHash = decodedText.includes('hash=') ? decodedText.split('hash=')[1] : decodedText
    setHash(scannedHash)
    try {
      const { web3, contract } = await getContract()
      let diplomaId = scannedHash
      if (!scannedHash.startsWith('0x') || scannedHash.length !== 66) diplomaId = web3.utils.keccak256(scannedHash)
      const data = await contract.methods.verifyDiploma(diplomaId).call()
      if (data.isValid && data.studentName !== '') {
        const issueDate = data.issueDate ? new Date(Number(data.issueDate) * 1000).toLocaleDateString('fr-FR') : '—'
        let cneValue = '—'
        try {
          const dbRes = await fetch(`http://localhost:5000/api/diplomas/verify/${diplomaId}`)
          const dbData = await dbRes.json()
          if (dbData.success && dbData.diploma?.cne) cneValue = dbData.diploma.cne
        } catch (e) {}
        setResult({ type: data.isRevoked ? 'error' : 'success', data: { studentName: data.studentName, cne: cneValue, institution: data.institution, diplomaType: data.diplomaType, issueDate, isRevoked: data.isRevoked, revokeReason: data.revokeReason || '', ipfsHash: data.ipfsHash || '' } })
      } else {
        setResult({ type: 'error', msg: '❌ Diplôme invalide ou introuvable' })
      }
    } catch (err) { setResult({ type: 'error', msg: '❌ ' + err.message }) }
  }

  // ✅ إيقاف الكاميرا وتنظيف الموارد
  function stopCamera() {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    if (streamRef.current) { streamRef.current.getTracks().forEach(tr => tr.stop()); streamRef.current = null }
    setScanning(false); setScannerStarted(false)
  }

  // ✅ مسح الكاميرا بـ jsQR — أكثر فعالية لمسح QR من شاشة هاتف
  async function handleScanQR() {
    if (scannerStarted) { stopCamera(); return }
    try {
      setScanning(true); setScannerStarted(true)
      const jsQRModule = await import('jsqr')
      const jsQR = jsQRModule.default

      let stream
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { min: 640, ideal: 1920, max: 1920 },
            height: { min: 480, ideal: 1080, max: 1080 }
          }
        })
      } catch (e) {
        // ✅ fallback: si pas de caméra arrière (laptop), utiliser n'importe quelle caméra
        stream = await navigator.mediaDevices.getUserMedia({ video: true })
      }

      streamRef.current = stream
      const video = videoRef.current
      video.srcObject = stream
      await video.play()

      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d', { willReadFrequently: true })

      let lastScanTime = 0
      const scanFrame = () => {
        if (!streamRef.current) return
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const now = Date.now()
          // ✅ مسح كل ~80ms بدل كل فريم لتقليل الحمل وتحسين الدقة
          if (now - lastScanTime > 80) {
            lastScanTime = now
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'attemptBoth' })
            if (code && code.data) {
              stopCamera()
              processScannedHash(code.data)
              return
            }
          }
        }
        rafRef.current = requestAnimationFrame(scanFrame)
      }
      rafRef.current = requestAnimationFrame(scanFrame)
    } catch (err) {
      setScanning(false); setScannerStarted(false)
      alert('❌ Erreur caméra: ' + err.message + '\n\nVérifiez que vous avez autorisé l\'accès à la caméra dans le navigateur.')
    }
  }

  // ✅ مسح QR Code من صورة مرفوعة (أكثر موثوقية من الكاميرا على اللابتوب)
  async function handleScanFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      const scanner = new Html5Qrcode('qr-reader-file')
      const decodedText = await scanner.scanFile(file, false)
      await processScannedHash(decodedText)
    } catch (err) {
      alert('❌ Aucun QR Code détecté dans cette image')
    } finally {
      e.target.value = ''
    }
  }

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

  function handleChangePw() {
    setPwMsg(null)
    if (!oldPw || !newPw || !confirmPw) { setPwMsg({ type: 'error', text: 'Veuillez remplir tous les champs.' }); return }
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const idx = users.findIndex(u => u.email === user.email)
    if (idx === -1 || users[idx].password !== oldPw) { setPwMsg({ type: 'error', text: 'Ancien mot de passe incorrect.' }); return }
    if (newPw.length < 4) { setPwMsg({ type: 'error', text: 'Minimum 4 caractères.' }); return }
    if (newPw !== confirmPw) { setPwMsg({ type: 'error', text: 'Les mots de passe ne correspondent pas.' }); return }
    users[idx].password = newPw; localStorage.setItem('users', JSON.stringify(users)); localStorage.setItem('currentUser', JSON.stringify({ ...user, password: newPw }))
    setPwMsg({ type: 'success', text: '✅ Mot de passe modifié!' }); setOldPw(''); setNewPw(''); setConfirmPw('')
  }

  const pwField = (label, val, setter, show, setShow, ph) => (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: d.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input type={show ? 'text' : 'password'} className="pw-input" placeholder={ph} value={val} onChange={e => { setter(e.target.value); setPwMsg(null) }} />
        <button onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#94a3b8' }}>
          {show ? '🙈' : '👁️'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="vv">
      <style>{CSS}</style>

      <aside className="sb">
        <div className="sb-user" onClick={() => setActiveTab('profil')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="av">{initials}</div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: d.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.nom || t.employer}</div>
              <div style={{ fontSize: 11, color: d.mutedL }}>{user.email}</div>
            </div>
            <span style={{ fontSize: 12, color: d.mutedL }}>›</span>
          </div>
        </div>
        <div className="sb-brand">
          <div className="sb-brand-icon">🎓</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: d.text }}>Diplo<span style={{ color: '#1d4ed8' }}>Chain</span></div>
            <div style={{ fontSize: 10, color: d.mutedL, fontWeight: 600, textTransform: 'uppercase' }}>{t.employer}</div>
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
        </div>
        <div className="sb-bottom">
          <div style={{ background: '#ecfdf5', border: '1px solid #bbf7d0', borderRadius: 12, padding: '12px 14px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🔍</div>
            <div>
              <div style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>{t.histTotal}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#047857' }}>{verifyHistory.length}</div>
            </div>
          </div>
          <button className="logout-b" onClick={() => { localStorage.removeItem('role'); localStorage.removeItem('currentUser'); window.location.href = '/'; }}>
            <span>🚪</span> {t.logout}
          </button>
        </div>
      </aside>

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

        <div style={{ padding: '1.6rem 2.5rem 0' }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: d.text }}>{tabs.find(tab => tab.key === activeTab)?.icon} {tabs.find(tab => tab.key === activeTab)?.label}</h1>
          <p style={{ fontSize: 13, color: d.muted, marginTop: 3 }}>
            {activeTab === 'verification' ? t.verDesc : activeTab === 'historique' ? t.histDesc : t.profilDesc}
          </p>
        </div>

        <div style={{ padding: '1.5rem 2.5rem 3rem', maxWidth: 700 }}>

          {/* VERIFICATION */}
          {activeTab === 'verification' && (
            <div className="fade-up">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: '1.5rem' }}>
                {[
                  { icon: '🔍', label: t.histTotal,  val: verifyHistory.length, color: '#1d4ed8', bg: d.bluePale, bdr: d.blueMid },
                  { icon: '📅', label: t.todayCount, val: todayCount,           color: '#059669', bg: '#ecfdf5',  bdr: '#bbf7d0' },
                  { icon: '📆', label: t.weekCount,  val: weekCount,            color: '#7c3aed', bg: '#f5f3ff',  bdr: '#ddd6fe' },
                  { icon: '✅', label: t.histValid,  val: validCount,           color: '#059669', bg: '#ecfdf5',  bdr: '#bbf7d0' },
                ].map((s, i) => (
                  <div key={i} style={{ background: s.bg, border: `1px solid ${s.bdr}`, borderRadius: 12, padding: '0.9rem 1rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
                      <div style={{ fontSize: 10, color: d.muted, marginTop: 2 }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: '1.2rem' }}>
                <div className="card card-accent">
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.2rem', paddingBottom: '1rem', borderBottom: `1px solid ${d.borderL}` }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: d.bluePale, border: `1px solid ${d.blueMid}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🔐</div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: d.text }}>{t.verCrypto}</div>
                    </div>
                    <label className="gl-label">🔑 {t.hashLabel}</label>
                    <input className="gl-input" placeholder="0x..." value={hash} onChange={e => { setHash(e.target.value); setResult(null) }} style={{ fontFamily: 'monospace', marginBottom: '1rem', fontSize: 12 }} />
                    <button className="blue-btn" onClick={handleVerify} disabled={loading} style={{ fontSize: 13, padding: '11px' }}>
                      {loading ? '⏳...' : t.verifyBtn}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="card card-accent-purple" style={{ flex: 1 }}>
                    <div style={{ padding: '1.2rem' }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: d.text, marginBottom: '0.8rem' }}>👤 {t.searchName}</div>
                      <input className="gl-input" placeholder={t.searchPlaceholder} value={searchName} onChange={e => { setSearchName(e.target.value); setSearchDone(false) }} style={{ marginBottom: '0.6rem', fontSize: 13 }} />
                      <input className="gl-input" placeholder="🪪 CNE (Ex: R123456789)" value={searchCNE} onChange={e => { setSearchCNE(e.target.value); setSearchDone(false) }} style={{ marginBottom: '0.8rem', fontSize: 13 }} />
                      <button className="blue-btn" onClick={handleSearchByName} disabled={searchLoading} style={{ fontSize: 13, padding: '10px', background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)' }}>
                        {searchLoading ? t.searching : t.searchBtn}
                      </button>
                      {searchDone && searchResults.length === 0 && (
                        <div style={{ fontSize: 12, color: '#dc2626', marginTop: 8, textAlign: 'center' }}>❌ {t.nameNotFound}</div>
                      )}
                      {searchResults.map((item, i) => (
                        <div key={i} style={{ marginTop: 8, padding: '10px 12px', background: '#f0fdf4', borderRadius: 10, border: '1px solid #bbf7d0' }}>
                          <div style={{ fontWeight: 700, fontSize: 12, color: '#059669' }}>{item.studentName}</div>
                          {item.cne && item.cne !== '—' && <div style={{ fontSize: 11, color: '#92400e', background: '#fef3c7', borderRadius: 4, padding: '1px 6px', display: 'inline-block', marginBottom: 3 }}>🪪 {item.cne}</div>}
                          <div style={{ fontSize: 11, color: d.muted }}>{item.diplomaType} · {item.institution} · {item.issueDate}</div>
                          <div style={{ fontSize: 10, fontFamily: 'monospace', color: d.mutedL, marginTop: 4 }}>{item.id?.slice(0, 20)}...</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card card-accent-amber">
                    <div style={{ padding: '1.2rem' }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: d.text, marginBottom: '0.8rem' }}>{t.scanQR}</div>
                      <div style={{ fontSize: 12, color: d.muted, marginBottom: '0.8rem' }}>{t.scanDesc}</div>
                      <div style={{ width: '100%', borderRadius: 10, overflow: 'hidden', marginBottom: scanning ? 10 : 0, display: scanning ? 'block' : 'none', position: 'relative', background: '#000' }}>
                        <video ref={videoRef} muted playsInline style={{ width: '100%', display: 'block', borderRadius: 10 }} />
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '70%', aspectRatio: '1', border: '3px solid #f59e0b', borderRadius: 12, boxShadow: '0 0 0 2000px rgba(0,0,0,0.35)' }} />
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                      </div>
                      {scanning && (
                        <div style={{ fontSize: 11.5, color: '#92400e', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 8, padding: '8px 10px', marginBottom: 8, lineHeight: 1.6 }}>
                          📷 <strong>{lang === 'ar' ? 'نصائح:' : lang === 'en' ? 'Tips:' : 'Conseils :'}</strong>
                          {(lang === 'ar'
                            ? ['ضع QR Code داخل المربع بالكامل', 'ثبّت الهاتف على 15-20 سم من الكاميرا', 'رفع سطوع شاشة الهاتف للأقصى']
                            : lang === 'en'
                            ? ['Fill the square with the QR Code', 'Hold the phone 15-20cm from the camera', 'Set phone brightness to maximum']
                            : ['Remplissez le carré avec le QR Code', 'Tenez le téléphone à 15-20cm de la caméra', 'Mettez la luminosité du téléphone au max']
                          ).map((tip, i) => <div key={i}>• {tip}</div>)}
                        </div>
                      )}
                      <button className="blue-btn" onClick={handleScanQR} style={{ fontSize: 13, padding: '10px', background: scanning ? 'linear-gradient(135deg, #dc2626, #f87171)' : 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: 'white', marginBottom: 8 }}>
                        {scanning ? '⏹️ Arrêter le scan' : t.scanQR}
                      </button>
                      <div style={{ textAlign: 'center', fontSize: 11, color: d.mutedL, margin: '6px 0' }}>— {lang === 'ar' ? 'أو' : lang === 'en' ? 'or' : 'ou'} —</div>
                      <input type="file" accept="image/*" id="qr-file-input" style={{ display: 'none' }} onChange={handleScanFile} />
                      <button className="blue-btn" onClick={() => document.getElementById('qr-file-input').click()} style={{ fontSize: 13, padding: '10px', background: d.bg, color: '#1d4ed8', border: `1.5px solid ${d.blueMid}` }}>
                        📁 {lang === 'ar' ? 'استيراد صورة QR Code' : lang === 'en' ? 'Upload QR Code image' : 'Importer une image QR Code'}
                      </button>
                      <div id="qr-reader-file" style={{ display: 'none' }} />
                    </div>
                  </div>
                </div>
              </div>

              {result && !result.data && (
                <div style={{ padding: '12px 16px', borderRadius: 10, background: '#fef2f2', color: '#dc2626', borderLeft: '3px solid #dc2626', fontSize: 13.5 }}>{result.msg}</div>
              )}

              {result?.data && (
                <div className="fade-up">
                  <div style={{ borderRadius: 14, overflow: 'hidden', border: `1px solid ${result.data.isRevoked ? '#fecaca' : '#bbf7d0'}`, marginBottom: '1rem' }}>
                    <div style={{ padding: '14px 18px', background: result.data.isRevoked ? '#fef2f2' : '#f0fdf4', borderBottom: `1px solid ${result.data.isRevoked ? '#fecaca' : '#bbf7d0'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 20 }}>{result.data.isRevoked ? '🚫' : '✅'}</span>
                        <span style={{ fontWeight: 700, color: result.data.isRevoked ? '#dc2626' : '#15803d', fontSize: 15 }}>
                          {result.data.isRevoked ? t.revoked : t.authentic}
                        </span>
                      </div>
                      <span className={`pill ${result.data.isRevoked ? 'pill-red' : 'pill-green'}`}>
                        {result.data.isRevoked ? t.invalid : t.valid}
                      </span>
                    </div>

                    {/* ✅ البطاقات مع CNE */}
                    <div style={{ padding: '1.1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, background: d.white }}>
                      {[
                        { icon: '👤', label: t.student,     value: result.data.studentName },
                        { icon: '🪪', label: t.cne,         value: result.data.cne || '—'  },
                        { icon: '🏛️', label: t.institution, value: result.data.institution },
                        { icon: '🎓', label: t.type,        value: result.data.diplomaType },
                        { icon: '📅', label: t.date,        value: result.data.issueDate,  },
                      ].map((item, i) => (
                        <div key={i} className="icell" style={item.label === t.cne ? { background: '#fef3c7', border: '1px solid #fde68a' } : {}}>
                          <div style={{ fontSize: 10, color: item.label === t.cne ? '#92400e' : d.mutedL, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>{item.icon} {item.label}</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: item.label === t.cne ? '#92400e' : d.text }}>{item.value}</div>
                        </div>
                      ))}
                    </div>

                    {!result.data.isRevoked && (
                      <div style={{ padding: '10px 18px', background: '#f0fdf4', borderTop: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>⛓️</span>
                        <span style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>{t.immutable}</span>
                      </div>
                    )}
                    {result.data.ipfsHash && (
                      <div style={{ padding: '10px 18px', background: '#f5f3ff', borderTop: '1px solid #ddd6fe', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span>📄</span>
                          <span style={{ fontSize: 12, color: '#7c3aed', fontWeight: 600 }}>PDF disponible sur IPFS</span>
                        </div>
                        <button onClick={() => window.open(`https://ipfs.io/ipfs/${result.data.ipfsHash}`, '_blank')} style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: 8, padding: '5px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                          📄 Voir PDF
                        </button>
                      </div>
                    )}
                    {!result.data.isRevoked && hash && (
                      <div style={{ padding: '1.2rem 1.4rem', borderTop: `1px solid ${d.borderL}`, textAlign: 'center' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: d.muted, marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>🔲 QR Code — Scannez pour vérifier</div>
                        <div id="verify-qr-svg" style={{ display: 'inline-block', background: 'white', padding: 12, borderRadius: 12, border: `1px solid ${d.border}` }}>
                          <QRCodeSVG value={hash} size={140} bgColor="white" fgColor="#1d4ed8" level="H" />
                        </div>
                        <div style={{ fontSize: 10, color: d.mutedL, marginTop: 6, fontFamily: 'monospace', wordBreak: 'break-all', padding: '0 1rem' }}>
                          {hash.slice(0, 30)}...
                        </div>
                        <div style={{ marginTop: 10 }}>
                          <button onClick={() => downloadQRCode('verify-qr-svg', hash)} style={{ background: d.bluePale, color: '#1d4ed8', border: `1.5px solid ${d.blueMid}`, borderRadius: 8, padding: '7px 16px', fontSize: 12, cursor: 'pointer', fontWeight: 700, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                            ⬇️ {lang === 'ar' ? 'تحميل QR Code' : lang === 'en' ? 'Download QR Code' : 'Télécharger le QR Code'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="card" style={{ padding: '1.2rem' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: d.text, marginBottom: '1rem' }}>⚡ Actions</div>
                    <button className="action-btn" onClick={handlePrint} style={{ background: '#f0fdf4', color: '#059669', border: '1px solid #bbf7d0' }}>{t.printBtn}</button>
                    <button className="action-btn" onClick={handleExport} style={{ background: d.bluePale, color: '#1d4ed8', border: `1px solid ${d.blueMid}`, marginBottom: 0 }}>
                      {exportCopied ? t.exportCopied : t.exportBtn}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HISTORIQUE */}
          {activeTab === 'historique' && (
            <div className="fade-up">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: '1.5rem' }}>
                {[
                  { icon: '🔍', label: t.histTotal,   val: verifyHistory.length, color: '#1d4ed8', bg: d.bluePale, bdr: d.blueMid },
                  { icon: '📅', label: t.todayCount,  val: todayCount,           color: '#7c3aed', bg: '#f5f3ff',  bdr: '#ddd6fe' },
                  { icon: '✅', label: t.histValid,   val: validCount,           color: '#059669', bg: '#ecfdf5',  bdr: '#bbf7d0' },
                  { icon: '❌', label: t.histInvalid, val: invalidCount,         color: '#dc2626', bg: '#fef2f2',  bdr: '#fecaca' },
                ].map((s, i) => (
                  <div key={i} style={{ background: s.bg, border: `1px solid ${s.bdr}`, borderRadius: 12, padding: '0.9rem 1rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.val}</div>
                      <div style={{ fontSize: 10, color: d.muted }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.4rem', borderBottom: `1px solid ${d.borderL}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: d.text }}>📜 {t.histDesc} ({filteredVerifyHistory.length})</span>
                  <input
                    type="text"
                    className="gl-input"
                    placeholder={lang === 'ar' ? '🔍 بحث (اسم، CNE، مؤسسة...)' : lang === 'en' ? '🔍 Search (name, CNE, institution...)' : '🔍 Rechercher (nom, CNE, institution...)'}
                    value={histSearch}
                    onChange={e => setHistSearch(e.target.value)}
                    style={{ maxWidth: 280, marginBottom: 0, fontSize: 13, flex: '1 1 220px' }}
                  />
                </div>
                {verifyHistory.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: d.mutedL }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.noHist}</div>
                  </div>
                ) : filteredVerifyHistory.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: d.mutedL }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{lang === 'ar' ? 'لا توجد نتائج' : lang === 'en' ? 'No results found' : 'Aucun résultat trouvé'}</div>
                  </div>
                ) : filteredVerifyHistory.map((item, i) => (
                  <div key={i} className="table-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: item.isValid ? '#f0fdf4' : '#fef2f2', border: `1px solid ${item.isValid ? '#bbf7d0' : '#fecaca'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                        {item.isValid ? '✅' : '❌'}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: d.text }}>{item.studentName === '—' ? item.hash : item.studentName}</div>
                        <div style={{ fontSize: 11, color: d.muted, marginTop: 2 }}>
                          {item.cne && item.cne !== '—' && <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: 4, padding: '1px 5px', marginRight: 4, fontWeight: 600 }}>🪪 {item.cne}</span>}
                          {item.diplomaType !== '—' && <span style={{ background: d.borderL, borderRadius: 4, padding: '1px 5px', marginRight: 4, fontWeight: 600 }}>{item.diplomaType}</span>}
                          {item.institution !== '—' && item.institution} {item.issueDate !== '—' && `· ${item.issueDate}`}
                        </div>
                        <div style={{ fontSize: 10.5, color: d.mutedL, marginTop: 2 }}>🕐 {item.date} {item.time}</div>
                      </div>
                    </div>
                    <span className={`pill ${item.isValid ? 'pill-green' : 'pill-red'}`}>
                      {item.isValid ? '✓ ' + t.valid : '❌ ' + t.invalid}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROFIL */}
          {activeTab === 'profil' && (
            <div className="fade-up">
              <div style={{ background: 'linear-gradient(135deg, #059669, #10b981)', borderRadius: 16, padding: '2rem', marginBottom: '1.2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: -30, top: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, position: 'relative', zIndex: 1 }}>
                  <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(255,255,255,0.25)', border: '2.5px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: 'white', flexShrink: 0 }}>{initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: 'white', fontSize: 22 }}>{user.nom || t.employer}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 3 }}>{user.email}</div>
                    <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                      <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: 100, padding: '4px 12px', fontSize: 11, fontWeight: 700 }}>🔍 {t.employer}</span>
                      <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: 100, padding: '4px 12px', fontSize: 11, fontWeight: 700 }}>✅ Actif</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: '1.2rem' }}>
                {[
                  { icon: '🔍', label: t.histTotal,  val: verifyHistory.length,                    color: '#1d4ed8', bg: d.bluePale, bdr: d.blueMid },
                  { icon: '✅', label: t.histValid,  val: verifyHistory.filter(h => h.isValid).length,  color: '#059669', bg: '#ecfdf5', bdr: '#bbf7d0' },
                  { icon: '❌', label: t.histInvalid,val: verifyHistory.filter(h => !h.isValid).length, color: '#dc2626', bg: '#fef2f2', bdr: '#fecaca' },
                ].map((s, i) => (
                  <div key={i} style={{ background: s.bg, border: `1px solid ${s.bdr}`, borderRadius: 12, padding: '1rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                      <div style={{ fontSize: 11, color: d.muted }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="profil-info-card" style={{ marginBottom: '1.2rem' }}>
                <div className="profil-info-card-header">
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👤</div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: d.text }}>{t.account}</span>
                </div>
                {[
                  { icon: '👤', label: t.name,     value: user.nom   || '—' },
                  { icon: '📧', label: t.email,    value: user.email || '—' },
                  { icon: '🎭', label: t.role,     value: t.employer        },
                  { icon: '📅', label: t.member,   value: joinDate          },
                  { icon: '🔍', label: t.histTotal, value: `${verifyHistory.length} vérifications` },
                ].map((row, i) => (
                  <div key={i} className="profil-info-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, color: d.mutedL, textTransform: 'uppercase' }}>
                      <span>{row.icon}</span> {row.label}
                    </div>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: d.text }}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="card card-accent">
                <div style={{ padding: '1.2rem 1.6rem', borderBottom: `1px solid ${d.borderL}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: d.bluePale, border: `1px solid ${d.blueMid}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🔒</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: d.text }}>{t.security}</div>
                    <div style={{ fontSize: 12, color: d.muted, marginTop: 2 }}>Modifier votre mot de passe</div>
                  </div>
                </div>
                <div style={{ padding: '1.4rem' }}>
                  {pwMsg && (
                    <div style={{ marginBottom: '1rem', padding: '11px 14px', borderRadius: 10, background: pwMsg.type === 'success' ? '#f0fdf4' : '#fef2f2', color: pwMsg.type === 'success' ? '#15803d' : '#dc2626', borderLeft: `3px solid ${pwMsg.type === 'success' ? '#22c55e' : '#ef4444'}`, fontSize: 13, fontWeight: 600 }}>
                      {pwMsg.text}
                    </div>
                  )}
                  {pwField(t.oldPw, oldPw, setOldPw, showOld, setShowOld, '••••••••')}
                  {pwField(t.newPw, newPw, setNewPw, showNew, setShowNew, '••••••••')}
                  {pwField(t.confirmPw, confirmPw, setConfirmPw, showConf, setShowConf, '••••••••')}
                  <button className="profil-save-btn" onClick={handleChangePw}>{t.updatePw}</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
