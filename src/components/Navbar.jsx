import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const role = localStorage.getItem('role')

  function handleLogout() {
    localStorage.removeItem('role')
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        🎓 Système de Vérification des Diplômes
      </div>
      <div className="navbar-links">
        {role === 'institution' && (
          <Link to="/register">📋 Enregistrer</Link>
        )}
        {role === 'employeur' && (
          <Link to="/verify">🔍 Vérifier</Link>
        )}
        {role === 'etudiant' && (
          <Link to="/student">🎓 Mon diplôme</Link>
        )}
        {role && (
          <button className="btn-logout" onClick={handleLogout}>
            🚪 Déconnexion
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar