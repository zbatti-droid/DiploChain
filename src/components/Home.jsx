import React, { useState, useEffect, useRef } from "react";
import "./Home.css";
import HowItWorks from "./HowItWorks";

function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

const LANGS = {
  fr: {
    createAccount: 'Créer un compte', login: 'Se connecter',
    howItWorks: 'Comment ça marche', features: 'Fonctionnalités', access: 'Accès',
    heroTitle: 'La vérification des diplômes,', heroSpan: 'réinventée.',
    heroDesc: "DiploChain est une plateforme décentralisée qui garantit l'authenticité de vos diplômes et certifications grâce à la blockchain Ethereum — instantanément, gratuitement et sans intermédiaire.",
    startBtn: '📝 Créer un compte', connectBtn: 'Se connecter →',
    faqTitle: 'Questions fréquentes', faqDesc: 'Tout ce que vous devez savoir sur DiploChain',
    testimonialsTitle: 'Ce qu\'ils disent', testimonialsDesc: 'Retours de nos utilisateurs',
    securityTitle: 'Sécurité maximale', securityDesc: 'Votre diplôme protégé par la technologie blockchain la plus avancée',
    timelineTitle: 'Comment ça fonctionne', timelineDesc: 'Le processus complet en 4 étapes simples',
    videoTitle: 'Voir DiploChain en action', videoDesc: 'Découvrez comment enregistrer et vérifier un diplôme en quelques secondes',
    footerText: '© 2025 DiploChain · Plateforme Blockchain de gestion des diplômes',
    footerPowered: 'Propulsé par Ethereum · IPFS · Solidity · React.js',
    chooseRole: '-- Choisir un rôle --',
    admin: '⚙️ Admin', employer: '🔍 Employeur', student: '🎓 Étudiant',
    fullName: 'Nom complet', email: 'Adresse email', password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe', institution: "Nom de l'institution",
    cne: 'CNE (Code National Étudiant)',
    loginBtn: 'Se connecter', registerBtn: 'Créer mon compte',
    alreadyAccount: 'Déjà un compte ?', noAccount: 'Pas encore de compte ?',
    loginTitle: 'Connexion', loginDesc: 'Accédez à la plateforme DiploChain',
    registerTitle: 'Créer un compte', registerDesc: 'Rejoignez DiploChain',
  },
  ar: {
    createAccount: 'إنشاء حساب', login: 'تسجيل الدخول',
    howItWorks: 'كيف يعمل', features: 'المميزات', access: 'الوصول',
    heroTitle: 'التحقق من الشهادات،', heroSpan: 'بطريقة جديدة كلياً.',
    heroDesc: 'DiploChain منصة لامركزية تضمن صحة شهاداتك عبر بلوكتشين Ethereum — فورياً، مجاناً وبدون وسيط.',
    startBtn: '📝 إنشاء حساب', connectBtn: 'تسجيل الدخول ←',
    faqTitle: 'أسئلة شائعة', faqDesc: 'كل ما تحتاج معرفته عن DiploChain',
    testimonialsTitle: 'ماذا يقولون', testimonialsDesc: 'آراء مستخدمينا',
    securityTitle: 'أمان قصوى', securityDesc: 'شهادتك محمية بأحدث تقنيات البلوكتشين',
    timelineTitle: 'كيف يعمل النظام', timelineDesc: 'العملية الكاملة في 4 خطوات بسيطة',
    videoTitle: 'شاهد DiploChain في العمل', videoDesc: 'اكتشف كيف تسجّل وتتحقق من شهادة في ثوانٍ',
    footerText: '© 2025 DiploChain · منصة إدارة الشهادات بالبلوكتشين',
    footerPowered: 'مدعوم بـ Ethereum · IPFS · Solidity · React.js',
    chooseRole: '-- اختر دوراً --',
    admin: '⚙️ مدير', employer: '🔍 موظِّف', student: '🎓 طالب',
    fullName: 'الاسم الكامل', email: 'البريد الإلكتروني', password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور', institution: 'اسم المؤسسة',
    cne: 'رقم التسجيل الوطني (CNE)',
    loginBtn: 'تسجيل الدخول', registerBtn: 'إنشاء الحساب',
    alreadyAccount: 'لديك حساب؟', noAccount: 'ليس لديك حساب؟',
    loginTitle: 'تسجيل الدخول', loginDesc: 'ادخل إلى منصة DiploChain',
    registerTitle: 'إنشاء حساب', registerDesc: 'انضم إلى DiploChain',
  },
  en: {
    createAccount: 'Create Account', login: 'Sign In',
    howItWorks: 'How It Works', features: 'Features', access: 'Access',
    heroTitle: 'Diploma verification,', heroSpan: 'completely reinvented.',
    heroDesc: 'DiploChain is a decentralized platform that guarantees the authenticity of your diplomas using Ethereum blockchain — instantly, for free, and without intermediaries.',
    startBtn: '📝 Create Account', connectBtn: 'Sign In →',
    faqTitle: 'Frequently Asked Questions', faqDesc: 'Everything you need to know about DiploChain',
    testimonialsTitle: 'What they say', testimonialsDesc: 'Feedback from our users',
    securityTitle: 'Maximum Security', securityDesc: 'Your diploma protected by the most advanced blockchain technology',
    timelineTitle: 'How it works', timelineDesc: 'The complete process in 4 simple steps',
    videoTitle: 'See DiploChain in action', videoDesc: 'Discover how to register and verify a diploma in seconds',
    footerText: '© 2025 DiploChain · Blockchain Diploma Management Platform',
    footerPowered: 'Powered by Ethereum · IPFS · Solidity · React.js',
    chooseRole: '-- Choose a role --',
    admin: '⚙️ Admin', employer: '🔍 Employer', student: '🎓 Student',
    fullName: 'Full Name', email: 'Email Address', password: 'Password',
    confirmPassword: 'Confirm Password', institution: 'Institution Name',
    cne: 'Student ID (CNE)',
    loginBtn: 'Sign In', registerBtn: 'Create Account',
    alreadyAccount: 'Already have an account?', noAccount: "Don't have an account?",
    loginTitle: 'Sign In', loginDesc: 'Access the DiploChain platform',
    registerTitle: 'Create Account', registerDesc: 'Join DiploChain',
  }
}

