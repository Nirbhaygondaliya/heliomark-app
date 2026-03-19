'use client'

import { Menu } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 glass border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <a href="/evaluate" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Heliomark" className="w-9 h-9 rounded-xl" />
          <span className="font-display font-bold text-lg text-ink-900 tracking-tight">
            heliomark.ai
          </span>
        </a>

        {/* Hamburger */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl hover:bg-sand-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} className="text-ink-700" />
        </button>
      </div>
    </header>
  )
}