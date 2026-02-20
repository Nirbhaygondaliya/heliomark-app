'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  User,
  Mail,
  Shield,
  LogOut,
  Check,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle
} from 'lucide-react'
import { getCurrentUser, signOut, changePassword, isAuthenticated } from '@/lib/auth'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    const userData = getCurrentUser()
    setUser(userData)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    signOut()
    router.push('/login')
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess(false)

    // Validation
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('All fields are required')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long')
      return
    }

    if (passwordForm.newPassword === passwordForm.oldPassword) {
      setPasswordError('New password must be different from old password')
      return
    }

    setPasswordLoading(true)

    try {
      await changePassword(passwordForm.oldPassword, passwordForm.newPassword)
      setPasswordSuccess(true)
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
      setShowPasswordForm(false)

      // Hide success message after 3 seconds
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (err: any) {
      // Map common Cognito errors to user-friendly messages
      const errorMessage = err.message || 'Failed to change password'

      if (errorMessage.includes('Incorrect username or password') ||
          errorMessage.includes('NotAuthorizedException')) {
        setPasswordError('Current password is incorrect')
      } else if (errorMessage.includes('InvalidPasswordException')) {
        setPasswordError('Password does not meet requirements (min 8 characters)')
      } else if (errorMessage.includes('LimitExceededException')) {
        setPasswordError('Too many attempts. Please try again later')
      } else {
        setPasswordError(errorMessage)
      }
    } finally {
      setPasswordLoading(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-warm">
        <Loader2 className="w-8 h-8 animate-spin text-helio-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 glass border-b border-sand-200/60 z-40">
        <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/evaluate')}
              className="p-2 hover:bg-sand-100 rounded-xl transition-colors"
            >
              <ArrowLeft size={20} className="text-ink-400" />
            </button>
            <h1 className="text-lg font-display font-semibold text-ink-900">
              Profile
            </h1>
          </div>
        </div>
      </header>

      {/* Success Toast */}
      {passwordSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl shadow-lg">
            <Check size={18} />
            Password changed successfully
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-24 pb-8 px-4 max-w-2xl mx-auto">

        {/* Profile Header Card */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 bg-helio-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-display font-bold text-helio-600">
                {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-xl font-display font-semibold text-ink-900 mb-1">
                {user.name}
              </h2>
              <p className="text-ink-400 text-sm">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="card p-6 mb-6">
          <h3 className="font-display font-semibold text-ink-900 mb-4">
            Account Information
          </h3>

          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-helio-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail size={18} className="text-helio-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-ink-400">Email Address</div>
                <div className="flex items-center gap-2">
                  <span className="text-ink-900">{user.email}</span>
                  {user.emailVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                      <CheckCircle size={12} />
                      Verified
                    </span>
                  )}
                  {!user.emailVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                      <AlertCircle size={12} />
                      Not Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* User ID */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-helio-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <User size={18} className="text-helio-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-ink-400">User ID</div>
                <div className="text-ink-900 text-sm font-mono truncate">{user.userId}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card p-6 mb-6">
          <h3 className="font-display font-semibold text-ink-900 mb-4">
            Security & Password
          </h3>

          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-sand-50 transition-colors border-2 border-sand-200"
            >
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-helio-500" />
                <span className="text-ink-900 font-medium">Change Password</span>
              </div>
              <span className="text-ink-300">→</span>
            </button>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* Old Password */}
              <div>
                <label className="block text-sm font-semibold text-ink-500 mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-2 border-sand-200 rounded-2xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-helio-100 focus:border-helio-400 transition-all pr-12"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-ink-300 hover:text-ink-500"
                  >
                    {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-ink-500 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-2 border-sand-200 rounded-2xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-helio-100 focus:border-helio-400 transition-all pr-12"
                    placeholder="Enter new password (min 8 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-ink-300 hover:text-ink-500"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-ink-500 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-2 border-sand-200 rounded-2xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-helio-100 focus:border-helio-400 transition-all pr-12"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-ink-300 hover:text-ink-500"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {passwordError && (
                <div className="p-4 bg-red-50 border-2 border-red-100 rounded-2xl flex items-start gap-3">
                  <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{passwordError}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false)
                    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
                    setPasswordError('')
                  }}
                  className="flex-1 py-3 border-2 border-sand-200 text-ink-600 rounded-2xl font-semibold hover:bg-sand-50 transition-colors"
                  disabled={passwordLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-helio-500 text-white rounded-2xl font-semibold hover:bg-helio-600 transition-colors shadow-warm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Changing...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Logout */}
        <div className="card p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-red-200 text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-semibold">Sign Out</span>
          </button>
        </div>
      </main>
    </div>
  )
}
