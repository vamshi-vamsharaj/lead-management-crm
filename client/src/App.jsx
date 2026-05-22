import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import AppLayout from '@/components/layout/AppLayout'
import DashboardPage from '@/pages/DashboardPage'
import LeadsPage from '@/pages/LeadsPage'

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1C1F2E',
            color: '#F0F2F8',
            border: '1px solid #252836',
            borderRadius: '10px',
            fontSize: '13px',
            fontFamily: 'DM Sans, sans-serif',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          },
        }}
      />

      {import.meta.env.DEV && (
  <ReactQueryDevtools
    initialIsOpen={false}
    buttonPosition="bottom-left"
  />
)}
    </>
  )
}