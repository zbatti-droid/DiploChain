import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Register from './components/Register'
import Verify from './components/Verify'
import Student from './components/Student'

function PrivateRoute({ children, role }) {
  const userRole = localStorage.getItem('role')
  if (!userRole) return <Navigate to="/" />
  if (role && userRole !== role) return <Navigate to="/" />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={
          <PrivateRoute role="institution">
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
      </Routes>
    </BrowserRouter>
  )
}

export default App