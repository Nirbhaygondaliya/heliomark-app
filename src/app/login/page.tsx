'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Phone, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email')
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    otp: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Navigate to evaluation page
    router.push('/evaluate')
  }

  const handleSendOtp = async () => {
    setIsLoading(true)
    // Simulate OTP send
    await new Promise(resolve => setTimeout(resolve, 800))
    setOtpSent(true)
    setIsLoading(false)
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

      {/* Right Panel - Login Form */}
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
            <h2 className="text-2xl font-display font-semibold text-helio-900 mb-2">
              Welcome back
            </h2>
            <p className="text-helio-500 mb-8">
              Sign in to continue evaluating
            </p>

            {/* Login Method Toggle */}
            <div className="flex gap-2 p-1 bg-helio-50 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  loginMethod === 'email'
                    ? 'bg-white text-helio-900 shadow-sm'
                    : 'text-helio-500 hover:text-helio-700'
                }`}
              >
                <Mail size={16} />
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  loginMethod === 'phone'
                    ? 'bg-white text-helio-900 shadow-sm'
                    : 'text-helio-500 hover:text-helio-700'
                }`}
              >
                <Phone size={16} />
                Phone
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email or Phone Input */}
              {loginMethod === 'email' ? (
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
              ) : (
                <div>
                  <label className="block text-sm font-medium text-helio-700 mb-2">
                    Phone number
                  </label>
                  <div className="flex gap-2">
                    <select className="dropdown-select w-24">
                      <option>+91</option>
                      <option>+1</option>
                      <option>+44</option>
                    </select>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="98765 43210"
                      className="input-field flex-1"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Auth Method Toggle */}
              <div className="flex gap-2 p-1 bg-helio-50 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setAuthMethod('password'); setOtpSent(false); }}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    authMethod === 'password'
                      ? 'bg-white text-helio-900 shadow-sm'
                      : 'text-helio-500 hover:text-helio-700'
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('otp')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    authMethod === 'otp'
                      ? 'bg-white text-helio-900 shadow-sm'
                      : 'text-helio-500 hover:text-helio-700'
                  }`}
                >
                  OTP
                </button>
              </div>

              {/* Password or OTP Input */}
              {authMethod === 'password' ? (
                <div>
                  <label className="block text-sm font-medium text-helio-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="input-field pr-12"
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
                  <div className="text-right mt-2">
                    <a href="#" className="text-sm text-helio-600 hover:text-helio-800">
                      Forgot password?
                    </a>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-helio-700 mb-2">
                    One-Time Password
                  </label>
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isLoading}
                      className="btn-secondary w-full"
                    >
                      {isLoading ? 'Sending...' : 'Send OTP'}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={formData.otp}
                        onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                        placeholder="Enter 6-digit OTP"
                        className="input-field text-center text-lg tracking-widest"
                        maxLength={6}
                        required
                      />
                      <p className="text-sm text-helio-500 text-center">
                        OTP sent to {loginMethod === 'email' ? formData.email : formData.phone}
                        <button type="button" onClick={handleSendOtp} className="text-helio-700 ml-2 hover:underline">
                          Resend
                        </button>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || (authMethod === 'otp' && !otpSent)}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* Sign up link */}
            <p className="text-center text-helio-500 mt-6">
              Don't have an account?{' '}
              <a href="#" className="text-helio-700 font-medium hover:underline">
                Sign up
              </a>
            </p>
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
