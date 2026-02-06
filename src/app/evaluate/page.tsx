'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
  X,
  Download,
  Clock,
  Zap
} from 'lucide-react'
import { isAuthenticated, getCurrentUser, signOut } from '@/lib/auth'
import { submitEvaluation, getJobStatus, getResultPdfUrl } from '@/lib/api'

type PageStatus = 'idle' | 'uploading' | 'queued' | 'processing' | 'completed' | 'failed'

export default function EvaluatePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [status, setStatus] = useState<PageStatus>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Job tracking
  const [jobId, setJobId] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<string>('')
  const [progress, setProgress] = useState<any>({})
  const [resultData, setResultData] = useState<any>(null)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    setUser(getCurrentUser())
  }, [router])

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [])

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
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF file')
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB')
      return
    }
    setSelectedFile(file)
    setError('')
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const startPolling = (id: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current)

    pollingRef.current = setInterval(async () => {
      try {
        const job = await getJobStatus(id)
        setCurrentStep(job.current_step || '')
        setProgress(job.progress || {})

        if (job.status === 'completed') {
          clearInterval(pollingRef.current!)
          pollingRef.current = null
          setStatus('completed')
          setResultData(job.result_data)
        } else if (job.status === 'failed') {
          clearInterval(pollingRef.current!)
          pollingRef.current = null
          setStatus('failed')
          setError(job.error || 'Evaluation failed')
        }
      } catch (err: any) {
        console.error('Polling error:', err)
      }
    }, 5000)
  }

  const handleEvaluate = async () => {
    if (!selectedFile) return

    setStatus('uploading')
    setError('')
    setUploadProgress(0)

    try {
      const result = await submitEvaluation(
        selectedFile,
        'upsc-mains-gs2',
        (p) => {
          setUploadProgress(p)
          if (p === 100) setStatus('queued')
        }
      )

      setJobId(result.job_id)
      setStatus('processing')
      startPolling(result.job_id)
    } catch (err: any) {
      console.error('Submit error:', err)
      setError(err.message || 'Failed to submit')
      setStatus('failed')
    }
  }

  const handleReset = () => {
    if (pollingRef.current) clearInterval(pollingRef.current)
    setSelectedFile(null)
    setStatus('idle')
    setUploadProgress(0)
    setError('')
    setJobId(null)
    setCurrentStep('')
    setProgress({})
    setResultData(null)
  }

  const handleLogout = () => {
    signOut()
    router.push('/login')
  }

  const handleDownloadPdf = () => {
    if (jobId) window.open(getResultPdfUrl(jobId), '_blank')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-helio-600" />
      </div>
    )
  }

  const questionsEvaluated = progress.questions_evaluated || 0
  const totalQuestions = progress.total_questions || 0
  const evalPercent = totalQuestions > 0 ? Math.round((questionsEvaluated / totalQuestions) * 100) : 0

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
            <button onClick={() => router.push('/history')} className="p-2 hover:bg-helio-50 rounded-xl transition-colors" title="History">
              <History size={20} className="text-helio-600" />
            </button>
            <button onClick={() => router.push('/profile')} className="p-2 hover:bg-helio-50 rounded-xl transition-colors" title="Profile">
              <User size={20} className="text-helio-600" />
            </button>
            <button onClick={handleLogout} className="p-2 hover:bg-helio-50 rounded-xl transition-colors" title="Sign out">
              <LogOut size={20} className="text-helio-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-8 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-helio-900 mb-2">Evaluate Answer Sheet</h1>
          <p className="text-helio-500">Upload a scanned answer sheet PDF for AI-powered evaluation</p>
        </div>

        {/* IDLE — Upload Area */}
        {status === 'idle' && !selectedFile && (
          <div
            className={`card p-12 border-2 border-dashed transition-colors ${
              dragActive ? 'border-helio-500 bg-helio-50' : 'border-helio-200 hover:border-helio-300'
            }`}
            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-helio-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload size={28} className="text-helio-600" />
              </div>
              <h3 className="text-lg font-display font-semibold text-helio-900 mb-2">Drop your answer sheet here</h3>
              <p className="text-helio-500 mb-6">PDF files only — max 50MB</p>
              <label className="btn-primary cursor-pointer">
                <input type="file" accept=".pdf" onChange={handleFileInput} className="hidden" />
                Select PDF
              </label>
            </div>
          </div>
        )}

        {/* IDLE — File Selected */}
        {status === 'idle' && selectedFile && (
          <div className="card p-6 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-helio-50 rounded-xl">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <FileText size={24} className="text-helio-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-helio-900 truncate">{selectedFile.name}</h4>
                <p className="text-sm text-helio-500">{(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</p>
              </div>
              <button onClick={() => { setSelectedFile(null); setError('') }} className="p-2 hover:bg-helio-100 rounded-lg">
                <X size={18} className="text-helio-500" />
              </button>
            </div>
            <div className="p-4 bg-cream-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={16} className="text-helio-600" />
                <span className="text-sm font-medium text-helio-700">Subject</span>
              </div>
              <p className="text-helio-900 font-medium">UPSC Mains — General Studies Paper II</p>
              <p className="text-xs text-helio-500 mt-1">20 questions • 250 marks • ~10 min evaluation</p>
            </div>
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <button onClick={handleEvaluate} className="btn-primary w-full py-4 text-lg">Start Evaluation</button>
          </div>
        )}

        {/* UPLOADING */}
        {status === 'uploading' && (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-helio-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload size={28} className="text-helio-600 animate-bounce" />
            </div>
            <h3 className="text-lg font-display font-semibold text-helio-900 mb-2">Uploading PDF...</h3>
            <div className="w-full max-w-xs mx-auto bg-helio-100 rounded-full h-2 mb-2">
              <div className="bg-helio-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            </div>
            <p className="text-helio-500">{uploadProgress}%</p>
          </div>
        )}

        {/* PROCESSING */}
        {(status === 'queued' || status === 'processing') && (
          <div className="card p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-helio-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 size={28} className="text-helio-600 animate-spin" />
              </div>
              <h3 className="text-lg font-display font-semibold text-helio-900 mb-1">Evaluating your answer sheet</h3>
              <p className="text-helio-500 flex items-center justify-center gap-2">
                <Clock size={14} /> This takes about 8-10 minutes
              </p>
            </div>
            <div className="space-y-3 max-w-md mx-auto">
              {[
                { key: 'pdf_ingestion', label: 'Converting PDF pages' },
                { key: 'answer_detection', label: 'Detecting questions' },
                { key: 'mapping_cleanup', label: 'Mapping answers' },
                { key: 'evaluation', label: 'Evaluating answers' },
                { key: 'pdf_generation', label: 'Generating feedback PDF' },
              ].map((step, idx) => {
                const stepKeys = ['pdf_ingestion', 'answer_detection', 'mapping_cleanup', 'evaluation', 'pdf_generation']
                const currentIdx = stepKeys.indexOf(currentStep)
                let stepStatus: 'done' | 'active' | 'pending' = idx < currentIdx ? 'done' : idx === currentIdx ? 'active' : 'pending'

                return (
                  <div key={step.key} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      stepStatus === 'done' ? 'bg-green-100' : stepStatus === 'active' ? 'bg-helio-100' : 'bg-gray-100'
                    }`}>
                      {stepStatus === 'done' ? <CheckCircle size={16} className="text-green-600" /> :
                       stepStatus === 'active' ? <Loader2 size={16} className="text-helio-600 animate-spin" /> :
                       <span className="w-2 h-2 bg-gray-300 rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <span className={`text-sm ${
                        stepStatus === 'done' ? 'text-green-700' : stepStatus === 'active' ? 'text-helio-900 font-medium' : 'text-helio-400'
                      }`}>{step.label}</span>
                      {stepStatus === 'active' && step.key === 'evaluation' && totalQuestions > 0 && (
                        <div className="mt-1 flex items-center gap-2">
                          <div className="flex-1 bg-helio-100 rounded-full h-1.5">
                            <div className="bg-helio-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${evalPercent}%` }} />
                          </div>
                          <span className="text-xs text-helio-500">{questionsEvaluated}/{totalQuestions}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-center text-xs text-helio-400 mt-6">You can close this page and come back later</p>
          </div>
        )}

        {/* COMPLETED */}
        {status === 'completed' && resultData && (
          <div className="card p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-green-600" />
              </div>
              <h3 className="text-xl font-display font-semibold text-helio-900 mb-2">Evaluation Complete!</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-helio-50 rounded-xl">
                <div className="text-3xl font-display font-bold text-helio-900">{resultData.obtained_marks}</div>
                <div className="text-sm text-helio-500">out of {resultData.total_marks}</div>
              </div>
              <div className="text-center p-4 bg-cream-100 rounded-xl">
                <div className="text-3xl font-display font-bold text-helio-900">{resultData.percentage}%</div>
                <div className="text-sm text-helio-500">Percentage</div>
              </div>
              <div className="text-center p-4 bg-helio-50 rounded-xl">
                <div className={`text-2xl font-display font-bold ${
                  resultData.grade === 'EXCELLENT' ? 'text-green-600' :
                  resultData.grade === 'GOOD' ? 'text-blue-600' :
                  resultData.grade === 'AVERAGE' ? 'text-amber-600' : 'text-red-600'
                }`}>{resultData.grade}</div>
                <div className="text-sm text-helio-500">Grade</div>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={handleDownloadPdf} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3">
                <Download size={18} /> Download Feedback PDF
              </button>
              <button onClick={handleReset} className="flex-1 py-3 border-2 border-helio-200 text-helio-700 rounded-xl font-medium hover:bg-helio-50 transition-colors">
                Evaluate Another
              </button>
            </div>
          </div>
        )}

        {/* FAILED */}
        {status === 'failed' && (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} className="text-red-600" />
            </div>
            <h3 className="text-lg font-display font-semibold text-helio-900 mb-2">Evaluation Failed</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button onClick={handleReset} className="btn-primary px-8 py-3">Try Again</button>
          </div>
        )}
      </main>
    </div>
  )
}
