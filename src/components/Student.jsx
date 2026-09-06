import { useState, useEffect } from 'react'
import { getContract } from '../web3'
import { QRCodeSVG } from 'qrcode.react'

const LANGS = {
  fr: {
    diplome: 'Mes Diplômes', historique: 'Historique', profil: 'Mon Profil', logout: 'Déconnexion',
    verifyTitle: 'Vérification de diplôme', verifyDesc: 'Entrez votre CNE pour voir vos diplômes',
    cne: 'CNE (Code National Étudiant)', name: 'Nom complet', institution: 'Institution',
    diplomaType: 'Type de diplôme', selectType: '— Sélectionnez —',
    verifyBtn: '🔍 Vérifier mon diplôme', verifying: 'Recherche en cours...',
    fillFields: 'Veuillez remplir tous les champs y compris le CNE',
    notFound: 'Diplôme introuvable', notFoundDesc: "Aucun diplôme ne correspond. Vérifiez l'orthographe.",
    accepted: 'Accepté', revoked: 'Révoqué', valid: '✓ Valide', invalid: '🚫 Non valide',
    issueDate: "Date d'émission", verifiedAt: 'Vérifié le', status: 'Statut du diplôme',
    immutable: 'Enregistré sur Ethereum · Immuable',
    totalVerif: 'Total', found: 'Trouvés', notFoundStat: 'Introuvables',
    histTitle: 'Historique', noHistory: 'Aucune vérification',
    noHistDesc: 'Vos vérifications apparaîtront ici', clear: '🗑️ Effacer',
    infoPerso: 'Informations', email: 'Email', role: 'Rôle', member: 'Membre depuis',
    security: 'Sécurité', oldPw: '🔑 Ancien mot de passe', newPw: '🔒 Nouveau',
    confirmPw: '✅ Confirmer', updatePw: '🔒 Mettre à jour',
    student: 'Étudiant', waiting: 'En attente', blockchain: 'Résultat blockchain', search: 'Lancez une recherche',
    congrats: '🎉 Votre diplôme est authentique et valide.', revokedMsg: 'Ce diplôme a été révoqué.',
    allFields: 'Tous les champs sont obligatoires', infoAcad: 'Informations académiques',
    bonjour: 'Bonjour',
    printBtn: '🖨️ Imprimer / Exporter PDF',
    shareBtn: '🔗 Copier le lien de vérification',
    shareCopied: '✅ Lien copié!',
    qrTitle: '📱 QR Code personnel',
    qrDesc: 'Scannez pour vérifier votre diplôme',
    downloadQR: '⬇️ Télécharger QR Code',
    cardTitle: '🏆 Carte académique',
    linkedinBtn: '💼 Copier pour LinkedIn',
    linkedinCopied: '✅ Copié pour LinkedIn!',
    publicLink: '🌐 Lien public de vérification',
    copyHash: '📋 Copier le code',
    hashCopied: '✅ Code copié!',
    compareTitle: '📊 Mes diplômes',
    noMultiple: 'Un seul diplôme trouvé',
    searchHist: '🔍 Rechercher (nom, CNE, institution...)',
    noResults: 'Aucun résultat trouvé',
  },
  ar: {
    diplome: 'شهادتي', historique: 'السجل', profil: 'ملفي', logout: 'خروج',
    verifyTitle: 'التحقق من الشهادة', verifyDesc: 'أدخل معلوماتك الأكاديمية',
    cne: 'رقم CNE', name: 'الاسم الكامل', institution: 'المؤسسة',
    diplomaType: 'نوع الشهادة', selectType: '— اختر —',
    verifyBtn: '🔍 التحقق', verifying: 'جارٍ البحث...',
    fillFields: 'أكمل جميع الحقول',
    notFound: 'غير موجودة', notFoundDesc: 'لا توجد شهادة مطابقة.',
    accepted: 'مقبولة', revoked: 'ملغاة', valid: '✓ صالحة', invalid: '🚫 غير صالحة',
    issueDate: 'تاريخ الإصدار', verifiedAt: 'تاريخ التحقق', status: 'الحالة',
    immutable: 'مسجّل على Ethereum',
    totalVerif: 'الإجمالي', found: 'موجودة', notFoundStat: 'غير موجودة',
    histTitle: 'السجل', noHistory: 'لا توجد تحققات',
    noHistDesc: 'ستظهر هنا', clear: '🗑️ مسح',
    infoPerso: 'المعلومات', email: 'البريد', role: 'الدور', member: 'عضو منذ',
    security: 'الأمان', oldPw: '🔑 القديمة', newPw: '🔒 الجديدة',
    confirmPw: '✅ تأكيد', updatePw: '🔒 تحديث',
    student: 'طالب', waiting: 'انتظار', blockchain: 'نتيجة البلوكتشين', search: 'ابدأ بحثاً',
    congrats: '🎉 شهادتك أصيلة وصالحة.', revokedMsg: 'تم إلغاء هذه الشهادة.',
    allFields: 'جميع الحقول إلزامية', infoAcad: 'المعلومات الأكاديمية',
    bonjour: 'مرحباً',
    printBtn: '🖨️ طباعة / تصدير PDF',
    shareBtn: '🔗 نسخ رابط التحقق',
    shareCopied: '✅ تم النسخ!',
    qrTitle: '📱 QR Code شخصي',
    qrDesc: 'امسح للتحقق من شهادتك',
    downloadQR: '⬇️ تحميل QR Code',
    cardTitle: '🏆 البطاقة الأكاديمية',
    linkedinBtn: '💼 نسخ لـ LinkedIn',
    linkedinCopied: '✅ تم النسخ لـ LinkedIn!',
    publicLink: '🌐 رابط التحقق العام',
    copyHash: '📋 نسخ الكود',
    hashCopied: '✅ تم نسخ الكود!',
    compareTitle: '📊 شهاداتي',
    noMultiple: 'شهادة واحدة فقط',
    searchHist: '🔍 بحث (اسم، CNE، مؤسسة...)',
    noResults: 'لا توجد نتائج',
  },
  en: {
    diplome: 'My Diploma', historique: 'History', profil: 'My Profile', logout: 'Logout',
    verifyTitle: 'Diploma Verification', verifyDesc: 'Enter your academic information',
    cne: 'Student ID (CNE)', name: 'Full Name', institution: 'Institution',
    diplomaType: 'Diploma Type', selectType: '— Select —',
    verifyBtn: '🔍 Verify My Diploma', verifying: 'Searching...',
    fillFields: 'Please fill all fields including CNE',
    notFound: 'Not Found', notFoundDesc: "No matching diploma found.",
    accepted: 'Accepted', revoked: 'Revoked', valid: '✓ Valid', invalid: '🚫 Invalid',
    issueDate: 'Issue Date', verifiedAt: 'Verified On', status: 'Diploma Status',
    immutable: 'Registered on Ethereum · Immutable',
    totalVerif: 'Total', found: 'Found', notFoundStat: 'Not Found',
    histTitle: 'History', noHistory: 'No verifications yet',
    noHistDesc: 'Your verifications will appear here', clear: '🗑️ Clear',
    infoPerso: 'Information', email: 'Email', role: 'Role', member: 'Member since',
    security: 'Security', oldPw: '🔑 Old Password', newPw: '🔒 New Password',
    confirmPw: '✅ Confirm', updatePw: '🔒 Update Password',
    student: 'Student', waiting: 'Waiting', blockchain: 'Blockchain result', search: 'Start a search',
    congrats: '🎉 Your diploma is authentic and valid.', revokedMsg: 'This diploma has been revoked.',
    allFields: 'All fields are required', infoAcad: 'Academic Information',
    bonjour: 'Hello',
    printBtn: '🖨️ Print / Export PDF',
    shareBtn: '🔗 Copy verification link',
    shareCopied: '✅ Link copied!',
    qrTitle: '📱 Personal QR Code',
    qrDesc: 'Scan to verify your diploma',
    downloadQR: '⬇️ Download QR Code',
    cardTitle: '🏆 Academic Card',
    linkedinBtn: '💼 Copy for LinkedIn',
    linkedinCopied: '✅ Copied for LinkedIn!',
    publicLink: '🌐 Public verification link',
    copyHash: '📋 Copy code',
    hashCopied: '✅ Code copied!',
    compareTitle: '📊 My Diplomas',
    noMultiple: 'Only one diploma found',
    searchHist: '🔍 Search (name, CNE, institution...)',
    noResults: 'No results found',
  }
}

