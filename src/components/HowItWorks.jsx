import React, { useState } from "react";
import "./HowItWorks.css";

const steps = [
  {
    label: "Inscription",
    stepColor: "#1d4ed8",
    iconBg: "#eff6ff",
    num: "Étape 01",
    title: "Enregistrement du diplôme",
    body: "L'institution saisit les informations du diplôme sur la plateforme. Le fichier PDF est téléversé sur le réseau IPFS décentralisé et un identifiant unique (Hash) est généré automatiquement.",
    tags: [
      { t: "🏛️ Institution", bg: "#dbeafe", c: "#1e40af" },
      { t: "📄 Téléversement PDF", bg: "#ede9fe", c: "#6d28d9" },
      { t: "Stockage IPFS", bg: "#ecfdf5", c: "#065f46" },
    ],
    icon: (
      <svg className="hiw-icon-svg" viewBox="0 0 90 90" fill="none">
        <rect x="18" y="12" width="54" height="66" rx="8" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" className="doc-bounce" />
        <rect x="27" y="28" width="36" height="3" rx="1.5" fill="#3b82f6" opacity=".7" />
        <rect x="27" y="36" width="28" height="3" rx="1.5" fill="#3b82f6" opacity=".5" />
        <rect x="27" y="44" width="32" height="3" rx="1.5" fill="#3b82f6" opacity=".4" />
        <circle cx="68" cy="68" r="14" fill="#1d4ed8" />
        <text x="68" y="74" textAnchor="middle" fontSize="18" fill="white" fontWeight="700">+</text>
      </svg>
    ),
  },
  {
    label: "Signature",
    stepColor: "#d97706",
    iconBg: "#fffbeb",
    num: "Étape 02",
    title: "Signature numérique",
    body: "Les données du diplôme sont signées numériquement à l'aide de la clé privée de l'institution. Cette signature garantit qu'aucune falsification ou modification ultérieure n'est possible.",
    tags: [
      { t: "🔑 Clé privée", bg: "#fef3c7", c: "#92400e" },
      { t: "✅ Signature numérique", bg: "#d1fae5", c: "#065f46" },
      { t: "Infalsifiable", bg: "#fee2e2", c: "#991b1b" },
    ],
    icon: (
      <svg className="hiw-icon-svg" viewBox="0 0 90 90" fill="none">
        <circle cx="45" cy="45" r="26" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="45" cy="45" r="26" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity=".4" className="pulse-ring" />
        <path d="M32 45 L41 54 L58 36" stroke="#d97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="check-anim" />
        <path d="M20 72 Q30 60 45 68 Q55 74 70 62" stroke="#f59e0b" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Blockchain",
    stepColor: "#4f46e5",
    iconBg: "#eef2ff",
    num: "Étape 03",
    title: "Enregistrement sur la blockchain",
    body: "Un Smart Contract envoie une transaction sur le réseau Ethereum contenant le hash du diplôme et la signature de l'institution. Cette transaction est conservée définitivement de manière immuable.",
    tags: [
      { t: "⛓️ Ethereum", bg: "#eef2ff", c: "#3730a3" },
      { t: "📜 Smart Contract", bg: "#f0fdf4", c: "#166534" },
      { t: "🔒 Immuable", bg: "#fdf4ff", c: "#86198f" },
    ],
    icon: (
      <svg className="hiw-icon-svg" viewBox="0 0 90 90" fill="none">
        <rect x="8" y="36" width="22" height="18" rx="5" fill="#c7d2fe" stroke="#4f46e5" strokeWidth="1.5" />
        <rect x="34" y="36" width="22" height="18" rx="5" fill="#a5b4fc" stroke="#4f46e5" strokeWidth="1.5" />
        <rect x="60" y="36" width="22" height="18" rx="5" fill="#818cf8" stroke="#4f46e5" strokeWidth="1.5" />
        <line x1="30" y1="45" x2="34" y2="45" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="56" y1="45" x2="60" y2="45" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" />
        <text x="19" y="48" textAnchor="middle" fontSize="9" fill="#312e81" fontWeight="700">N-2</text>
        <text x="45" y="48" textAnchor="middle" fontSize="9" fill="#1e1b4b" fontWeight="700">N-1</text>
        <text x="71" y="48" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700">N</text>
        <text x="45" y="76" textAnchor="middle" fontSize="8" fill="#4f46e5" fontWeight="700">Ethereum Blockchain</text>
      </svg>
    ),
  },
  {
    label: "Accès",
    stepColor: "#059669",
    iconBg: "#ecfdf5",
    num: "Étape 04",
    title: "Contrôle d'accès",
    body: "L'étudiant contrôle qui peut consulter son diplôme. Il peut accorder ou révoquer l'accès aux employeurs ou à d'autres institutions à tout moment, en toute simplicité.",
    tags: [
      { t: "🎓 Étudiant", bg: "#d1fae5", c: "#065f46" },
      { t: "🔓 Accorder l'accès", bg: "#dcfce7", c: "#14532d" },
      { t: "🔒 Révoquer", bg: "#fee2e2", c: "#991b1b" },
    ],
    icon: (
      <svg className="hiw-icon-svg" viewBox="0 0 90 90" fill="none">
        <circle cx="45" cy="42" r="24" fill="#d1fae5" stroke="#059669" strokeWidth="1.5" className="shield-anim" />
        <rect x="33" y="38" width="24" height="16" rx="4" fill="#059669" />
        <rect x="38" y="30" width="14" height="12" rx="7" fill="none" stroke="#059669" strokeWidth="2" />
        <circle cx="45" cy="46" r="2" fill="#fff" />
        <line x1="45" y1="48" x2="45" y2="51" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        <text x="45" y="76" textAnchor="middle" fontSize="8" fill="#059669" fontWeight="700">Contrôle d'accès</text>
      </svg>
    ),
  },
  {
    label: "Vérification",
    stepColor: "#0891b2",
    iconBg: "#ecfeff",
    num: "Étape 05",
    title: "Vérification instantanée",
    body: "L'employeur ou tout autre tiers saisit le hash du diplôme ou scanne un QR Code. Le système vérifie immédiatement sur la blockchain et affiche le résultat en moins de deux secondes.",
    tags: [
      { t: "🔍 Employeur", bg: "#cffafe", c: "#0e7490" },
      { t: "⚡ Moins de 2 secondes", bg: "#fefce8", c: "#854d0e" },
      { t: "✓ Résultat immédiat", bg: "#d1fae5", c: "#065f46" },
    ],
    icon: (
      <svg className="hiw-icon-svg" viewBox="0 0 90 90" fill="none">
        <circle cx="38" cy="38" r="20" fill="#cffafe" stroke="#0891b2" strokeWidth="1.5" />
        <circle cx="38" cy="38" r="20" fill="none" stroke="#0891b2" strokeWidth="1" opacity=".3" className="pulse-ring" />
        <line x1="52" y1="52" x2="68" y2="68" stroke="#0891b2" strokeWidth="3" strokeLinecap="round" />
        <path d="M29 38 L36 46 L49 30" stroke="#0e7490" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="check-anim" />
        <circle cx="70" cy="20" r="10" fill="#10b981" />
        <path d="M65 20 L68 23 L75 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const HowItWorks = () => {
  const [current, setCurrent] = useState(0);
  const s = steps[current];

  return (
    <div className="hiw-wrap">
      {/* Barre des étapes */}
      <div className="hiw-steps-bar">
        {steps.map((step, i) => (
          <button
            key={i}
            className={`hiw-step-btn ${i < current ? "done" : i === current ? "active" : ""}`}
            onClick={() => setCurrent(i)}
          >
            <div className="hiw-step-circle">{i < current ? "✓" : i + 1}</div>
            <div className="hiw-step-line" />
            <div className="hiw-step-label">{step.label}</div>
          </button>
        ))}
      </div>

      {/* Panneau de contenu */}
      <div className="hiw-panel" key={current}>
        <div className="hiw-panel-inner">
          <div className="hiw-icon-area" style={{ background: s.iconBg }}>
            {s.icon}
          </div>
          <div className="hiw-text">
            <div className="hiw-step-num" style={{ color: s.stepColor }}>{s.num}</div>
            <div className="hiw-step-title">{s.title}</div>
            <div className="hiw-step-body">{s.body}</div>
            <div className="hiw-tags">
              {s.tags.map((tag, i) => (
                <span key={i} className="hiw-tag" style={{ background: tag.bg, color: tag.c }}>
                  {tag.t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="hiw-bottom">
        <button
          className="hiw-nav-btn"
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
        >
          ← Précédent
        </button>
        <div className="hiw-dots">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`hiw-dot ${i < current ? "done" : i === current ? "active" : ""}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
        <button
          className="hiw-nav-btn primary"
          onClick={() => setCurrent(Math.min(steps.length - 1, current + 1))}
          disabled={current === steps.length - 1}
        >
          Suivant →
        </button>
      </div>
    </div>
  );
};

export default HowItWorks;