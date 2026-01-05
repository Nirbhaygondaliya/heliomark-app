'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { signIn, signUp, confirmSignUp, resendConfirmationCode } from '@/lib/auth'

type AuthMode = 'signin' | 'signup' | 'confirm'

export default function LoginPage() {
  const router = useRouter()
  const [authMode, setAuthMode] = useState<AuthMode>('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    verificationCode: '',
  })

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const result = await signIn(formData.email, formData.password)
      
      if (result.success) {
        router.push('/evaluate')
      } else if (result.challenge === 'NEW_PASSWORD_REQUIRED') {
        setError('Please reset your password')
      }
    } catch (err: any) {
      if (err.message.includes('User is not confirmed')) {
        setAuthMode('confirm')
        // Resend confirmation code
        await resendConfirmationCode(formData.email)
        setError('Please verify your email. A new code has been sent.')
      } else {
        setError(err.message || 'Sign in failed')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      setIsLoading(false)
      return
    }
    
    try {
      await signUp(formData.email, formData.password, formData.name)
      setAuthMode('confirm')
      setError('')
    } catch (err: any) {
      setError(err.message || 'Sign up failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      await confirmSignUp(formData.email, formData.verificationCode)
      // Auto sign in after confirmation
      const result = await signIn(formData.email, formData.password)
      if (result.success) {
        router.push('/evaluate')
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    try {
      await resendConfirmationCode(formData.email)
      setError('Verification code sent!')
    } catch (err: any) {
      setError(err.message || 'Failed to resend code')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-helio-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-helio-700 via-helio-800 to-helio-900"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-helio-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cream-300/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Heliomark AI" className="w-16 h-16 object-contain" />
            </div>
          </div>
          
          <h1 className="text-5xl font-display font-bold text-white mb-6 leading-tight">
            Smart Evaluation,<br />
            <span className="text-cream-300">Simplified.</span>
          </h1>
          
          <p className="text-helio-200 text-lg max-w-md leading-relaxed">
            AI-powered answer sheet evaluation that saves time and provides detailed insights for better teaching outcomes.
          </p>
          
          {/* Features */}
          <div className="mt-12 space-y-4">
            {['Instant PDF evaluation', 'Detailed mark breakdown', 'WhatsApp sharing'].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-helio-200">
                <div className="w-2 h-2 bg-cream-300 rounded-full"></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft overflow-hidden">
              <img src="/logo.png" alt="Heliomark AI" className="w-12 h-12 object-contain" />
            </div>
            <h1 className="text-2xl font-display font-bold text-helio-900">Heliomark AI</h1>
          </div>

          <div className="card p-8">
            {/* Sign In Form */}
            {authMode === 'signin' && (
              <>
                <h2 className="text-2xl font-display font-semibold text-helio-900 mb-2">
                  Welcome back
                </h2>
                <p className="text-helio-500 mb-8">
                  Sign in to continue evaluating
                </p>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSignIn} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-helio-700 mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-helio-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="teacher@school.edu"
                        className="input-field pl-12"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-helio-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-helio-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        className="input-field pl-12 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-helio-400 hover:text-helio-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-helio-500 mt-6">
                  Don't have an account?{' '}
                  <button 
                    onClick={() => { setAuthMode('signup'); setError(''); }}
                    className="text-helio-700 font-medium hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </>
            )}

            {/* Sign Up Form */}
            {authMode === 'signup' && (
              <>
                <h2 className="text-2xl font-display font-semibold text-helio-900 mb-2">
                  Create account
                </h2>
                <p className="text-helio-500 mb-8">
                  Start evaluating answer sheets with AI
                </p>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSignUp} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-helio-700 mb-2">
                      Full name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Prof. Amit Mehta"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-helio-700 mb-2">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="teacher@school.edu"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-helio-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Min 8 characters"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-helio-700 mb-2">
                      Confirm password
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="input-field"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Create account
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-helio-500 mt-6">
                  Already have an account?{' '}
                  <button 
                    onClick={() => { setAuthMode('signin'); setError(''); }}
                    className="text-helio-700 font-medium hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </>
            )}

            {/* Verification Form */}
            {authMode === 'confirm' && (
              <>
                <h2 className="text-2xl font-display font-semibold text-helio-900 mb-2">
                  Verify your email
                </h2>
                <p className="text-helio-500 mb-8">
                  Enter the code sent to {formData.email}
                </p>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <form onSubmit={handleConfirmSignUp} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-helio-700 mb-2">
                      Verification code
                    </label>
                    <input
                      type="text"
                      value={formData.verificationCode}
                      onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
                      placeholder="123456"
                      className="input-field text-center text-2xl tracking-widest"
                      maxLength={6}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Verify & Sign in
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-helio-500 mt-6">
                  Didn't receive code?{' '}
                  <button 
                    onClick={handleResendCode}
                    className="text-helio-700 font-medium hover:underline"
                  >
                    Resend
                  </button>
                </p>
              </>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-helio-400 text-sm mt-6">
            © 2025 Heliomark AI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
