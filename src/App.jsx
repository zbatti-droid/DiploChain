import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Register from './components/Register'
import Verify from './components/Verify'
import Student from './components/Student'
import Home from './components/Home'
import Login from './components/Login'

function PrivateRoute({ children, role }) {
  const userRole = localStorage.getItem('role')
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')

  if (!userRole || !currentUser) return <Navigate to="/login" replace />
  if (role && userRole !== role) return <Navigate to="/login" replace />

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={
          <PrivateRoute role="admin">
            <Register />
          </PrivateRoute>
        } />
        <Route path="/verify" element={
          <PrivateRoute role="employeur">
            <Verify />
          </PrivateRoute>
        } />
        <Route path="/student" element={
          <PrivateRoute role="etudiant">
            <Student />
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App