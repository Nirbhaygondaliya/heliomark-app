'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Upload, 
  FileText, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  History,
  User,
  LogOut,
  X
} from 'lucide-react'
import { isAuthenticated, getCurrentUser, signOut } from '@/lib/auth'
import { evaluateFile, getEvaluations } from '@/lib/api'

type EvaluationStatus = 'idle' | 'uploading' | 'processing' | 'complete' | 'error'

export default function EvaluatePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [status, setStatus] = useState<EvaluationStatus>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [result, setResult] = useState<any>(null)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [evaluationType, setEvaluationType] = useState('general')
  const [customPrompt, setCustomPrompt] = useState('')

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    setUser(getCurrentUser())
  }, [router])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'text/plain', 'image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF, TXT, or image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    setSelectedFile(file)
    setError('')
    setResult(null)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleEvaluate = async () => {
    if (!selectedFile) return

    setStatus('uploading')
    setError('')
    setUploadProgress(0)

    try {
      // Upload and evaluate
      setStatus('uploading')
      const evaluation = await evaluateFile(selectedFile, {
        evaluationType,
        prompt: customPrompt || undefined,
        onUploadProgress: (progress) => {
          setUploadProgress(progress)
          if (progress === 100) {
            setStatus('processing')
          }
        },
      })

      setResult(evaluation)
      setStatus('complete')
    } catch (err: any) {
      console.error('Evaluation error:', err)
      setError(err.message || 'Evaluation failed')
      setStatus('error')
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setStatus('idle')
    setUploadProgress(0)
    setError('')
    setResult(null)
  }

  const handleLogout = () => {
    signOut()
    router.push('/login')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-helio-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-helio-100 z-40">
        <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm overflow-hidden">
              <img src="/logo.png" alt="Heliomark AI" className="w-8 h-8 object-contain" />
            </div>
            <span className="font-display font-semibold text-helio-900">Heliomark AI</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/history')}
              className="p-2 hover:bg-helio-50 rounded-xl transition-colors"
              title="History"
            >
              <History size={20} className="text-helio-600" />
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="p-2 hover:bg-helio-50 rounded-xl transition-colors"
              title="Profile"
            >
              <User size={20} className="text-helio-600" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-helio-50 rounded-xl transition-colors"
              title="Sign out"
            >
              <LogOut size={20} className="text-helio-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-8 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-helio-900 mb-2">
            Evaluate Answer Sheet
          </h1>
          <p className="text-helio-500">
            Upload a PDF or image to get AI-powered evaluation
          </p>
        </div>

        {/* Upload Area */}
        {status === 'idle' && !selectedFile && (
          <div
            className={`card p-12 border-2 border-dashed transition-colors ${
              dragActive 
                ? 'border-helio-500 bg-helio-50' 
                : 'border-helio-200 hover:border-helio-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-helio-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload size={28} className="text-helio-600" />
              </div>
              <h3 className="text-lg font-display font-semibold text-helio-900 mb-2">
                Drop your file here
              </h3>
              <p className="text-helio-500 mb-6">
                or click to browse (PDF, TXT, JPG, PNG - max 10MB)
              </p>
              <label className="btn-primary cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.txt,.jpg,.jpeg,.png"
                  onChange={handleFileInput}
                  className="hidden"
                />
                Select File
              </label>
            </div>
          </div>
        )}

        {/* File Selected - Configure & Start */}
        {status === 'idle' && selectedFile && (
          <div className="card p-6 space-y-6">
            {/* File Info */}
            <div className="flex items-center gap-4 p-4 bg-helio-50 rounded-xl">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <FileText size={24} className="text-helio-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-helio-900 truncate">{selectedFile.name}</h4>
                <p className="text-sm text-helio-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={handleReset}
                className="p-2 hover:bg-helio-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-helio-500" />
              </button>
            </div>

            {/* Evaluation Type */}
            <div>
              <label className="block text-sm font-medium text-helio-700 mb-2">
                Evaluation Type
              </label>
              <select
                value={evaluationType}
                onChange={(e) => setEvaluationType(e.target.value)}
                className="dropdown-select w-full"
              >
                <option value="general">General Evaluation</option>
                <option value="upsc">UPSC Answer Sheet</option>
                <option value="cbse">CBSE Board Exam</option>
                <option value="essay">Essay Evaluation</option>
                <option value="custom">Custom Prompt</option>
              </select>
            </div>

            {/* Custom Prompt */}
            {evaluationType === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-helio-700 mb-2">
                  Custom Evaluation Prompt
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Enter your evaluation criteria and instructions..."
                  className="input-field min-h-[100px] resize-none"
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Start Button */}
            <button
              onClick={handleEvaluate}
              className="btn-primary w-full py-4 text-lg"
            >
              Start Evaluation
            </button>
          </div>
        )}

        {/* Uploading */}
        {status === 'uploading' && (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-helio-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload size={28} className="text-helio-600 animate-bounce" />
            </div>
            <h3 className="text-lg font-display font-semibold text-helio-900 mb-2">
              Uploading...
            </h3>
            <div className="w-full max-w-xs mx-auto bg-helio-100 rounded-full h-2 mb-2">
              <div 
                className="bg-helio-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-helio-500">{uploadProgress}%</p>
          </div>
        )}

        {/* Processing */}
        {status === 'processing' && (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-helio-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 size={28} className="text-helio-600 animate-spin" />
            </div>
            <h3 className="text-lg font-display font-semibold text-helio-900 mb-2">
              Evaluating with AI...
            </h3>
            <p className="text-helio-500">This may take a minute</p>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} className="text-red-600" />
            </div>
            <h3 className="text-lg font-display font-semibold text-helio-900 mb-2">
              Evaluation Failed
            </h3>
            <p className="text-helio-500 mb-6">{error}</p>
            <button onClick={handleReset} className="btn-primary">
              Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {status === 'complete' && result && (
          <div className="space-y-6">
            {/* Success Header */}
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-green-600" />
              </div>
              <h3 className="text-lg font-display font-semibold text-helio-900 mb-2">
                Evaluation Complete
              </h3>
              <p className="text-helio-500">{result.fileName}</p>
            </div>

            {/* Results Card */}
            <div className="card p-6">
              <h4 className="font-display font-semibold text-helio-900 mb-4">
                AI Evaluation Results
              </h4>
              <div className="prose prose-helio max-w-none">
                <div className="whitespace-pre-wrap text-helio-700 leading-relaxed">
                  {result.results}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button onClick={handleReset} className="btn-secondary flex-1">
                New Evaluation
              </button>
              <button 
                onClick={() => router.push('/history')} 
                className="btn-primary flex-1"
              >
                View History
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
