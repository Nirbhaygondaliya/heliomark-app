'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Edit3,
  Camera,
  Save,
  X,
  Shield,
  Bell,
  LogOut,
  ChevronRight,
  Check
} from 'lucide-react'

// Mock user data
const mockUserData = {
  name: 'Prof. Amit Mehta',
  email: 'amit.mehta@school.edu',
  phone: '+91 98765 43210',
  institution: 'Delhi Public School',
  location: 'New Delhi, India',
  role: 'Senior Teacher',
  subjects: ['History', 'Political Science', 'Geography'],
  joinedDate: 'December 2024',
  evaluationsCount: 47,
  avatar: null
}

export default function ProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState(mockUserData)
  const [tempData, setTempData] = useState(mockUserData)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)

  const handleEdit = () => {
    setTempData(userData)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setTempData(userData)
    setIsEditing(false)
  }

  const handleSave = () => {
    setUserData(tempData)
    setIsEditing(false)
    setShowSaveSuccess(true)
    setTimeout(() => setShowSaveSuccess(false), 3000)
  }

  const handleLogout = () => {
    // In real app, clear auth tokens
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-helio-100 z-40">
        <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/evaluate')}
              className="p-2 hover:bg-helio-50 rounded-xl transition-colors"
            >
              <ArrowLeft size={20} className="text-helio-700" />
            </button>
            <h1 className="text-lg font-display font-semibold text-helio-900">
              Profile
            </h1>
          </div>

          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="btn-secondary py-2 px-4 flex items-center gap-2"
            >
              <Edit3 size={16} />
              <span className="hidden sm:inline">Edit</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-helio-50 rounded-xl transition-colors"
              >
                <X size={20} className="text-helio-500" />
              </button>
              <button
                onClick={handleSave}
                className="btn-primary py-2 px-4 flex items-center gap-2"
              >
                <Save size={16} />
                <span className="hidden sm:inline">Save</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Save Success Toast */}
      {showSaveSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl shadow-lg">
            <Check size={18} />
            Profile saved successfully
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-24 pb-8 px-4 max-w-2xl mx-auto">
        
        {/* Profile Header Card */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-helio-100 rounded-full flex items-center justify-center">
                {userData.avatar ? (
                  <img src={userData.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-3xl font-display font-bold text-helio-600">
                    {userData.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                )}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-helio-700 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-helio-800 transition-colors">
                  <Camera size={16} />
                </button>
              )}
            </div>

            {/* Basic Info */}
            <div className="text-center sm:text-left flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.name}
                  onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
                  className="input-field text-xl font-display font-semibold mb-2"
                />
              ) : (
                <h2 className="text-xl font-display font-semibold text-helio-900 mb-1">
                  {userData.name}
                </h2>
              )}
              <p className="text-helio-500 mb-2">{userData.role}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {userData.subjects.map((subject, i) => (
                  <span key={i} className="px-3 py-1 bg-helio-100 text-helio-700 text-sm rounded-full">
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="text-center px-6 py-4 bg-cream-100 rounded-xl">
              <div className="text-2xl font-display font-bold text-helio-900">
                {userData.evaluationsCount}
              </div>
              <div className="text-sm text-helio-500">Evaluations</div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card p-6 mb-6">
          <h3 className="font-display font-semibold text-helio-900 mb-4">
            Contact Information
          </h3>
          
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-helio-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail size={18} className="text-helio-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-helio-500">Email</div>
                {isEditing ? (
                  <input
                    type="email"
                    value={tempData.email}
                    onChange={(e) => setTempData({ ...tempData, email: e.target.value })}
                    className="input-field mt-1"
                  />
                ) : (
                  <div className="text-helio-900">{userData.email}</div>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-helio-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone size={18} className="text-helio-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-helio-500">Phone</div>
                {isEditing ? (
                  <input
                    type="tel"
                    value={tempData.phone}
                    onChange={(e) => setTempData({ ...tempData, phone: e.target.value })}
                    className="input-field mt-1"
                  />
                ) : (
                  <div className="text-helio-900">{userData.phone}</div>
                )}
              </div>
            </div>

            {/* Institution */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-helio-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building size={18} className="text-helio-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-helio-500">Institution</div>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempData.institution}
                    onChange={(e) => setTempData({ ...tempData, institution: e.target.value })}
                    className="input-field mt-1"
                  />
                ) : (
                  <div className="text-helio-900">{userData.institution}</div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-helio-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-helio-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-helio-500">Location</div>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempData.location}
                    onChange={(e) => setTempData({ ...tempData, location: e.target.value })}
                    className="input-field mt-1"
                  />
                ) : (
                  <div className="text-helio-900">{userData.location}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="card p-6 mb-6">
          <h3 className="font-display font-semibold text-helio-900 mb-4">
            Settings
          </h3>
          
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-helio-50 transition-colors">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-helio-600" />
                <span className="text-helio-900">Security & Password</span>
              </div>
              <ChevronRight size={18} className="text-helio-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-helio-50 transition-colors">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-helio-600" />
                <span className="text-helio-900">Notifications</span>
              </div>
              <ChevronRight size={18} className="text-helio-400" />
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="card p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
          
          <p className="text-center text-xs text-helio-400 mt-4">
            Member since {userData.joinedDate}
          </p>
        </div>
      </main>
    </div>
  )
}