export default function Student() {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}')
  const initials = user.nom ? user.nom.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'ET'
  const joinDate = user.createdAt || new Date().toLocaleDateString('fr-FR')

  const [lang, setLang] = useState('fr')
  const [darkMode, setDarkMode] = useState(false)
  const t = LANGS[lang]
  const isRTL = lang === 'ar'

  const [activeTab, setActiveTab] = useState('diplome')
  const [form, setForm] = useState({ studentName: user.nom || '', institution: '', diplomaType: '', cne: user.cne || '' })
  const [result, setResult] = useState(null)
  const [diploma, setDiploma] = useState(null)
  const [diplomaId, setDiplomaId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [historique, setHistorique] = useState([])

  // ✅ خانة البحث في Historique
  const [histSearch, setHistSearch] = useState('')

  useEffect(() => {
    const cne = user.cne
    if (cne) {
      fetch(`http://localhost:5000/api/student-verifications/${cne}`)
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            setHistorique(data.verifications.map(v => ({
              studentName: v.student_name,
              institution: v.institution,
              diplomaType: v.diploma_type,
              cne: v.cne,
              issueDate: v.issue_date,
              isRevoked: false,
              verifiedAt: new Date(v.verified_at).toLocaleDateString('fr-FR'),
              notFound: !v.is_valid,
              isValid: v.is_valid
            })))
          }
        })
        .catch(err => console.error(err))
      // بحث تلقائي عند فتح الصفحة
      setCneInput(cne)
      setTimeout(() => autoSearch(cne), 500)
    }
  }, [user.cne])

  async function autoSearch(cne) {
    try {
      setLoading(true)
      const res = await fetch(`http://localhost:5000/api/diplomas/cne/${cne}`)
      const data = await res.json()
      if (data.success && data.diplomas.length > 0) {
        const diplomas = data.diplomas.map(d => ({
          id: d.blockchain_hash,
          studentName: d.student_name,
          institution: d.institution_name,
          diplomaType: d.diploma_title,
          cne: cne,
          issueDate: d.graduation_date ? new Date(d.graduation_date).toLocaleDateString('fr-FR') : '—',
          isRevoked: d.status === 'revoked',
          verifiedAt: new Date().toLocaleDateString('fr-FR'),
          ipfsHash: d.ipfs_hash || ''
        }))
        setAllDiplomas(diplomas)
        setDiploma(diplomas[0])
        setDiplomaId(diplomas[0].id)
        setResult('found')
        // حفظ في PostgreSQL
        await fetch('http://localhost:5000/api/student-verifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cne: cne,
            studentName: diplomas[0].studentName,
            institution: diplomas[0].institution,
            diplomaType: diplomas[0].diplomaType,
            issueDate: diplomas[0].issueDate,
            blockchainHash: diplomas[0].id,
            isValid: true
          })
        })
        // تحديث Historique
        loadHistorique()
      }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const [showProfil, setShowProfil] = useState(false)
  const [profilTab, setProfilTab] = useState('info')
  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [pwMsg, setPwMsg] = useState(null)

  const [shareCopied, setShareCopied] = useState(false)
  const [linkedinCopied, setLinkedinCopied] = useState(false)
  const [hashCopied, setHashCopied] = useState(false)

  const d = darkMode ? {
    bg: '#0f172a', white: '#1e293b', border: '#334155', borderL: '#1e293b',
    text: '#f1f5f9', muted: '#94a3b8', mutedL: '#64748b',
    bluePale: '#1e3a5f', blueMid: '#1e40af',
  } : {
    bg: '#f8fafc', white: '#ffffff', border: '#e2e8f0', borderL: '#f1f5f9',
    text: '#0f172a', muted: '#64748b', mutedL: '#94a3b8',
    bluePale: '#eff6ff', blueMid: '#dbeafe',
  }

  const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .sr { font-family: 'Plus Jakarta Sans', sans-serif; background: ${d.bg}; min-height: 100vh; display: flex; color: ${d.text}; direction: ${isRTL ? 'rtl' : 'ltr'}; }
  .sb { width: 256px; min-height: 100vh; flex-shrink: 0; background: ${d.white}; border-${isRTL ? 'left' : 'right'}: 1px solid ${d.border}; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; }
  .sb-user { padding: 1.4rem 1.2rem; border-bottom: 1px solid ${d.borderL}; cursor: pointer; }
  .av { width: 42px; height: 42px; border-radius: 12px; background: linear-gradient(135deg, #f59e0b, #3b82f6); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; color: white; flex-shrink: 0; }
  .sb-brand { padding: 1rem 1.2rem; border-bottom: 1px solid ${d.borderL}; display: flex; align-items: center; gap: 9px; }
  .sb-brand-icon { width: 32px; height: 32px; border-radius: 9px; background: linear-gradient(135deg, #1d4ed8, #3b82f6); display: flex; align-items: center; justify-content: center; font-size: 16px; }
  .sb-nav { padding: 0.8rem 0.75rem; flex: 1; }
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
  .topbar { background: ${d.white}; border-bottom: 1px solid ${d.border}; padding: 0 2rem; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 20; }
  .topbar-badge { display: flex; align-items: center; gap: 7px; background: ${d.bluePale}; border: 1px solid ${d.blueMid}; border-radius: 100px; padding: 6px 14px; }
  .card { background: ${d.white}; border: 1px solid ${d.border}; border-radius: 16px; overflow: hidden; }
  .card-accent::before { content: ''; display: block; height: 3px; background: linear-gradient(90deg, #1d4ed8, #3b82f6); }
  .card-accent-green::before { content: ''; display: block; height: 3px; background: linear-gradient(90deg, #059669, #10b981); }
  .card-accent-red::before { content: ''; display: block; height: 3px; background: linear-gradient(90deg, #dc2626, #f87171); }
  .card-accent-amber::before { content: ''; display: block; height: 3px; background: linear-gradient(90deg, #f59e0b, #fbbf24); }
  .gl-label { display: block; font-size: 11.5px; font-weight: 700; color: ${d.muted}; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 7px; }
  .gl-input { width: 100%; padding: 11px 14px; background: ${d.bg}; border: 1.5px solid ${d.border}; border-radius: 10px; color: ${d.text}; font-size: 14px; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; }
  .gl-input:focus { border-color: #3b82f6; background: ${d.white}; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
  .gl-input option { background: ${d.white}; color: ${d.text}; }
  .blue-btn { width: 100%; padding: 13px; border: none; border-radius: 12px; cursor: pointer; font-size: 14.5px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; color: white; background: linear-gradient(135deg, #1d4ed8, #3b82f6); transition: all 0.2s; }
  .blue-btn:hover:not(:disabled) { transform: translateY(-1px); }
  .blue-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .action-btn { width: 100%; padding: 11px; border-radius: 10px; cursor: pointer; font-size: 13px; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 8px; }
  .icell { background: ${d.bg}; border: 1px solid ${d.border}; border-radius: 12px; padding: 13px 15px; }
  .pill { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; }
  .pill-green { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
  .pill-red { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .table-row { display: flex; align-items: center; justify-content: space-between; padding: 0.9rem 1.2rem; border-bottom: 1px solid ${d.borderL}; gap: 12px; }
  .table-row:hover { background: ${d.bg}; }
  .lang-btn { padding: 5px 10px; border-radius: 8px; border: 1px solid ${d.border}; background: ${d.bg}; color: ${d.text}; font-size: 12px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
  .lang-btn.active-lang { background: #1d4ed8; color: white; border-color: #1d4ed8; }
  .dark-toggle { width: 42px; height: 24px; border-radius: 12px; border: none; cursor: pointer; position: relative; background: ${darkMode ? '#1d4ed8' : d.border}; }
  .dark-toggle-dot { position: absolute; top: 3px; width: 18px; height: 18px; border-radius: 50%; background: white; transition: left 0.2s; left: ${darkMode ? '21px' : '3px'}; }
  .profil-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(15,23,42,0.55); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
  .profil-modal { background: ${d.white}; border-radius: 24px; width: 100%; max-width: 560px; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 24px 80px rgba(0,0,0,0.18); font-family: 'Plus Jakarta Sans', sans-serif; }
  .profil-cover { background: linear-gradient(135deg, #f59e0b, #fbbf24); padding: 2rem; position: relative; overflow: hidden; flex-shrink: 0; }
  .profil-close-btn { position:absolute; top:14px; right:14px; width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,0.2); border:none; color:rgba(255,255,255,0.9); font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; z-index:1; }
  .profil-tabs { display:flex; background:${d.bg}; border-bottom:1px solid ${d.border}; flex-shrink:0; }
  .profil-tab { flex:1; padding:13px; border:none; background:transparent; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:600; color:${d.mutedL}; cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-1px; display:flex; align-items:center; justify-content:center; gap:6px; }
  .profil-tab.active { color:#1d4ed8; border-bottom-color:#1d4ed8; background:${d.white}; }
  .profil-body { flex:1; overflow-y:auto; padding:1.4rem; }
  .profil-info-card { border:1px solid ${d.border}; border-radius:14px; overflow:hidden; margin-bottom:1rem; }
  .profil-info-card-header { padding:11px 16px; background:${d.bg}; border-bottom:1px solid ${d.border}; display:flex; align-items:center; gap:8px; }
  .profil-info-row { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-bottom:1px solid ${d.borderL}; }
  .profil-info-row:last-child { border-bottom:none; }
  .pw-input { width:100%; padding:10px 42px 10px 14px; background:${d.bg}; border:1.5px solid ${d.border}; border-radius:10px; color:${d.text}; font-size:13.5px; font-family:'Plus Jakarta Sans',sans-serif; outline:none; box-sizing:border-box; }
  .pw-input:focus { border-color:#3b82f6; background:${d.white}; }
  .profil-save-btn { width:100%; padding:13px; border:none; border-radius:12px; background:linear-gradient(135deg,#1d4ed8,#3b82f6); color:white; font-size:14px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; cursor:pointer; }
  /* Academic Card Print */
  .academic-card { background: linear-gradient(135deg, #1e3a5f, #1d4ed8); border-radius: 16px; padding: 1.5rem; color: white; position: relative; overflow: hidden; }
  .academic-card::before { content:''; position:absolute; right:-30px; top:-30px; width:150px; height:150px; border-radius:50%; background:rgba(255,255,255,0.06); }
  .main::-webkit-scrollbar { width: 4px; }
  .main::-webkit-scrollbar-thumb { background: ${d.border}; border-radius: 4px; }
  .ld { display:inline-flex; align-items:center; gap:4px; }
  .ld span { width:5px; height:5px; border-radius:50%; background:white; animation:ldB 1.1s ease-in-out infinite; }
  .ld span:nth-child(2) { animation-delay:0.15s; }
  .ld span:nth-child(3) { animation-delay:0.3s; }
  @keyframes ldB { 0%,80%,100%{transform:scale(0.5);opacity:0.3} 40%{transform:scale(1.3);opacity:1} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .fade-up { animation: fadeUp 0.4s ease forwards; }
  @media print {
    .sb, .topbar, .blue-btn, .action-btn, .lang-btn, .dark-toggle, .logout-b, .sb-bottom { display: none !important; }
    .main { overflow: visible !important; }
  }
  `

  const [cneInput, setCneInput] = useState(user.cne || '')
  const [allDiplomas, setAllDiplomas] = useState([])

  function handleChange(e) { setError('') }

  async function handleSearch() {
    if (!cneInput.trim()) {
      setError('❌ Veuillez entrer votre CNE'); return
    }
    try {
      setLoading(true); setError(''); setResult(null); setDiploma(null); setDiplomaId(null); setAllDiplomas([])

      const res = await fetch(`http://localhost:5000/api/diplomas/cne/${cneInput.trim()}`)
      const data = await res.json()

      if (data.success && data.diplomas.length > 0) {
        const diplomas = data.diplomas.map(d => ({
          id: d.blockchain_hash,
          studentName: d.student_name,
          institution: d.institution_name,
          diplomaType: d.diploma_title,
          cne: cneInput.trim(),
          issueDate: d.graduation_date ? new Date(d.graduation_date).toLocaleDateString('fr-FR') : '—',
          isRevoked: d.status === 'revoked',
          verifiedAt: new Date().toLocaleDateString('fr-FR'),
          ipfsHash: d.ipfs_hash || ''
        }))
        setAllDiplomas(diplomas)
        setDiploma(diplomas[0])
        setDiplomaId(diplomas[0].id)
        setResult('found')

        // حفظ في PostgreSQL
        await fetch('http://localhost:5000/api/student-verifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cne: cneInput.trim(),
            studentName: diplomas[0].studentName,
            institution: diplomas[0].institution,
            diplomaType: diplomas[0].diplomaType,
            issueDate: diplomas[0].issueDate,
            blockchainHash: diplomas[0].id,
            isValid: true
          })
        })
        // تحديث Historique
        loadHistorique()
      } else {
        setResult('notfound')
        // حفظ التحقق الفاشل في PostgreSQL
        await fetch('http://localhost:5000/api/student-verifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cne: cneInput.trim(), studentName: '—', institution: '—', diplomaType: '—', issueDate: '—', blockchainHash: null, isValid: false })
        })
        loadHistorique()
      }
    } catch (err) {
      setError('❌ Backend non disponible: ' + err.message)
    }
    finally { setLoading(false) }
  }

  async function loadHistorique() {
    try {
      const cne = cneInput.trim() || user.cne
      if (!cne) return
      const res = await fetch(`http://localhost:5000/api/student-verifications/${cne}`)
      const data = await res.json()
      if (data.success) {
        const hist = data.verifications.map(v => ({
          studentName: v.student_name,
          institution: v.institution,
          diplomaType: v.diploma_type,
          cne: v.cne,
          issueDate: v.issue_date,
          isRevoked: false,
          verifiedAt: new Date(v.verified_at).toLocaleDateString('fr-FR'),
          notFound: !v.is_valid,
          isValid: v.is_valid
        }))
        setHistorique(hist)
      }
    } catch (err) { console.error(err) }
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

  function handleShare() {
    const link = `${window.location.origin}/verify?hash=${diplomaId}`
    navigator.clipboard.writeText(link)
    setShareCopied(true); setTimeout(() => setShareCopied(false), 2000)
  }

  function handleLinkedin() {
    if (!diploma) return
    const text = `🎓 ${diploma.diplomaType} en ${diploma.institution}\n📅 Obtenu le ${diploma.issueDate}\n✅ Vérifié sur DiploChain\n🔗 ${window.location.origin}/verify?hash=${diplomaId}`
    navigator.clipboard.writeText(text)
    setLinkedinCopied(true); setTimeout(() => setLinkedinCopied(false), 2000)
  }

  function handleCopyHash() {
    navigator.clipboard.writeText(diplomaId)
    setHashCopied(true); setTimeout(() => setHashCopied(false), 2000)
  }

  function handlePrint() { window.print() }

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

  const statusColor = result === 'found' ? (diploma?.isRevoked ? '#dc2626' : '#059669') : result === 'notfound' ? '#dc2626' : '#94a3b8'
  const navTabs = [{ key: 'diplome', icon: '🎓', label: t.diplome }, { key: 'historique', icon: '📜', label: t.historique }]
  const validDiplomas = historique.filter(h => !h.notFound && !h.isRevoked)

  // ✅ سجل التحققات المُفلتر حسب البحث
  const filteredHistorique = historique.filter(item => {
    if (!histSearch.trim()) return true
    const q = histSearch.toLowerCase()
    return (
      (item.studentName || '').toLowerCase().includes(q) ||
      (item.cne || '').toLowerCase().includes(q) ||
      (item.institution || '').toLowerCase().includes(q) ||
      (item.diplomaType || '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="sr">
      <style>{CSS}</style>

      {/* SIDEBAR */}
      <aside className="sb">
        <div className="sb-user" onClick={() => { setShowProfil(true); setProfilTab('info') }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="av">{initials}</div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: d.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.nom || t.student}</div>
              <div style={{ fontSize: 11, color: d.mutedL }}>{user.email}</div>
            </div>
            <span style={{ fontSize: 12, color: d.mutedL }}>›</span>
          </div>
        </div>

        <div className="sb-brand">
          <div className="sb-brand-icon">🎓</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: d.text }}>Diplo<span style={{ color: '#1d4ed8' }}>Chain</span></div>
            <div style={{ fontSize: 10, color: d.mutedL, fontWeight: 600, textTransform: 'uppercase' }}>{t.student}</div>
          </div>
        </div>

        <div className="sb-nav">
          <div className="sb-section-label">Navigation</div>
          {navTabs.map(tab => (
            <button key={tab.key} className={`nav-btn ${activeTab === tab.key ? 'active' : 'inactive'}`} onClick={() => setActiveTab(tab.key)}>
              <span className="nav-btn-icon">{tab.icon}</span>
              <span style={{ flex: 1 }}>{tab.label}</span>
              {activeTab === tab.key && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1d4ed8', flexShrink: 0 }} />}
            </button>
          ))}
          <div className="sb-section-label" style={{ marginTop: 16 }}>Compte</div>
          <button className="nav-btn inactive" onClick={() => { setShowProfil(true); setProfilTab('info') }}>
            <span className="nav-btn-icon">👤</span>
            <span style={{ flex: 1 }}>{t.profil}</span>
          </button>
        </div>

        <div className="sb-bottom">
          <div style={{ borderRadius: 12, padding: '12px 14px', marginBottom: 10, border: `1px solid ${result ? statusColor + '35' : d.border}`, background: result === 'found' ? (diploma?.isRevoked ? '#fef2f2' : '#f0fdf4') : d.bg, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: result ? statusColor + '18' : d.borderL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>
              {result === 'found' ? (diploma?.isRevoked ? '🚫' : '✅') : result === 'notfound' ? '❌' : '🔍'}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: statusColor }}>
                {result === 'found' ? (diploma?.isRevoked ? t.revoked : t.accepted + ' ✓') : result === 'notfound' ? t.notFound : t.waiting}
              </div>
              <div style={{ fontSize: 11, color: d.mutedL, marginTop: 2 }}>{result ? t.blockchain : t.search}</div>
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
            <span style={{ fontSize: 13, fontWeight: 700, color: d.text }}>{navTabs.find(tab => tab.key === activeTab)?.icon} {navTabs.find(tab => tab.key === activeTab)?.label}</span>
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
              <span style={{ fontSize: 12, color: '#1d4ed8', fontWeight: 600 }}>Ethereum</span>
            </div>
          </div>
        </div>

        <div style={{ padding: '1.5rem 2rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: d.text }}>{navTabs.find(tab => tab.key === activeTab)?.icon} {navTabs.find(tab => tab.key === activeTab)?.label}</h1>
            {activeTab === 'diplome' && user.cne && (
              <div style={{ background: d.bluePale, border: `1px solid ${d.blueMid}`, borderRadius: 100, padding: '4px 14px', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <span style={{ fontSize: 12 }}>🪪</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1d4ed8' }}>CNE: {user.cne}</span>
              </div>
            )}
          </div>
          <p style={{ fontSize: 13, color: d.muted, marginTop: 3 }}>{activeTab === 'diplome' ? t.verifyDesc : t.histTitle}</p>
        </div>

        <div style={{ padding: '1.2rem 2rem 2rem', maxWidth: 720 }}>

          {/* MON DIPLÔME */}
          {activeTab === 'diplome' && (
            <div>

              {/* Form */}
              <div className="card card-accent" style={{ marginBottom: '1.2rem' }}>
                <div style={{ padding: '1.5rem' }}>
                  {error && <div style={{ padding: '11px 14px', borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', marginBottom: '1rem', fontSize: 13, color: '#dc2626' }}>⚠️ {error}</div>}
                  {!user.cne ? (
                    <div>
                      <div style={{ marginBottom: '1.2rem' }}>
                        <label className="gl-label">🪪 {t.cne}</label>
                        <input className="gl-input" placeholder="Ex: R123456789" value={cneInput} onChange={e => { setCneInput(e.target.value); setError('') }} />
                      </div>
                      <button className="blue-btn" onClick={handleSearch} disabled={loading}>
                        {loading ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>Chargement... <span className="ld"><span/><span/><span/></span></span> : '🎓 Voir mes diplômes'}
                      </button>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '1rem', background: d.bluePale, borderRadius: 12, border: `1px solid ${d.blueMid}` }}>
                      <div style={{ fontSize: 13, color: '#1d4ed8', fontWeight: 600, marginBottom: 4 }}>🪪 CNE: <strong>{user.cne}</strong></div>
                      <div style={{ fontSize: 12, color: d.mutedL }}>Vos diplômes sont chargés automatiquement</div>
                      {loading && <div style={{ marginTop: 8, fontSize: 12, color: '#1d4ed8' }}>⏳ Chargement...</div>}
                    </div>
                  )}
                </div>
              </div>

              {/* Not found */}
              {result === 'notfound' && (
                <div className="card card-accent-red fade-up">
                  <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: '#fef2f2', border: '2px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>❌</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 17, color: '#dc2626', marginBottom: 4 }}>{t.notFound}</div>
                      <div style={{ color: d.muted, fontSize: 13 }}>{t.notFoundDesc}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Found */}
              {result === 'found' && diploma && (
                <div className="fade-up">
                  {/* نتيجة التحقق */}
                  <div className={`card ${diploma.isRevoked ? 'card-accent-red' : 'card-accent-green'}`} style={{ marginBottom: '1rem' }}>
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', paddingBottom: '1rem', borderBottom: `1px solid ${d.borderL}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <div style={{ width: 54, height: 54, borderRadius: 14, background: diploma.isRevoked ? '#fef2f2' : '#f0fdf4', border: `2px solid ${diploma.isRevoked ? '#fecaca' : '#bbf7d0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
                            {diploma.isRevoked ? '🚫' : '✅'}
                          </div>
                          <div>
                            <div style={{ fontSize: 11, color: d.mutedL, fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{t.status}</div>
                            <div style={{ fontWeight: 800, fontSize: 22, color: diploma.isRevoked ? '#dc2626' : '#059669' }}>{diploma.isRevoked ? t.revoked : t.accepted}</div>
                            <div style={{ color: d.muted, fontSize: 12, marginTop: 3 }}>{diploma.isRevoked ? t.revokedMsg : t.congrats}</div>
                          </div>
                        </div>
                        <span className={`pill ${diploma.isRevoked ? 'pill-red' : 'pill-green'}`}>{diploma.isRevoked ? t.invalid : t.valid}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {[
                          { icon: '🪪', label: 'CNE',         value: diploma.cne          },
                          { icon: '👤', label: t.name,        value: diploma.studentName   },
                          { icon: '🏛️', label: t.institution, value: diploma.institution   },
                          { icon: '🎓', label: t.diplomaType, value: diploma.diplomaType   },
                          { icon: '📅', label: t.issueDate,   value: diploma.issueDate     },
                          { icon: '🕐', label: t.verifiedAt,  value: diploma.verifiedAt    },
                        ].map((item, i) => (
                          <div key={i} className="icell">
                            <div style={{ fontSize: 10, color: d.mutedL, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>{item.icon} {item.label}</div>
                            <div style={{ fontSize: 13.5, fontWeight: 700, color: d.text }}>{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* البطاقة الأكاديمية */}
                  {!diploma.isRevoked && (
                    <div className="academic-card" style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                        <div>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>🏆 {t.cardTitle}</div>
                          <div style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 4 }}>{diploma.studentName}</div>
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>🎓 {diploma.diplomaType}</div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>🏛️ {diploma.institution}</div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>📅 {diploma.issueDate}</div>
                          <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 100, padding: '4px 12px' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
                            <span style={{ fontSize: 11, color: 'white', fontWeight: 600 }}>{t.immutable}</span>
                          </div>
                        </div>
                        <div style={{ background: 'white', padding: 8, borderRadius: 10, flexShrink: 0 }}>
                          <QRCodeSVG value={diplomaId || 'diplochain'} size={80} fgColor="#1d4ed8" level="H" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* أزرار الإجراءات */}
                  {!diploma.isRevoked && (
                    <div className="card" style={{ padding: '1.2rem' }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: d.text, marginBottom: '1rem' }}>⚡ Actions</div>

                      {/* طباعة */}
                      <button className="action-btn" onClick={handlePrint} style={{ background: '#f0fdf4', color: '#059669', border: '1px solid #bbf7d0' }}>
                        {t.printBtn}
                      </button>

                      {/* مشاركة رابط */}
                      <button className="action-btn" onClick={handleShare} style={{ background: d.bluePale, color: '#1d4ed8', border: `1px solid ${d.blueMid}` }}>
                        {shareCopied ? t.shareCopied : t.shareBtn}
                      </button>

                      {/* LinkedIn */}
                      <button className="action-btn" onClick={handleLinkedin} style={{ background: '#eff6ff', color: '#0a66c2', border: '1px solid #bfdbfe' }}>
                        {linkedinCopied ? t.linkedinCopied : t.linkedinBtn}
                      </button>

                      {/* نسخ الكود */}
                      <button className="action-btn" onClick={handleCopyHash} style={{ background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe', marginBottom: 0 }}>
                        {hashCopied ? t.hashCopied : t.copyHash}
                      </button>
                    </div>
                  )}

                  {/* QR Code كبير */}
                  {!diploma.isRevoked && (
                    <div className="card" style={{ padding: '1.2rem', marginTop: '1rem', textAlign: 'center' }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: d.text, marginBottom: '1rem' }}>{t.qrTitle}</div>
                      <div style={{ display: 'inline-block', background: 'white', padding: 16, borderRadius: 12, border: `1px solid ${d.border}` }}>
                        <QRCodeSVG value={diplomaId || 'diplochain'} size={160} fgColor="#1d4ed8" level="H" />
                      </div>
                      <div style={{ fontSize: 12, color: d.mutedL, marginTop: 8 }}>{t.qrDesc}</div>
                      <div style={{ fontSize: 10, color: d.mutedL, fontFamily: 'monospace', marginTop: 6, wordBreak: 'break-all', padding: '0 1rem' }}>
                        {diplomaId?.slice(0, 32)}...
                      </div>
                    </div>
                  )}

                  {/* مقارنة الشهادات */}
                  {allDiplomas.length > 1 && (
                    <div className="card" style={{ padding: '1.2rem', marginTop: '1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: d.text, marginBottom: '1rem' }}>🎓 {t.compareTitle} ({allDiplomas.length})</div>
                      {allDiplomas.map((item, i) => (
                        <div key={i} onClick={() => { setDiploma(item); setDiplomaId(item.id) }}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px', borderRadius: 10, marginBottom: 6, cursor: 'pointer', background: diploma?.id === item.id ? d.bluePale : d.bg, border: `1px solid ${diploma?.id === item.id ? d.blueMid : d.border}` }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🎓</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: d.text }}>{item.diplomaType}</div>
                            <div style={{ fontSize: 11, color: d.muted }}>{item.institution} · {item.issueDate}</div>
                          </div>
                          <span className="pill pill-green">✓</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* HISTORIQUE */}
          {activeTab === 'historique' && (
            <div className="fade-up">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: '1.2rem' }}>
                {[
                  { icon: '🔍', label: t.totalVerif,   val: historique.length,                                        color: '#1d4ed8', bg: d.bluePale, bdr: d.blueMid },
                  { icon: '✅', label: t.found,        val: historique.filter(h => !h.notFound && !h.isRevoked).length, color: '#059669', bg: '#ecfdf5', bdr: '#bbf7d0' },
                  { icon: '❌', label: t.notFoundStat, val: historique.filter(h => h.notFound).length,                color: '#dc2626', bg: '#fef2f2', bdr: '#fecaca' },
                ].map((s, i) => (
                  <div key={i} style={{ background: s.bg, border: `1px solid ${s.bdr}`, borderRadius: 12, padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                      <div style={{ fontSize: 11, color: d.muted }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.2rem', borderBottom: `1px solid ${d.borderL}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: d.text }}>📜 {t.histTitle} ({filteredHistorique.length})</span>
                  <input
                    type="text"
                    className="gl-input"
                    placeholder={t.searchHist}
                    value={histSearch}
                    onChange={e => setHistSearch(e.target.value)}
                    style={{ maxWidth: 280, marginBottom: 0, fontSize: 13, flex: '1 1 220px' }}
                  />
                </div>
                {historique.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: d.mutedL }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.noHistory}</div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>{t.noHistDesc}</div>
                  </div>
                ) : filteredHistorique.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: d.mutedL }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.noResults}</div>
                  </div>
                ) : filteredHistorique.map((item, i) => (
                  <div key={i} className="table-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: item.notFound ? '#fef2f2' : '#f0fdf4', border: `1px solid ${item.notFound ? '#fecaca' : '#bbf7d0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                        {item.notFound ? '❌' : item.isRevoked ? '🚫' : '✅'}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: d.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.studentName}</div>
                        <div style={{ fontSize: 11, color: d.muted, marginTop: 2 }}>
                          <span style={{ background: d.borderL, borderRadius: 4, padding: '1px 5px', marginRight: 4, fontWeight: 600 }}>{item.diplomaType || '—'}</span>
                          {item.institution} · 🪪 {item.cne}
                        </div>
                        <div style={{ fontSize: 10.5, color: d.mutedL, marginTop: 2 }}>🕐 {item.verifiedAt}</div>
                      </div>
                    </div>
                    <span className={`pill ${item.notFound ? 'pill-red' : item.isRevoked ? 'pill-red' : 'pill-green'}`}>
                      {item.notFound ? '❌' : item.isRevoked ? '🚫' : '✓'} {item.notFound ? t.notFoundStat : item.isRevoked ? t.revoked : t.valid}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* PROFIL MODAL */}
      {showProfil && (
        <div className="profil-overlay" onClick={() => setShowProfil(false)}>
          <div className="profil-modal" onClick={e => e.stopPropagation()}>
            <div className="profil-cover">
              <div style={{ position: 'absolute', right: -20, top: -20, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
              <button className="profil-close-btn" onClick={() => setShowProfil(false)}>✕</button>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(255,255,255,0.25)', border: '2.5px solid rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 12 }}>{initials}</div>
                <div style={{ fontWeight: 800, color: 'white', fontSize: 20 }}>{user.nom || t.student}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 3 }}>{user.email}</div>
                <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ background: 'rgba(255,255,255,0.22)', color: 'white', borderRadius: 100, padding: '3px 12px', fontSize: 11, fontWeight: 700 }}>🎓 {t.student}</span>
                  {user.cne && <span style={{ background: 'rgba(255,255,255,0.22)', color: 'white', borderRadius: 100, padding: '3px 12px', fontSize: 11, fontWeight: 700 }}>🪪 {user.cne}</span>}
                  <span style={{ background: 'rgba(255,255,255,0.22)', color: 'white', borderRadius: 100, padding: '3px 12px', fontSize: 11, fontWeight: 700 }}>📅 {joinDate}</span>
                </div>
              </div>
            </div>
            <div className="profil-tabs">
              {[{ key: 'info', icon: '👤', label: t.infoPerso }, { key: 'securite', icon: '🔒', label: t.security }].map(tab => (
                <button key={tab.key} className={`profil-tab ${profilTab === tab.key ? 'active' : ''}`} onClick={() => setProfilTab(tab.key)}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
            <div className="profil-body">
              {profilTab === 'info' && (
                <div className="profil-info-card">
                  <div className="profil-info-card-header">
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👤</div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: d.text }}>{t.infoPerso}</span>
                  </div>
                  {[
                    { icon: '👤', label: t.name,   value: user.nom   || '—' },
                    { icon: '📧', label: t.email,  value: user.email || '—' },
                    { icon: '🪪', label: 'CNE',    value: user.cne   || '—' },
                    { icon: '🎭', label: t.role,   value: t.student         },
                    { icon: '📅', label: t.member, value: joinDate          },
                  ].map((row, i) => (
                    <div key={i} className="profil-info-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, color: d.mutedL, textTransform: 'uppercase' }}>
                        <span>{row.icon}</span> {row.label}
                      </div>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: d.text }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {profilTab === 'securite' && (
                <>
                  {pwMsg && (
                    <div style={{ marginBottom: '1rem', padding: '11px 14px', borderRadius: 10, background: pwMsg.type === 'success' ? '#f0fdf4' : '#fef2f2', color: pwMsg.type === 'success' ? '#15803d' : '#dc2626', borderLeft: `3px solid ${pwMsg.type === 'success' ? '#22c55e' : '#ef4444'}`, fontSize: 13, fontWeight: 600 }}>
                      {pwMsg.text}
                    </div>
                  )}
                  {pwField(t.oldPw, oldPw, setOldPw, showOld, setShowOld, '••••••••')}
                  {pwField(t.newPw, newPw, setNewPw, showNew, setShowNew, '••••••••')}
                  {pwField(t.confirmPw, confirmPw, setConfirmPw, showConf, setShowConf, '••••••••')}
                  <button className="profil-save-btn" onClick={handleChangePw}>{t.updatePw}</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}