import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [registrations, setRegistrations] = useState([])
  const [rules, setRules] = useState({
    title: 'Tournament Rules',
    content: 'Match rules, Team requirements, Penalties, Registration rules, Fair play system'
  })
  const [adminInfo, setAdminInfo] = useState({
    phone1: '+6285857322097',
    phone2: '+628972337396',
    qrisImage: '/assets/qris-placeholder.png',
    bankAccount: '085716941474',
    bankName: 'DANA ONLY'
  })
  const [paymentStatus, setPaymentStatus] = useState({})

  // Load from localStorage
  useEffect(() => {
    const savedRegistrations = localStorage.getItem('registrations')
    const savedRules = localStorage.getItem('rules')
    const savedAdminInfo = localStorage.getItem('adminInfo')
    const savedPaymentStatus = localStorage.getItem('paymentStatus')

    if (savedRegistrations) setRegistrations(JSON.parse(savedRegistrations))
    if (savedRules) setRules(JSON.parse(savedRules))
    if (savedAdminInfo) setAdminInfo(JSON.parse(savedAdminInfo))
    if (savedPaymentStatus) setPaymentStatus(JSON.parse(savedPaymentStatus))
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('registrations', JSON.stringify(registrations))
  }, [registrations])

  useEffect(() => {
    localStorage.setItem('rules', JSON.stringify(rules))
  }, [rules])

  useEffect(() => {
    localStorage.setItem('adminInfo', JSON.stringify(adminInfo))
  }, [adminInfo])

  useEffect(() => {
    localStorage.setItem('paymentStatus', JSON.stringify(paymentStatus))
  }, [paymentStatus])

  const addRegistration = (registration) => {
    const newReg = { ...registration, id: Date.now(), status: 'pending' }
    setRegistrations([...registrations, newReg])
    return newReg
  }

  const updatePaymentStatus = (registrationId, status) => {
    setPaymentStatus(prev => ({
      ...prev,
      [registrationId]: status
    }))
  }

  const updateAdminInfo = (info) => {
    setAdminInfo(info)
  }

  const updateRules = (newRules) => {
    setRules(newRules)
  }

  return (
    <AppContext.Provider
      value={{
        registrations,
        addRegistration,
        rules,
        updateRules,
        adminInfo,
        updateAdminInfo,
        paymentStatus,
        updatePaymentStatus
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
