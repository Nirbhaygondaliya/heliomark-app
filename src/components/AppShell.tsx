'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { isAuthenticated } from '@/lib/auth'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    setAuthChecked(true)
  }, [router])

  // Show loading spinner while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-warm">
        <Loader2 className="w-8 h-8 animate-spin text-helio-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-warm">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  )
}