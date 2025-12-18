import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import Login from './components/Login'
import SignUp from './components/SignUp'
import VerificationPending from './components/VerificationPending'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Transactions from './components/Transactions'
import Inventory from './components/Inventory'
import Users from './components/Users'

const PrivateRoute = ({ children, requiredRoles }) => {
  const { currentUser, userRole, loading } = useAuth()

  if (loading) {
    // STYLED LOADING SPINNER
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-parchment">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-stone-200 border-t-deep-gold"></div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  if (userRole === 'pending') {
    return <Navigate to="/verification-pending" />
  }

  if (requiredRoles && !requiredRoles.includes(userRole)) {
    return <Navigate to="/dashboard" />
  }

  return <Layout>{children}</Layout>
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verification-pending" element={<VerificationPending />} />
      
      <Route
        path="/dashboard"
        element={
          <PrivateRoute requiredRoles={['admin', 'treasurer', 'member']}>
            <Dashboard />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/transactions"
        element={
          <PrivateRoute requiredRoles={['admin', 'treasurer']}>
            <Transactions />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/inventory"
        element={
          <PrivateRoute requiredRoles={['admin', 'treasurer', 'member']}>
            <Inventory />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/users"
        element={
          <PrivateRoute requiredRoles={['admin']}>
            <Users />
          </PrivateRoute>
        }
      />
      
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </LanguageProvider>
    </Router>
  )
}

export default App
