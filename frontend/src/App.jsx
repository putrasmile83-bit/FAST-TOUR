import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AppProvider } from './context/AppContext'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import PaymentPage from './pages/PaymentPage'
import AdminContactPage from './pages/AdminContactPage'
import TournamentRulesPage from './pages/TournamentRulesPage'
import RegistrationPage from './pages/RegistrationPage'
import AdminPanel from './pages/AdminPanel'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/admin-contact" element={<AdminContactPage />} />
          <Route path="/tournament-rules" element={<TournamentRulesPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        </Routes>
        <ToastContainer position="bottom-right" />
      </Router>
    </AppProvider>
  )
}

export default App
