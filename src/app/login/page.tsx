'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle,
  CheckCircle, Play
} from 'lucide-react'
import {
  signIn, confirmSignUp,
  resendConfirmationCode, forgotPassword, confirmForgotPassword
} from '@/lib/auth'
import { getProfile, updateProfile } from '@/lib/api'
import AuthLayout from '@/components/LogoHeader'

type AuthMode = 'signin' | 'signup_otp' | 'forgot' | 'forgot_confirm'

export default function LoginPage() {
  const router = useRouter()
  const [authMode, setAuthMode] = useState<AuthMode>('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: ['', '', '', '', '', ''],
  })

  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (authMode === 'signup_otp' || authMode === 'forgot_confirm') {
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    }
  }, [authMode])

  // Handle redirect from /signup — auto-switch to OTP mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const verifyEmail = params.get('verify')
    if (verifyEmail) {
      const signupData = sessionStorage.getItem('heliomark_signup_data')
      if (signupData) {
        const data = JSON.parse(signupData)
        setFormData(prev => ({ ...prev, email: data.email, password: data.password }))
      } else {
        setFormData(prev => ({ ...prev, email: verifyEmail }))
      }
      setAuthMode('signup_otp')
      setSuccess('Verification code sent to ' + verifyEmail)
    }
  }, [])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1)
    if (value && !/^\d$/.test(value)) return
    const newOtp = [...formData.otp]
    newOtp[index] = value
    setFormData({ ...formData, otp: newOtp })
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const newOtp = [...formData.otp]
    for (let i = 0; i < 6; i++) newOtp[i] = pasted[i] || ''
    setFormData({ ...formData, otp: newOtp })
    otpRefs.current[Math.min(pasted.length, 6) - 1]?.focus()
  }

  const otpValue = formData.otp.join('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const result = await signIn(formData.email, formData.password)
      if (result.success) {
        try {
          const profile = await getProfile()
          if (profile.institution) {
            localStorage.setItem('heliomark_institution', profile.institution)
          }
        } catch (e) {}
        router.push('/evaluate')
      } else if (result.challenge === 'NEW_PASSWORD_REQUIRED') {
        setError('Please reset your password')
      }
    } catch (err: any) {
      if (err.message?.includes('User is not confirmed')) {
        await resendConfirmationCode(formData.email)
        setAuthMode('signup_otp')
        setError('Please verify your email first. A new code has been sent.')
      } else {
        setError(err.message || 'Sign in failed')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // OTP verification — used when redirected from /signup or unconfirmed user
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otpValue.length !== 6) { setError('Please enter the 6-digit code'); return }
    setIsLoading(true)
    setError('')
    try {
      await confirmSignUp(formData.email, otpValue)
      const result = await signIn(formData.email, formData.password)
      if (result.success) {
        // Write institute profile to DynamoDB if sign-up data exists
        const signupData = sessionStorage.getItem('heliomark_signup_data')
        if (signupData) {
          try {
            const data = JSON.parse(signupData)
            await updateProfile({
              name: data.ownerName,
              phone: data.phone,
              institution: data.instituteName,
              state: data.state,
              city: data.city,
              targetExams: data.targetExams,
            })
            localStorage.setItem('heliomark_institution', data.instituteName)
            sessionStorage.removeItem('heliomark_signup_data')
          } catch (profileErr) {
            console.error('Profile save failed:', profileErr)
          }
        }
        router.push('/evaluate')
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      await resendConfirmationCode(formData.email)
      setSuccess('New code sent!')
      setError('')
      setFormData({ ...formData, otp: ['', '', '', '', '', ''] })
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to resend code')
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      await forgotPassword(formData.email)
      setAuthMode('forgot_confirm')
      setSuccess('Reset code sent to ' + formData.email)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otpValue.length !== 6) { setError('Please enter the 6-digit code'); return }
    if (formData.password.length < 8) { setError('Password must be at least 8 characters'); return }
    setIsLoading(true)
    setError('')
    try {
      await confirmForgotPassword(formData.email, otpValue, formData.password)
      const result = await signIn(formData.email, formData.password)
      if (result.success) router.push('/evaluate')
    } catch (err: any) {
      setError(err.message || 'Password reset failed')
    } finally {
      setIsLoading(false)
    }
  }

  const switchMode = (mode: AuthMode) => {
    setAuthMode(mode)
    setError('')
    setSuccess('')
    setFormData(prev => ({ ...prev, otp: ['', '', '', '', '', ''] }))
  }

  const ErrorBanner = () => error ? (
    <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fade-in">
      <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-red-700">{error}</p>
    </div>
  ) : null

  const SuccessBanner = () => success ? (
    <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 animate-fade-in">
      <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-green-700">{success}</p>
    </div>
  ) : null

  const Spinner = () => (
    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
  )

  const OtpInputs = () => (
    <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
      {formData.otp.map((digit, i) => (
        <input
          key={i}
          ref={el => { otpRefs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={e => handleOtpChange(i, e.target.value)}
          onKeyDown={e => handleOtpKeyDown(i, e)}
          className="w-12 h-14 text-center text-2xl font-display font-semibold rounded-xl border border-helio-200 bg-white text-helio-900 focus:border-helio-500 focus:ring-2 focus:ring-helio-100 transition-all duration-200"
        />
      ))}
    </div>
  )

  return (
    <AuthLayout>
      <div className="flex-1 flex">
        {/* Left — Video placeholder */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="w-full max-w-lg">
            <h2 className="text-2xl font-display font-bold text-ink-900 mb-6">
              HOW THIS WORKS?
            </h2>
            <div className="aspect-video bg-white rounded-2xl border-2 border-sand-200 flex items-center justify-center cursor-pointer hover:border-helio-300 transition-colors shadow-card">
              <div className="w-16 h-16 rounded-full border-2 border-ink-300 flex items-center justify-center">
                <Play size={28} className="text-ink-400 ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Right — Auth forms */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">

            {authMode === 'signin' && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-display font-semibold text-ink-900 mb-2">Welcome back</h2>
                <p className="text-ink-400 mb-8">Sign in to your account</p>
                <ErrorBanner />
                <SuccessBanner />
                <form onSubmit={handleSignIn} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-2">Email address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
                      <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" className="input-field pl-11" required />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-ink-700">Password</label>
                      <button type="button" onClick={() => switchMode('forgot')} className="text-sm text-helio-500 hover:text-helio-700 transition-colors">Forgot password?</button>
                    </div>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
                      <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Enter your password" className="input-field pl-11 pr-11" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-600">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                    {isLoading ? <Spinner /> : (<>Sign in <ArrowRight size={18} /></>)}
                  </button>
                </form>
                <p className="text-center text-ink-400 mt-6">
                  Don&apos;t have an account?{' '}
                  <a href="/signup" className="text-helio-600 font-medium hover:underline">Sign up</a>
                </p>
              </div>
            )}

            {authMode === 'signup_otp' && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-display font-semibold text-ink-900 mb-2">Verify your email</h2>
                <p className="text-ink-400 mb-8">
                  Enter the 6-digit code sent to{' '}
                  <span className="font-medium text-ink-700">{formData.email}</span>
                </p>
                <ErrorBanner />
                <SuccessBanner />
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <OtpInputs />
                  <button type="submit" disabled={isLoading || otpValue.length !== 6} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                    {isLoading ? <Spinner /> : (<>Verify & Sign in <ArrowRight size={18} /></>)}
                  </button>
                </form>
                <p className="text-center text-ink-400 mt-6">
                  Didn&apos;t receive code?{' '}
                  <button onClick={handleResendOtp} className="text-helio-600 font-medium hover:underline">Resend</button>
                </p>
              </div>
            )}

            {authMode === 'forgot' && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-display font-semibold text-ink-900 mb-2">Reset password</h2>
                <p className="text-ink-400 mb-8">We&apos;ll send a reset code to your email</p>
                <ErrorBanner />
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-2">Email address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
                      <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" className="input-field pl-11" required />
                    </div>
                  </div>
                  <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                    {isLoading ? <Spinner /> : (<>Send reset code <ArrowRight size={18} /></>)}
                  </button>
                </form>
                <p className="text-center mt-6">
                  <button onClick={() => switchMode('signin')} className="text-sm text-ink-400 hover:text-ink-700 transition-colors">&larr; Back to sign in</button>
                </p>
              </div>
            )}

            {authMode === 'forgot_confirm' && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-display font-semibold text-ink-900 mb-2">Enter reset code</h2>
                <p className="text-ink-400 mb-8">
                  Code sent to{' '}
                  <span className="font-medium text-ink-700">{formData.email}</span>
                </p>
                <ErrorBanner />
                <SuccessBanner />
                <form onSubmit={handleForgotConfirm} className="space-y-5">
                  <OtpInputs />
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-2">New password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
                      <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Min 8 characters" className="input-field pl-11 pr-11" required minLength={8} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-600">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={isLoading || otpValue.length !== 6} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                    {isLoading ? <Spinner /> : (<>Reset & Sign in <ArrowRight size={18} /></>)}
                  </button>
                </form>
                <p className="text-center mt-6">
                  <button onClick={() => switchMode('signin')} className="text-sm text-ink-400 hover:text-ink-700 transition-colors">&larr; Back to sign in</button>
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </AuthLayout>
  )
}