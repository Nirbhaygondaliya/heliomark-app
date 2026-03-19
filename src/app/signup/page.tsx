'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle,
  User, Building, Phone, MapPin
} from 'lucide-react'
import { signUp } from '@/lib/auth'
import { updateProfile } from '@/lib/api'
import AuthLayout from '@/components/LogoHeader'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
  'Chandigarh', 'Dadra & Nagar Haveli and Daman & Diu',
  'Lakshadweep', 'Andaman & Nicobar Islands'
]

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    ownerName: '',
    phone: '',
    instituteName: '',
    state: '',
    city: '',
    targetExams: '',
    email: '',
    password: '',
  })

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number')
      setIsLoading(false)
      return
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      setIsLoading(false)
      return
    }

    try {
      // Create Cognito user
      await signUp(
        formData.email,
        formData.password,
        formData.ownerName,
        '+91' + formData.phone
      )

      // Store sign-up data in sessionStorage so OTP page can write to DynamoDB after verification
      sessionStorage.setItem('heliomark_signup_data', JSON.stringify({
        ownerName: formData.ownerName,
        phone: '+91' + formData.phone,
        instituteName: formData.instituteName,
        state: formData.state,
        city: formData.city,
        targetExams: formData.targetExams,
        email: formData.email,
        password: formData.password,
      }))

      // Redirect to login page — it will show OTP verification
      router.push('/login?verify=' + encodeURIComponent(formData.email))
    } catch (err: any) {
      setError(err.message || 'Sign up failed')
    } finally {
      setIsLoading(false)
    }
  }

  const Spinner = () => (
    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
  )

  return (
    <AuthLayout>
      <div className="flex-1 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-bold text-ink-900 mb-2">Create your account</h2>
            <p className="text-ink-400">Set up your institute profile to get started</p>
          </div>

          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fade-in">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignUp} className="card p-6 space-y-4">
            {/* Owner's Name */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Owner&apos;s name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={e => updateField('ownerName', e.target.value)}
                  placeholder="Prof. Amit Mehta"
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Phone number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500 text-sm font-medium">+91</span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210"
                  className="input-field pl-12"
                  required
                  maxLength={10}
                />
              </div>
            </div>

            {/* Institute Name */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Institute name</label>
              <div className="relative">
                <Building size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
                <input
                  type="text"
                  value={formData.instituteName}
                  onChange={e => updateField('instituteName', e.target.value)}
                  placeholder="Delhi Public School"
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            {/* State & City — side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">State</label>
                <select
                  value={formData.state}
                  onChange={e => updateField('state', e.target.value)}
                  className="dropdown-select"
                  required
                >
                  <option value="">Select state...</option>
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">City</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => updateField('city', e.target.value)}
                    placeholder="Ahmedabad"
                    className="input-field pl-11"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Target Exams */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Target exams</label>
              <input
                type="text"
                value={formData.targetExams}
                onChange={e => updateField('targetExams', e.target.value)}
                placeholder="GPSC, UPSC, CA Foundation..."
                className="input-field"
              />
              <p className="text-xs text-ink-300 mt-1">What exams does your institute prepare students for?</p>
            </div>

            {/* Divider */}
            <div className="border-t border-sand-200 pt-4">
              <p className="text-sm text-ink-400 mb-4">Account credentials</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => updateField('email', e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Set password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => updateField('password', e.target.value)}
                  placeholder="Min 8 characters"
                  className="input-field pl-11 pr-11"
                  required
                  minLength={8}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
              {isLoading ? <Spinner /> : (<>Create account <ArrowRight size={18} /></>)}
            </button>
          </form>

          <p className="text-center text-ink-400 mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-helio-600 font-medium hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}