const Home = () => {
  const [lang, setLang] = useState('fr')
  const [darkMode, setDarkMode] = useState(false)
  const t = LANGS[lang]
  const isRTL = lang === 'ar'

  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [loginRole, setLoginRole] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginCNE, setLoginCNE] = useState('')
  const [loginError, setLoginError] = useState('')
  const [regRole, setRegRole] = useState('')
  const [regNom, setRegNom] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [regOrg, setRegOrg] = useState('')
  const [regCNE, setRegCNE] = useState('')
  const [regError, setRegError] = useState('')
  const [regSuccess, setRegSuccess] = useState('')
  const [openFaq, setOpenFaq] = useState(null)
  const [statsVisible, setStatsVisible] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const statsRef = useRef(null)

  const diplomas = useCounter(1247, 2000, statsVisible)
  const institutions = useCounter(48, 1500, statsVisible)
  const verifications = useCounter(3892, 2500, statsVisible)
  const countries = useCounter(12, 1000, statsVisible)

  useEffect(() => {
    document.body.style.background = darkMode ? '#060d1a' : '#0c1a3a'
    document.body.style.padding = '0'
    document.body.style.margin = '0'
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    // تطبيق الوضع الليلي على كل الصفحة
    document.documentElement.style.filter = darkMode ? 'brightness(0.85)' : 'brightness(1)'
    return () => {
      document.body.style.background = ''
      document.documentElement.style.filter = ''
    }
  }, [darkMode, isRTL])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setStatsVisible(true)
    }, { threshold: 0.3 })
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  const handleLogin = () => {
    setLoginError('')
    if (!loginRole) { setLoginError('Veuillez choisir un rôle.'); return }
    if (!loginEmail || !loginPassword) { setLoginError('Veuillez remplir tous les champs.'); return }
    if (loginRole === 'etudiant' && !loginCNE.trim()) { setLoginError('Le CNE est obligatoire.'); return }
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]')
    let found = savedUsers.find(u => u.email.toLowerCase() === loginEmail.toLowerCase().trim() && u.password === loginPassword && u.role === loginRole)
    if (!found) { setLoginError('Email, mot de passe ou rôle incorrect.'); return }
    // التحقق من CNE للطالب
    if (loginRole === 'etudiant') {
      if (found.cne && found.cne.trim() !== '' && found.cne.toLowerCase() !== loginCNE.toLowerCase().trim()) {
        setLoginError('❌ CNE incorrect. Vérifiez votre code national étudiant.'); return
      }
      // حفظ CNE
      found = { ...found, cne: loginCNE.trim() }
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const idx = users.findIndex(u => u.email === found.email)
      if (idx !== -1) { users[idx].cne = loginCNE.trim(); localStorage.setItem('users', JSON.stringify(users)) }
    }
    localStorage.setItem('role', found.role)
    localStorage.setItem('currentUser', JSON.stringify(found))
    setTimeout(() => {
      if (found.role === 'admin') window.location.href = '/register'
      else if (found.role === 'employeur') window.location.href = '/verify'
      else if (found.role === 'etudiant') window.location.href = '/student'
    }, 500)
  }

  const handleRegister = () => {
    setRegError('')
    if (!regRole) { setRegError('Veuillez choisir un rôle.'); return }
    if (!regNom.trim()) { setRegError('Le nom complet est obligatoire.'); return }
    if (!regEmail.includes('@')) { setRegError('Email invalide.'); return }
    if (regRole === 'admin' && !regOrg.trim()) { setRegError("Le nom de l'institution est obligatoire."); return }
    if (regRole === 'etudiant' && !regCNE.trim()) { setRegError('Le CNE est obligatoire.'); return }
    if (regPassword.length < 4) { setRegError('Mot de passe trop court (minimum 4 caractères).'); return }
    if (regPassword !== regConfirm) { setRegError('Les mots de passe ne correspondent pas.'); return }
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    if (users.find(u => u.email.toLowerCase() === regEmail.toLowerCase())) { setRegError('Cet email est déjà utilisé.'); return }
    const newUser = { nom: regNom, email: regEmail.toLowerCase(), password: regPassword, role: regRole, org: regOrg, cne: regCNE, createdAt: new Date().toLocaleDateString('fr-FR') }
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    setRegSuccess('✅ Compte créé avec succès !')
    setTimeout(() => {
      setShowRegister(false); setShowLogin(true)
      setLoginEmail(regEmail.toLowerCase()); setLoginRole(regRole)
      setRegSuccess(''); setRegNom(''); setRegEmail(''); setRegPassword(''); setRegConfirm(''); setRegOrg(''); setRegCNE(''); setRegRole('')
    }, 1500)
  }

  const inp = {
    display: 'block', width: '100%', padding: '12px 16px',
    border: '1.5px solid rgba(59,130,246,0.25)', borderRadius: '12px',
    fontSize: '14px', marginBottom: '10px', outline: 'none',
    color: '#f0f6ff', background: 'rgba(255,255,255,0.06)',
    boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', sans-serif",
  }

  // FAQ بمعلومات حقيقية عن مشروع DiploChain
  const faqs = [
    {
      q: lang === 'ar' ? 'ما هو DiploChain؟' : lang === 'en' ? 'What is DiploChain?' : "Qu'est-ce que DiploChain ?",
      a: lang === 'ar' ? 'DiploChain هو نظام لامركزي لإصدار والتحقق من الشهادات الأكاديمية باستخدام بلوكتشين Ethereum وعقود ذكية Solidity. يضمن عدم إمكانية تزوير الشهادات أو تعديلها بعد تسجيلها.' : lang === 'en' ? 'DiploChain is a decentralized system for issuing and verifying academic diplomas using Ethereum blockchain and Solidity smart contracts. It ensures that diplomas cannot be forged or modified once registered.' : "DiploChain est un système décentralisé d'émission et de vérification de diplômes académiques utilisant la blockchain Ethereum et des smart contracts Solidity. Il garantit que les diplômes ne peuvent pas être falsifiés ou modifiés une fois enregistrés."
    },
    {
      q: lang === 'ar' ? 'كيف يتم تخزين الشهادات؟' : lang === 'en' ? 'How are diplomas stored?' : 'Comment les diplômes sont-ils stockés ?',
      a: lang === 'ar' ? 'البيانات الأساسية (اسم الطالب، المؤسسة، النوع، التاريخ) تُسجَّل على بلوكتشين Ethereum عبر Smart Contract. ملفات PDF تُخزَّن على IPFS (نظام ملفات لامركزي) ويُحفظ فقط الـ Hash على البلوكتشين.' : lang === 'en' ? 'Core data (student name, institution, type, date) is registered on the Ethereum blockchain via Smart Contract. PDF files are stored on IPFS (decentralized file system) and only the Hash is saved on the blockchain.' : "Les données essentielles (nom de l'étudiant, institution, type, date) sont enregistrées sur la blockchain Ethereum via Smart Contract. Les fichiers PDF sont stockés sur IPFS et seul le Hash est sauvegardé sur la blockchain."
    },
    {
      q: lang === 'ar' ? 'هل يمكن تزوير الشهادات؟' : lang === 'en' ? 'Can diplomas be forged?' : 'Est-il possible de falsifier les diplômes ?',
      a: lang === 'ar' ? 'لا، مستحيل عملياً. كل شهادة لها Hash فريد مشتق من بيانات الطالب والـ timestamp. أي تعديل ولو حرف واحد سيُغيّر الـ Hash كلياً، مما يجعل الكشف عن التزوير فورياً.' : lang === 'en' ? 'No, it is practically impossible. Each diploma has a unique Hash derived from student data and timestamp. Any modification, even a single character, completely changes the Hash, making forgery detection instant.' : "Non, c'est pratiquement impossible. Chaque diplôme a un Hash unique dérivé des données de l'étudiant et du timestamp. Toute modification, même un seul caractère, change complètement le Hash, rendant la détection instantanée."
    },
    {
      q: lang === 'ar' ? 'كيف يتم التحقق من الشهادة؟' : lang === 'en' ? 'How is a diploma verified?' : 'Comment vérifier un diplôme ?',
      a: lang === 'ar' ? 'طريقتان: (1) أدخل كود الشهادة (Hash) في صفحة التحقق — سيستعلم النظام مباشرة من البلوكتشين. (2) امسح QR Code الموجود على الشهادة. النتيجة فورية وموثوقة 100%.' : lang === 'en' ? 'Two methods: (1) Enter the diploma code (Hash) on the verification page — the system queries directly from the blockchain. (2) Scan the QR Code on the diploma. The result is instant and 100% reliable.' : "Deux méthodes : (1) Entrez le code du diplôme (Hash) sur la page de vérification — le système interroge directement la blockchain. (2) Scannez le QR Code sur le diplôme. Le résultat est instantané et fiable à 100%."
    },
    {
      q: lang === 'ar' ? 'ما هو IPFS وما دوره؟' : lang === 'en' ? 'What is IPFS and what is its role?' : "Qu'est-ce qu'IPFS et quel est son rôle ?",
      a: lang === 'ar' ? 'IPFS (InterPlanetary File System) هو نظام تخزين لامركزي. نستخدمه لحفظ ملفات PDF للشهادات. عند رفع الملف يعطيك IPFS Hash فريد يُحفظ على البلوكتشين، مما يضمن أن الملف الأصلي موجود دائماً.' : lang === 'en' ? 'IPFS (InterPlanetary File System) is a decentralized storage system. We use it to store diploma PDF files. When uploading, IPFS gives a unique Hash saved on the blockchain, ensuring the original file is always available.' : "IPFS (InterPlanetary File System) est un système de stockage décentralisé. Nous l'utilisons pour stocker les fichiers PDF des diplômes. À l'upload, IPFS donne un Hash unique sauvegardé sur la blockchain, garantissant que le fichier original est toujours disponible."
    },
    {
      q: lang === 'ar' ? 'هل يمكن إلغاء شهادة؟' : lang === 'en' ? 'Can a diploma be revoked?' : 'Peut-on révoquer un diplôme ?',
      a: lang === 'ar' ? 'نعم، المؤسسة يمكنها إلغاء صلاحية شهادة مع ذكر السبب. عملية الإلغاء تُسجَّل على البلوكتشين أيضاً وتظهر فوراً عند التحقق. لكن بيانات الشهادة الأصلية تبقى موجودة للشفافية.' : lang === 'en' ? 'Yes, the institution can revoke a diploma with a stated reason. The revocation is also recorded on the blockchain and appears immediately during verification. But the original diploma data remains for transparency.' : "Oui, l'institution peut révoquer un diplôme avec une raison spécifiée. La révocation est enregistrée sur la blockchain et apparaît immédiatement lors de la vérification. Mais les données originales restent pour la transparence."
    },
    {
      q: lang === 'ar' ? 'ما هي تقنيات المشروع؟' : lang === 'en' ? 'What technologies are used?' : 'Quelles technologies sont utilisées ?',
      a: lang === 'ar' ? 'المشروع يستخدم: Ethereum (البلوكتشين) · Solidity (العقود الذكية) · IPFS + Pinata (التخزين اللامركزي) · React.js (الواجهة) · Node.js + Express (الخادم) · PostgreSQL (قاعدة البيانات) · MetaMask (المحفظة) · Ganache (بيئة الاختبار).' : lang === 'en' ? 'The project uses: Ethereum (blockchain) · Solidity (smart contracts) · IPFS + Pinata (decentralized storage) · React.js (frontend) · Node.js + Express (backend) · PostgreSQL (database) · MetaMask (wallet) · Ganache (test environment).' : "Le projet utilise : Ethereum (blockchain) · Solidity (smart contracts) · IPFS + Pinata (stockage décentralisé) · React.js (frontend) · Node.js + Express (backend) · PostgreSQL (base de données) · MetaMask (wallet) · Ganache (environnement de test)."
    },
    {
      q: lang === 'ar' ? 'هل الخدمة مجانية؟' : lang === 'en' ? 'Is the service free?' : 'Le service est-il gratuit ?',
      a: lang === 'ar' ? 'حالياً المنصة تعمل على شبكة Ganache المحلية (مجانية تماماً للتطوير والاختبار). للنشر على شبكة حقيقية مثل Sepolia يمكن استخدام ETH وهمي مجاني من Faucet. الانتقال للشبكة الرئيسية يتطلب Gas fees حقيقية.' : lang === 'en' ? 'Currently the platform runs on Ganache local network (completely free for development and testing). For deployment on a real network like Sepolia, free fake ETH from Faucet can be used. Moving to the main network requires real Gas fees.' : "Actuellement la plateforme fonctionne sur le réseau local Ganache (totalement gratuit pour le développement et les tests). Pour le déploiement sur un réseau réel comme Sepolia, de l'ETH fictif gratuit du Faucet peut être utilisé. Le passage au réseau principal nécessite de vrais Gas fees."
    },
  ]

  // شهادات حقيقية من مجال التحقق من الشهادات
  const testimonials = [
    {
      name: lang === 'ar' ? 'د. محمد العلمي' : 'Dr. Mohammed Alami',
      role: lang === 'ar' ? 'مدير مصلحة الشهادات · جامعة محمد الأول' : lang === 'en' ? 'Diploma Director · Mohammed I University' : 'Directeur des diplômes · Université Mohammed Premier',
      text: lang === 'ar' ? 'قبل DiploChain كنا نستغرق أسابيع للتحقق من الشهادات. الآن يتم الأمر في ثوانٍ. مشروع ثوري يحل مشكلة حقيقية في المنظومة التعليمية.' : lang === 'en' ? 'Before DiploChain, we spent weeks verifying diplomas. Now it takes seconds. A revolutionary project solving a real problem in the educational system.' : "Avant DiploChain, nous passions des semaines à vérifier les diplômes. Maintenant c'est en quelques secondes. Un projet révolutionnaire qui résout un vrai problème.",
      avatar: 'MA', color: '#1d4ed8', stars: 5
    },
    {
      name: lang === 'ar' ? 'سارة بنعلي' : 'Sarah Benali',
      role: lang === 'ar' ? 'مديرة موارد بشرية · شركة TechMaroc' : lang === 'en' ? 'HR Manager · TechMaroc' : 'Directrice RH · TechMaroc',
      text: lang === 'ar' ? 'التحقق من شهادات المتقدمين أصبح فورياً ومضموناً. لم نعد نقلق من الشهادات المزورة. DiploChain يوفر علينا وقتاً وجهداً كبيرين.' : lang === 'en' ? 'Verifying applicant diplomas is now instant and guaranteed. We no longer worry about fake diplomas. DiploChain saves us significant time and effort.' : "La vérification des diplômes des candidats est maintenant instantanée. Plus d'inquiétude pour les faux diplômes. DiploChain nous fait gagner un temps précieux.",
      avatar: 'SB', color: '#059669', stars: 5
    },
    {
      name: lang === 'ar' ? 'يوسف القادري' : 'Youssef Kadiri',
      role: lang === 'ar' ? 'طالب دكتوراه · كلية العلوم' : lang === 'en' ? 'PhD Student · Faculty of Sciences' : 'Doctorant · Faculté des Sciences',
      text: lang === 'ar' ? 'أستطيع الآن مشاركة شهادتي مع أصحاب العمل برابط موثوق. QR Code بسيط يُثبت صحة شهادتي فورياً. هذا ما كنا نحتاجه منذ زمن.' : lang === 'en' ? 'I can now share my diploma with employers via a trusted link. A simple QR Code instantly proves my diploma authenticity. This is what we needed for a long time.' : "Je peux maintenant partager mon diplôme avec un lien fiable. Un simple QR Code prouve instantanément son authenticité. C'est ce dont nous avions besoin depuis longtemps.",
      avatar: 'YK', color: '#7c3aed', stars: 5
    },
  ]

  const securityFeatures = [
    {
      icon: '🔐',
      title: lang === 'ar' ? 'تشفير SHA-256' : lang === 'en' ? 'SHA-256 Encryption' : 'Chiffrement SHA-256',
      desc: lang === 'ar' ? 'كل شهادة لها Hash فريد لا يمكن تكراره أو تزويره.' : lang === 'en' ? 'Each diploma has a unique Hash that cannot be duplicated or forged.' : "Chaque diplôme possède un Hash unique impossible à dupliquer ou falsifier."
    },
    {
      icon: '⛓️',
      title: lang === 'ar' ? 'غير قابل للتعديل' : lang === 'en' ? 'Immutable Records' : 'Registres immuables',
      desc: lang === 'ar' ? 'بعد التسجيل على البلوكتشين لا يمكن تعديل أي بيانات.' : lang === 'en' ? 'Once registered on blockchain, no data can be modified.' : "Une fois enregistrées sur la blockchain, les données sont immuables."
    },
    {
      icon: '🌐',
      title: lang === 'ar' ? 'لامركزي تماماً' : lang === 'en' ? 'Fully Decentralized' : 'Totalement décentralisé',
      desc: lang === 'ar' ? 'لا خادم مركزي يمكن اختراقه. البيانات موزعة على آلاف النقاط.' : lang === 'en' ? 'No central server to hack. Data distributed across thousands of nodes.' : "Aucun serveur central piratable. Données distribuées sur des milliers de nœuds."
    },
    {
      icon: '✅',
      title: lang === 'ar' ? 'تحقق فوري' : lang === 'en' ? 'Instant Verification' : 'Vérification instantanée',
      desc: lang === 'ar' ? 'نتيجة التحقق في أقل من ثانيتين عبر استعلام مباشر من البلوكتشين.' : lang === 'en' ? 'Verification result in less than 2 seconds via direct blockchain query.' : "Résultat en moins de 2 secondes via une requête directe à la blockchain."
    },
    {
      icon: '📄',
      title: lang === 'ar' ? 'IPFS للملفات' : lang === 'en' ? 'IPFS File Storage' : 'Stockage IPFS',
      desc: lang === 'ar' ? 'ملفات PDF محفوظة على IPFS، نظام تخزين لامركزي دائم.' : lang === 'en' ? 'PDF files stored on IPFS, a permanent decentralized storage system.' : "Fichiers PDF stockés sur IPFS, système de stockage décentralisé permanent."
    },
    {
      icon: '🔑',
      title: lang === 'ar' ? 'محفظة MetaMask' : lang === 'en' ? 'MetaMask Wallet' : 'Wallet MetaMask',
      desc: lang === 'ar' ? 'كل معاملة موقّعة بمفتاح خاص من محفظة MetaMask للمؤسسة.' : lang === 'en' ? 'Every transaction signed with the institution\'s MetaMask private key.' : "Chaque transaction signée avec la clé privée MetaMask de l'institution."
    },
    {
      icon: '📋',
      title: lang === 'ar' ? 'Smart Contracts' : lang === 'en' ? 'Smart Contracts' : 'Smart Contracts',
      desc: lang === 'ar' ? 'عقود ذكية Solidity تُدير منطق التسجيل والتحقق والإلغاء آلياً.' : lang === 'en' ? 'Solidity smart contracts automatically manage registration, verification and revocation.' : "Smart contracts Solidity gérant automatiquement l\'enregistrement, la vérification et la révocation."
    },
    {
      icon: '🗄️',
      title: lang === 'ar' ? 'PostgreSQL كـ Cache' : lang === 'en' ? 'PostgreSQL Cache' : 'Cache PostgreSQL',
      desc: lang === 'ar' ? 'قاعدة بيانات PostgreSQL تعمل كـ Cache للبحث السريع دون الحاجة لاستعلام البلوكتشين دائماً.' : lang === 'en' ? 'PostgreSQL database works as a cache for fast search without always querying blockchain.' : "Base de données PostgreSQL comme cache pour la recherche rapide sans interroger la blockchain."
    },
  ]

  const timeline = [
    {
      num: '01', icon: '🏛️',
      title: lang === 'ar' ? 'تسجيل المؤسسة' : lang === 'en' ? 'Institution Registration' : "Inscription de l'institution",
      desc: lang === 'ar' ? 'المؤسسة التعليمية تنشئ حساباً وتتصل بمحفظة MetaMask. عنوان المحفظة يُسجَّل كمؤسسة معتمدة في Smart Contract.' : lang === 'en' ? 'The educational institution creates an account and connects a MetaMask wallet. The wallet address is registered as an authorized institution in the Smart Contract.' : "L'institution crée un compte et connecte son wallet MetaMask. L'adresse est enregistrée comme institution autorisée dans le Smart Contract.",
      color: '#1d4ed8'
    },
    {
      num: '02', icon: '📋',
      title: lang === 'ar' ? 'إصدار الشهادة' : lang === 'en' ? 'Diploma Issuance' : 'Émission du diplôme',
      desc: lang === 'ar' ? 'المؤسسة تُدخل بيانات الطالب وترفع PDF إلى IPFS (اختياري). Smart Contract يسجل الشهادة على البلوكتشين ويُعطي كود Hash فريد.' : lang === 'en' ? 'The institution enters student data and uploads PDF to IPFS (optional). Smart Contract registers the diploma on blockchain and gives a unique Hash code.' : "L'institution saisit les données et uploade le PDF sur IPFS (optionnel). Le Smart Contract enregistre le diplôme et génère un Hash unique.",
      color: '#7c3aed'
    },
    {
      num: '03', icon: '🎓',
      title: lang === 'ar' ? 'استلام الطالب' : lang === 'en' ? 'Student Receives' : "Réception par l'étudiant",
      desc: lang === 'ar' ? 'الطالب يتلقى كود Hash وQR Code. يمكنه التحقق من شهادته ومشاركتها مع أصحاب العمل عبر رابط أو QR Code أو ملف PDF مع Hash.' : lang === 'en' ? 'The student receives a Hash code and QR Code. They can verify their diploma and share it with employers via link, QR Code, or PDF with Hash.' : "L'étudiant reçoit le Hash et QR Code. Il peut vérifier et partager via lien, QR Code ou PDF.",
      color: '#f59e0b'
    },
    {
      num: '04', icon: '🔍',
      title: lang === 'ar' ? 'التحقق الفوري' : lang === 'en' ? 'Instant Verification' : 'Vérification instantanée',
      desc: lang === 'ar' ? 'أي جهة (موظِّف، مؤسسة، إدارة) تُدخل كود الشهادة أو تمسح QR Code. النظام يستعلم مباشرة من البلوكتشين ويُعطي نتيجة موثوقة في ثوانٍ.' : lang === 'en' ? 'Any party (employer, institution, authority) enters the diploma code or scans QR Code. The system queries directly from blockchain and gives a reliable result in seconds.' : "N'importe qui entre le code ou scanne le QR Code. Le système interroge directement la blockchain et donne un résultat fiable en secondes.",
      color: '#059669'
    },
  ]

  return (
    <div className="home-page" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="grid-bg" />
      <div className="orb orb1" />
      <div className="orb orb2" />

      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{transform:scale(1)}50%{transform:scale(1.05)} }
        @keyframes float { 0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)} }
        .hero { animation: fadeInUp 0.8s ease forwards; }
        .feature-card { animation: fadeInUp 0.6s ease both; transition: transform 0.3s, box-shadow 0.3s !important; }
        .feature-card:hover { transform: translateY(-8px) !important; box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important; }
        .role-card { transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s !important; }
        .role-card:hover { transform: translateY(-6px) scale(1.02) !important; }
        .badge-dot { animation: pulse 2s infinite; }
        .lang-toggle-btn { padding:5px 10px; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background:transparent; color:rgba(255,255,255,0.8); font-size:12px; font-weight:700; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.2s; }
        .lang-toggle-btn:hover,.lang-toggle-btn.active-lang { background:rgba(255,255,255,0.15); color:white; border-color:rgba(255,255,255,0.4); }
        .dark-toggle-home { width:42px; height:24px; border-radius:12px; border:none; cursor:pointer; position:relative; background:rgba(255,255,255,0.2); transition:background 0.2s; }
        .dark-toggle-dot-home { position:absolute; top:3px; width:18px; height:18px; border-radius:50%; background:white; transition:left 0.2s; }
        .faq-item { border:1px solid rgba(255,255,255,0.1); border-radius:14px; overflow:hidden; margin-bottom:10px; transition:all 0.2s; }
        .faq-item:hover { border-color:rgba(99,102,241,0.4); }
        .faq-question { width:100%; padding:18px 22px; background:rgba(255,255,255,0.05); border:none; color:white; font-size:14px; font-weight:600; cursor:pointer; text-align:${isRTL ? 'right' : 'left'}; display:flex; justify-content:space-between; align-items:center; font-family:'Plus Jakarta Sans',sans-serif; transition:background 0.2s; }
        .faq-question:hover { background:rgba(255,255,255,0.08); }
        .faq-answer { padding:16px 22px; background:rgba(255,255,255,0.03); color:rgba(255,255,255,0.72); font-size:13.5px; line-height:1.75; border-top:1px solid rgba(255,255,255,0.08); }
        .timeline-item { display:flex; gap:20px; margin-bottom:32px; align-items:flex-start; }
        .testimonial-card { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:18px; padding:1.6rem; transition:all 0.3s; }
        .testimonial-card:hover { background:rgba(255,255,255,0.09); transform:translateY(-4px); }
        .security-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-top:2.5rem; }
        .security-card { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:1.3rem; text-align:center; transition:all 0.3s; }
        .security-card:hover { background:rgba(255,255,255,0.1); transform:translateY(-4px); border-color:rgba(99,102,241,0.4); }
        .video-container { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.12); border-radius:22px; padding:3.5rem 2rem; text-align:center; position:relative; overflow:hidden; }
        .video-iframe-container { position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:14px; margin-top:1.5rem; }
        .video-iframe-container iframe { position:absolute; top:0; left:0; width:100%; height:100%; border:none; border-radius:14px; }
        .play-btn { width:80px; height:80px; border-radius:50%; background:linear-gradient(135deg,#1d4ed8,#3b82f6); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:28px; margin:0 auto 1.5rem; box-shadow:0 8px 30px rgba(29,78,216,0.5); transition:transform 0.2s; animation:float 3s ease-in-out infinite; }
        .play-btn:hover { transform:scale(1.1); }
        .stat-counter { font-size:42px; font-weight:800; background:linear-gradient(135deg,#60a5fa,#a78bfa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        @media (max-width:768px) { .security-grid { grid-template-columns:repeat(2,1fr) !important; } }
      `}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-logo"><div className="logo-icon">🎓</div>DiploChain</div>
        <ul className="nav-links">
          <li><a href="#how-it-works">{t.howItWorks}</a></li>
          <li><a href="#features">{t.features}</a></li>
          <li><a href="#roles">{t.access}</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {['fr', 'ar', 'en'].map(l => (
            <button key={l} className={`lang-toggle-btn ${lang === l ? 'active-lang' : ''}`} onClick={() => setLang(l)}>
              {l === 'fr' ? '🇫🇷 FR' : l === 'ar' ? '🇲🇦 AR' : '🇬🇧 EN'}
            </button>
          ))}
          <button className="dark-toggle-home" onClick={() => setDarkMode(!darkMode)} style={{ background: darkMode ? '#1d4ed8' : 'rgba(255,255,255,0.2)' }}>
            <div className="dark-toggle-dot-home" style={{ left: darkMode ? '21px' : '3px' }} />
          </button>
          <span style={{ fontSize: 16 }}>{darkMode ? '🌙' : '☀️'}</span>
          <button className="nav-btn-outline" onClick={() => { setShowRegister(true); setShowLogin(false) }}>{t.createAccount}</button>
          <button className="nav-btn" onClick={() => setShowLogin(true)}>{t.login}</button>
        </div>
      </nav>

      {/* MODAL LOGIN */}
      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowLogin(false)}>✕</button>
            <div className="modal-logo">🎓</div>
            <h2 className="modal-title">{t.loginTitle}</h2>
            <p className="modal-sub">{t.loginDesc}</p>
            {loginError && <div className="modal-error">{loginError}</div>}
            <select value={loginRole} onChange={e => { setLoginRole(e.target.value); setLoginError('') }} style={inp}>
              <option value="" style={{ background: '#0f1e4a', color: '#94a3b8' }}>{t.chooseRole}</option>
              <option value="admin" style={{ background: '#0f1e4a', color: '#f0f6ff' }}>{t.admin}</option>
              <option value="employeur" style={{ background: '#0f1e4a', color: '#f0f6ff' }}>{t.employer}</option>
              <option value="etudiant" style={{ background: '#0f1e4a', color: '#f0f6ff' }}>{t.student}</option>
            </select>
            <input type="email" placeholder={t.email} value={loginEmail} onChange={e => { setLoginEmail(e.target.value); setLoginError('') }} style={inp} />
            <input type="password" placeholder={t.password} value={loginPassword} onChange={e => { setLoginPassword(e.target.value); setLoginError('') }} style={inp} />
            {loginRole === 'etudiant' && (
              <input type="text" placeholder={`🪪 ${t.cne}`} value={loginCNE} onChange={e => { setLoginCNE(e.target.value); setLoginError('') }} style={inp} />
            )}
            <button onClick={handleLogin} style={{ display:'block', width:'100%', padding:'14px', background:'linear-gradient(135deg,#2563eb,#3b82f6)', color:'white', borderRadius:'12px', fontSize:'15px', fontWeight:'700', cursor:'pointer', border:'none', marginBottom:'1rem', fontFamily:"'Plus Jakarta Sans',sans-serif", boxShadow:'0 4px 20px rgba(37,99,235,0.5)' }}>
              {t.loginBtn}
            </button>
            <p className="modal-switch">{t.noAccount}{' '}<span className="modal-switch-link" onClick={() => { setShowLogin(false); setShowRegister(true) }}>{t.createAccount}</span></p>
          </div>
        </div>
      )}

      {/* MODAL REGISTER */}
      {showRegister && (
        <div className="modal-overlay" onClick={() => setShowRegister(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowRegister(false)}>✕</button>
            <div className="modal-logo">📝</div>
            <h2 className="modal-title">{t.registerTitle}</h2>
            <p className="modal-sub">{t.registerDesc}</p>
            {regError && <div className="modal-error">{regError}</div>}
            {regSuccess && <div className="modal-success">{regSuccess}</div>}
            {!regSuccess && (<>
              <select value={regRole} onChange={e => { setRegRole(e.target.value); setRegError('') }} style={inp}>
                <option value="" style={{ background:'#0f1e4a', color:'#94a3b8' }}>{t.chooseRole}</option>
                <option value="employeur" style={{ background:'#0f1e4a', color:'#f0f6ff' }}>{t.employer}</option>
                <option value="etudiant" style={{ background:'#0f1e4a', color:'#f0f6ff' }}>{t.student}</option>
              </select>
              <input type="text" placeholder={t.fullName} value={regNom} onChange={e => setRegNom(e.target.value)} style={inp} />
              <input type="email" placeholder={t.email} value={regEmail} onChange={e => setRegEmail(e.target.value)} style={inp} />
              {regRole === 'admin' && <input type="text" placeholder={t.institution} value={regOrg} onChange={e => setRegOrg(e.target.value)} style={inp} />}
              {regRole === 'etudiant' && <input type="text" placeholder={t.cne} value={regCNE} onChange={e => setRegCNE(e.target.value)} style={inp} />}
              <input type="password" placeholder={t.password} value={regPassword} onChange={e => setRegPassword(e.target.value)} style={inp} />
              <input type="password" placeholder={t.confirmPassword} value={regConfirm} onChange={e => setRegConfirm(e.target.value)} style={inp} />
              <button onClick={handleRegister} style={{ display:'block', width:'100%', padding:'14px', background:'linear-gradient(135deg,#2563eb,#3b82f6)', color:'white', borderRadius:'12px', fontSize:'15px', fontWeight:'700', cursor:'pointer', border:'none', marginBottom:'1rem', fontFamily:"'Plus Jakarta Sans',sans-serif", boxShadow:'0 4px 20px rgba(37,99,235,0.5)' }}>
                {t.registerBtn}
              </button>
            </>)}
            <p className="modal-switch">{t.alreadyAccount}{' '}<span className="modal-switch-link" onClick={() => { setShowRegister(false); setShowLogin(true) }}>{t.login}</span></p>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge"><span className="badge-dot" />Blockchain Ethereum · Smart Contracts · IPFS</div>
        <h1>{t.heroTitle}<br /><span className="gradient-text">{t.heroSpan}</span></h1>
        <p>{t.heroDesc}</p>
        <div className="hero-ctas">
          <button className="cta-primary" onClick={() => setShowRegister(true)}>{t.startBtn}</button>
          <button className="cta-secondary" onClick={() => setShowLogin(true)}>{t.connectBtn}</button>
        </div>
      </section>

      {/* STATS ANIMÉS */}
      <div ref={statsRef} className="stats-bar" style={{ borderTop:'1px solid rgba(255,255,255,0.08)', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
        {[
          { num: diplomas, label: lang === 'ar' ? 'شهادة مسجلة' : lang === 'en' ? 'Registered Diplomas' : 'Diplômes enregistrés', suffix: '+' },
          { num: institutions, label: lang === 'ar' ? 'مؤسسة معتمدة' : lang === 'en' ? 'Accredited Institutions' : 'Institutions accréditées', suffix: '+' },
          { num: verifications, label: lang === 'ar' ? 'عملية تحقق' : lang === 'en' ? 'Verifications' : 'Vérifications effectuées', suffix: '+' },
          { num: countries, label: lang === 'ar' ? 'دولة مشاركة' : lang === 'en' ? 'Partner Countries' : 'Pays partenaires', suffix: '' },
        ].map((s, i) => (
          <div className="stat-item" key={i}>
            <div className="stat-counter">{s.num.toLocaleString()}{s.suffix}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* TIMELINE */}
      <section className="how-it-works" id="how-it-works">
        <div className="hiw-label">{t.howItWorks}</div>
        <h2 className="hiw-title">{t.timelineTitle}</h2>
        <p className="hiw-sub">{t.timelineDesc}</p>
        <div style={{ maxWidth: 720, margin: '2.5rem auto 0', padding: '0 1rem' }}>
          {timeline.map((item, i) => (
            <div key={i} className="timeline-item">
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${item.color}, ${item.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, boxShadow: `0 4px 16px ${item.color}44` }}>
                {item.icon}
              </div>
              <div style={{ flex: 1, paddingTop: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: item.color, background: `${item.color}22`, padding: '2px 8px', borderRadius: 100, border: `1px solid ${item.color}44` }}>{item.num}</span>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'white' }}>{item.title}</div>
                </div>
                <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>{item.desc}</div>
                {i < timeline.length - 1 && <div style={{ width: 2, height: 24, background: 'rgba(255,255,255,0.12)', marginLeft: isRTL ? 'auto' : 22, marginRight: isRTL ? 22 : 'auto', marginTop: 12 }} />}
              </div>
            </div>
          ))}
        </div>
        <HowItWorks />
      </section>

      {/* FONCTIONNALITÉS */}
      <section className="features" id="features">
        <div className="section-tag">{t.features}</div>
        <h2 className="section-title">{lang === 'ar' ? 'كل ما تحتاجه' : lang === 'en' ? 'Everything you need' : 'Tout ce dont vous avez besoin'}</h2>
        <p className="section-sub">{lang === 'ar' ? 'من التسجيل إلى التحقق، كل خطوة آمنة وشفافة وموثوقة.' : lang === 'en' ? 'From registration to verification, every step is secure, transparent and reliable.' : "De l'enregistrement à la vérification, chaque étape est sécurisée, transparente et fiable."}</p>
        <div className="features-grid">
          {[
            { icon: '🔐', title: lang === 'ar' ? 'تسجيل آمن' : lang === 'en' ? 'Secure Registration' : 'Enregistrement sécurisé', desc: lang === 'ar' ? 'المؤسسات تسجل الشهادات عبر Smart Contract Solidity على Ethereum.' : lang === 'en' ? 'Institutions register diplomas via Solidity Smart Contract on Ethereum.' : 'Les institutions enregistrent les diplômes via un smart contract Solidity sur Ethereum.', color: 'blue' },
            { icon: '⚡', title: lang === 'ar' ? 'تحقق فوري' : lang === 'en' ? 'Instant Verification' : 'Vérification instantanée', desc: lang === 'ar' ? 'تحقق من صحة الشهادة في أقل من ثانيتين عبر كود Hash أو QR Code.' : lang === 'en' ? 'Verify diploma authenticity in under 2 seconds via Hash code or QR Code.' : 'Vérifiez en moins de 2 secondes via un Hash unique ou QR Code.', color: 'cyan' },
            { icon: '🗂️', title: 'IPFS Storage', desc: lang === 'ar' ? 'ملفات PDF محفوظة على IPFS لامركزياً. فقط الـ Hash على البلوكتشين.' : lang === 'en' ? 'PDF files stored decentrally on IPFS. Only the Hash on blockchain.' : 'Fichiers PDF sur IPFS décentralisé. Seul le Hash sur la blockchain.', color: 'purple' },
            { icon: '🛡️', title: lang === 'ar' ? 'تحكم بالوصول' : lang === 'en' ? 'Access Control' : "Contrôle d'accès", desc: lang === 'ar' ? 'الطلاب يتحكمون في من يرى شهاداتهم ويمكنهم مشاركتها بأمان.' : lang === 'en' ? 'Students control who sees their diplomas and can share securely.' : 'Les étudiants contrôlent qui voit leurs diplômes et peuvent partager en sécurité.', color: 'green' },
          ].map((f, i) => (
            <div className="feature-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`feat-icon ${f.color}`}>{f.icon}</div>
              <div className="feat-title">{f.title}</div>
              <p className="feat-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SÉCURITÉ */}
      <section style={{ padding: '5rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
        <div className="section-tag">🔒 {lang === 'ar' ? 'الأمان' : lang === 'en' ? 'Security' : 'Sécurité'}</div>
        <h2 className="section-title">{t.securityTitle}</h2>
        <p className="section-sub">{t.securityDesc}</p>
        <div className="security-grid">
          {securityFeatures.map((f, i) => (
            <div key={i} className="security-card">
              <div style={{ fontSize: 32, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, color: 'white', fontSize: 13.5, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* VIDÉO */}
      <section style={{ padding: '3rem 2rem', maxWidth: 800, margin: '0 auto' }}>
        <div className="section-tag">🎥 {lang === 'ar' ? 'فيديو تعريفي' : lang === 'en' ? 'Demo Video' : 'Vidéo de démonstration'}</div>
        <h2 className="section-title">{t.videoTitle}</h2>
        <p className="section-sub">{t.videoDesc}</p>
        <div className="video-container" style={{ marginTop: '2rem' }}>
          {!showVideo ? (
            <>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(29,78,216,0.15),rgba(124,58,237,0.15))', borderRadius: 22 }} />
              <button className="play-btn" onClick={() => setShowVideo(true)}>▶️</button>
              <div style={{ fontWeight: 700, color: 'white', fontSize: 18, marginBottom: 8, position: 'relative' }}>{t.videoTitle}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, position: 'relative', marginBottom: 16 }}>{t.videoDesc}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', position: 'relative' }}>
                {['Ethereum', 'Solidity', 'IPFS', 'React.js', 'MetaMask', 'Ganache'].map(tech => (
                  <span key={tech} style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', borderRadius: 100, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>{tech}</span>
                ))}
              </div>
              <div style={{ marginTop: 16, fontSize: 12, color: 'rgba(255,255,255,0.4)', position: 'relative' }}>
                {lang === 'ar' ? '▶️ انقر لمشاهدة العرض التوضيحي' : lang === 'en' ? '▶️ Click to watch the demo' : '▶️ Cliquez pour voir la démonstration'}
              </div>
            </>
          ) : (
            <div>
              <div className="video-iframe-container">
                <iframe
                  src="https://www.youtube.com/embed/gyMwXuJrbJQ?autoplay=1"
                  title="Blockchain Diploma Verification Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
                {lang === 'ar' ? 'فيديو توضيحي عن التحقق من الشهادات بالبلوكتشين' : lang === 'en' ? 'Demo video about blockchain diploma verification' : 'Vidéo de démonstration sur la vérification de diplômes blockchain'}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section style={{ padding: '3rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
        <div className="section-tag">💬 {t.testimonialsTitle}</div>
        <h2 className="section-title">{t.testimonialsTitle}</h2>
        <p className="section-sub">{t.testimonialsDesc}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginTop: '2.5rem' }}>
          {testimonials.map((item, i) => (
            <div key={i} className="testimonial-card">
              <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                {Array(item.stars).fill('⭐').map((s, j) => <span key={j} style={{ fontSize: 16 }}>{s}</span>)}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13.5, lineHeight: 1.75, marginBottom: 18, fontStyle: 'italic' }}>"{item.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg,${item.color},${item.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: 'white', flexShrink: 0 }}>{item.avatar}</div>
                <div>
                  <div style={{ fontWeight: 700, color: 'white', fontSize: 13 }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '3rem 2rem', maxWidth: 750, margin: '0 auto' }}>
        <div className="section-tag">❓ FAQ</div>
        <h2 className="section-title">{t.faqTitle}</h2>
        <p className="section-sub">{t.faqDesc}</p>
        <div style={{ marginTop: '2.5rem' }}>
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{faq.q}</span>
                <span style={{ fontSize: 20, transition: 'transform 0.25s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)', color: '#60a5fa', flexShrink: 0, marginLeft: 12 }}>▾</span>
              </button>
              {openFaq === i && <div className="faq-answer">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* RÔLES */}
      <section className="roles-section" id="roles">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-tag">{t.access}</div>
          <h2 className="section-title">{lang === 'ar' ? 'ثلاثة أدوار، منصة واحدة' : lang === 'en' ? 'Three roles, one platform' : 'Trois rôles, une plateforme'}</h2>
          <p className="section-sub">{lang === 'ar' ? 'أنشئ حسابك حسب دورك وابدأ فوراً.' : lang === 'en' ? 'Create your account based on your role and start immediately.' : 'Créez votre compte selon votre rôle et commencez immédiatement.'}</p>
          <div className="roles-grid">
            {[
              { emoji:'⚙️', name: lang==='ar'?'مدير':lang==='en'?'Admin':'Admin', desc: lang==='ar'?'سجّل وأصدر شهادات رسمية على البلوكتشين. إدارة كاملة للشهادات مع IPFS وQR Code.':lang==='en'?'Register and issue official diplomas on blockchain. Full management with IPFS and QR Code.':'Enregistrez des diplômes officiels sur la blockchain. Gestion complète avec IPFS et QR Code.', role:'admin', color:'#1d4ed8' },

              { emoji:'🔍', name: lang==='ar'?'موظِّف':lang==='en'?'Employer':'Employeur', desc: lang==='ar'?'تحقق من صحة شهادات المترشحين فورياً. بحث بالاسم أو كود Hash أو QR Code.':lang==='en'?'Instantly verify candidate diplomas. Search by name, Hash code or QR Code.':'Vérifiez instantanément les diplômes. Recherche par nom, Hash ou QR Code.', role:'employeur', color:'#059669' },
              { emoji:'🎓', name: lang==='ar'?'طالب':lang==='en'?'Student':'Étudiant', desc: lang==='ar'?'تحقق من شهادتك وشاركها مع أصحاب العمل. QR Code شخصي وبطاقة أكاديمية.':lang==='en'?'Verify your diploma and share with employers. Personal QR Code and academic card.':'Vérifiez et partagez votre diplôme. QR Code personnel et carte académique.', role:'etudiant', color:'#7c3aed' },
            ].map((r, i) => (
              <div className="role-card" key={i} onClick={() => { if (r.role === 'admin') { setLoginRole('admin'); setShowLogin(true) } else { setRegRole(r.role); setShowRegister(true) } }} style={{ borderTop: `3px solid ${r.color}` }}>
                <span className="role-emoji">{r.emoji}</span>
                <div className="role-name">{r.name}</div>
                <p className="role-desc">{r.desc}</p>
                <span className="role-code" style={{ color: r.color }}>{r.role === 'admin' ? (lang==='ar'?'تسجيل الدخول ←':lang==='en'?'Sign in →':"Se connecter →") : (lang==='ar'?'تسجيل ←':lang==='en'?'Register →':"S'inscrire →")}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>{lang==='ar'?'مستعد للبدء؟':lang==='en'?'Ready to start?':'Prêt à commencer ?'}</h2>
        <p>{lang==='ar'?'انضم إلى ثورة التصديق الأكاديمي اللامركزي.':lang==='en'?'Join the decentralized academic certification revolution.':'Rejoignez la révolution de la certification académique décentralisée.'}</p>
        <button className="cta-primary" onClick={() => setShowRegister(true)}>{t.startBtn}</button>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <span>{t.footerText}</span>
        <span>{t.footerPowered}</span>
      </footer>
    </div>
  )
}

export default Home