'use client'

import Footer from './Footer'

interface LogoHeaderProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: LogoHeaderProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-warm">
      {/* Simple header — logo only */}
      <header className="border-b border-sand-200 glass">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center">
          <a href="/login" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Heliomark" className="w-9 h-9 rounded-xl" />
            <span className="font-display font-bold text-lg text-ink-900 tracking-tight">
              heliomark.ai
            </span>
          </a>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  )
}