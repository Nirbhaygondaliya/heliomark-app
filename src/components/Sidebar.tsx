'use client'

import { usePathname } from 'next/navigation'
import {
  Upload,
  Loader2,
  CheckCircle,
  CreditCard,
  UserCircle,
  Info,
  LogOut,
  X
} from 'lucide-react'
import { signOut } from '@/lib/auth'
import { useRouter } from 'next/navigation'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { href: '/evaluate', label: 'Upload / Evaluate', icon: Upload },
  { href: '/processing', label: 'Processing', icon: Loader2 },
  { href: '/evaluated', label: 'Evaluated List', icon: CheckCircle },
  { href: '/usage', label: 'Usage / Credits', icon: CreditCard },
  { href: '/profile', label: 'Profile / Settings', icon: UserCircle },
  { href: '/about', label: 'About', icon: Info },
]

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    signOut()
    router.push('/login')
  }

  const handleNavClick = (href: string) => {
    router.push(href)
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink-950/30 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-soft border-l border-sand-200 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Close button */}
        <div className="flex items-center justify-between p-4 border-b border-sand-100">
          <span className="font-display font-bold text-ink-900">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-sand-100 transition-colors"
            aria-label="Close menu"
          >
            <X size={20} className="text-ink-500" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="p-3 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors mb-1 ${
                  isActive
                    ? 'bg-helio-50 text-helio-700 font-semibold'
                    : 'text-ink-600 hover:bg-sand-50 hover:text-ink-900'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Logout at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-sand-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}