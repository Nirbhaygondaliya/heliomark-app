'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  Download,
  Send,
  CheckCircle,
  FileText,
  Share2,
  Copy,
  Phone,
  MessageCircle,
  Home,
  Plus,
  Eye,
  Loader2,
  X
} from 'lucide-react'

// Mock evaluation result data
const mockResultData = {
  studentInfo: {
    seatNo: 'A-2024-001542',
    candidateName: 'Rajesh Kumar Sharma',
    exam: 'UPSC',
    subExam: 'Mains',
    paper: 'GS1',
    evaluatedBy: 'Prof. Mehta',
    date: '04 Jan 2025'
  },
  totalMarks: 250,
  obtainedMarks: 178,
  percentage: 71.2,
  grade: 'B+',
  pdfUrl: '/sample-evaluated.pdf', // Mock URL
  summary: {
    totalQuestions: 5,
    goodPoints: 12,
    missingPoints: 8,
    suggestions: 6
  }
}

export default function ResultPage() {
  const router = useRouter()
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [isSending, setIsSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    // Simulate download delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsDownloading(false)
    setDownloadSuccess(true)
    
    // In real app, this would trigger actual file download
    // window.open(mockResultData.pdfUrl, '_blank')
    
    // Reset success state after 3 seconds
    setTimeout(() => setDownloadSuccess(false), 3000)
  }

  const handleWhatsAppSend = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert('Please enter a valid phone number')
      return
    }

    setIsSending(true)
    // Simulate sending delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSending(false)
    setSendSuccess(true)

    // In real app, this would integrate with WhatsApp API
    // const fullNumber = countryCode + phoneNumber
    // window.open(`https://wa.me/${fullNumber}?text=...`, '_blank')
  }

  const handleNewEvaluation = () => {
    router.push('/evaluate')
  }

  const handleViewHistory = () => {
    router.push('/history')
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-green-600 bg-green-100'
      case 'B+':
      case 'B':
        return 'text-blue-600 bg-blue-100'
      case 'C+':
      case 'C':
        return 'text-amber-600 bg-amber-100'
      default:
        return 'text-red-600 bg-red-100'
    }
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
            <div>
              <h1 className="text-lg font-display font-semibold text-helio-900">
                Evaluation Complete
              </h1>
              <p className="text-sm text-helio-500">
                {mockResultData.studentInfo.paper} • {mockResultData.studentInfo.date}
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push('/evaluate')}
            className="p-2 hover:bg-helio-50 rounded-xl transition-colors"
          >
            <Home size={20} className="text-helio-700" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-8 px-4 max-w-3xl mx-auto">
        
        {/* Success Banner */}
        <div className="card p-6 mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle size={28} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-helio-900 mb-1">
                Evaluation Successful!
              </h2>
              <p className="text-helio-600">
                Answer sheet has been evaluated and is ready for download or sharing.
              </p>
            </div>
          </div>
        </div>

        {/* Result Card */}
        <div className="card p-6 mb-6">
          {/* Student Info */}
          <div className="flex items-start justify-between mb-6 pb-6 border-b border-helio-100">
            <div>
              <h3 className="font-display font-semibold text-helio-900 mb-1">
                {mockResultData.studentInfo.candidateName}
              </h3>
              <p className="text-sm text-helio-500">
                Seat No: {mockResultData.studentInfo.seatNo}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-helio-500 mb-1">
                {mockResultData.studentInfo.exam} {mockResultData.studentInfo.subExam}
              </div>
              <div className="text-sm font-medium text-helio-700">
                {mockResultData.studentInfo.paper}
              </div>
            </div>
          </div>

          {/* Score Display */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Marks */}
            <div className="text-center p-4 bg-helio-50 rounded-xl">
              <div className="text-3xl font-display font-bold text-helio-900 mb-1">
                {mockResultData.obtainedMarks}
              </div>
              <div className="text-sm text-helio-500">
                out of {mockResultData.totalMarks}
              </div>
            </div>

            {/* Percentage */}
            <div className="text-center p-4 bg-cream-100 rounded-xl">
              <div className="text-3xl font-display font-bold text-helio-900 mb-1">
                {mockResultData.percentage}%
              </div>
              <div className="text-sm text-helio-500">
                Percentage
              </div>
            </div>

            {/* Grade */}
            <div className="text-center p-4 bg-helio-50 rounded-xl">
              <div className={`text-3xl font-display font-bold mb-1 inline-block px-3 py-1 rounded-lg ${getGradeColor(mockResultData.grade)}`}>
                {mockResultData.grade}
              </div>
              <div className="text-sm text-helio-500">
                Grade
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-helio-50/50 rounded-xl">
            <div className="text-center">
              <div className="text-lg font-semibold text-helio-900">{mockResultData.summary.totalQuestions}</div>
              <div className="text-xs text-helio-500">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">{mockResultData.summary.goodPoints}</div>
              <div className="text-xs text-helio-500">Good Points</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-amber-600">{mockResultData.summary.missingPoints}</div>
              <div className="text-xs text-helio-500">Missing</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">{mockResultData.summary.suggestions}</div>
              <div className="text-xs text-helio-500">Suggestions</div>
            </div>
          </div>

          {/* Evaluator Info */}
          <div className="mt-4 pt-4 border-t border-helio-100 flex items-center justify-between text-sm">
            <span className="text-helio-500">
              Evaluated by: <span className="font-medium text-helio-700">{mockResultData.studentInfo.evaluatedBy} Sir</span>
            </span>
            <span className="text-helio-400 text-xs">
              Assisted by heliomark.ai
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card p-6 mb-6">
          <h3 className="font-display font-semibold text-helio-900 mb-4">
            Share Result
          </h3>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                downloadSuccess 
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-helio-200 hover:border-helio-400 hover:bg-helio-50 text-helio-700'
              }`}
            >
              {isDownloading ? (
                <Loader2 size={22} className="animate-spin" />
              ) : downloadSuccess ? (
                <CheckCircle size={22} />
              ) : (
                <Download size={22} />
              )}
              <div className="text-left">
                <div className="font-medium">
                  {downloadSuccess ? 'Downloaded!' : 'Download PDF'}
                </div>
                <div className="text-xs opacity-70">
                  Evaluated answer sheet
                </div>
              </div>
            </button>

            {/* WhatsApp Button */}
            <button
              onClick={() => setShowWhatsAppModal(true)}
              className="flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-green-200 hover:border-green-400 hover:bg-green-50 text-green-700 transition-all"
            >
              <MessageCircle size={22} />
              <div className="text-left">
                <div className="font-medium">Send to WhatsApp</div>
                <div className="text-xs opacity-70">
                  Share with student
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Next Actions */}
        <div className="card p-6">
          <h3 className="font-display font-semibold text-helio-900 mb-4">
            What's Next?
          </h3>
          
          <div className="space-y-3">
            <button
              onClick={handleNewEvaluation}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-helio-200 hover:border-helio-400 hover:bg-helio-50 transition-all text-left"
            >
              <div className="w-10 h-10 bg-helio-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Plus size={20} className="text-helio-600" />
              </div>
              <div>
                <div className="font-medium text-helio-900">New Evaluation</div>
                <div className="text-sm text-helio-500">Evaluate another answer sheet</div>
              </div>
            </button>

            <button
              onClick={handleViewHistory}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-helio-200 hover:border-helio-400 hover:bg-helio-50 transition-all text-left"
            >
              <div className="w-10 h-10 bg-helio-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Eye size={20} className="text-helio-600" />
              </div>
              <div>
                <div className="font-medium text-helio-900">View Past Evaluations</div>
                <div className="text-sm text-helio-500">See all your evaluated sheets</div>
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* WhatsApp Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-helio-100 flex items-center justify-between bg-green-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle size={20} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-helio-900">
                    Send to WhatsApp
                  </h3>
                  <p className="text-sm text-helio-500">Enter student's number</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowWhatsAppModal(false)
                  setSendSuccess(false)
                  setPhoneNumber('')
                }}
                className="p-2 hover:bg-green-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-helio-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {sendSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h4 className="text-lg font-display font-semibold text-helio-900 mb-2">
                    Sent Successfully!
                  </h4>
                  <p className="text-helio-500 mb-6">
                    Result has been sent to {countryCode} {phoneNumber}
                  </p>
                  <button
                    onClick={() => {
                      setShowWhatsAppModal(false)
                      setSendSuccess(false)
                      setPhoneNumber('')
                    }}
                    className="btn-primary"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  {/* Phone Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-helio-700 mb-2">
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      <select 
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="dropdown-select w-24"
                      >
                        <option value="+91">+91</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+971">+971</option>
                      </select>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="98765 43210"
                        className="input-field flex-1"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="p-4 bg-helio-50 rounded-xl mb-4">
                    <div className="text-sm text-helio-500 mb-2">Message Preview:</div>
                    <div className="text-sm text-helio-700">
                      <p className="mb-2">📋 *Evaluation Result*</p>
                      <p>Student: {mockResultData.studentInfo.candidateName}</p>
                      <p>Paper: {mockResultData.studentInfo.paper}</p>
                      <p>Score: {mockResultData.obtainedMarks}/{mockResultData.totalMarks} ({mockResultData.percentage}%)</p>
                      <p className="text-xs text-helio-400 mt-2">+ PDF attachment</p>
                    </div>
                  </div>

                  {/* Send Button */}
                  <button
                    onClick={handleWhatsAppSend}
                    disabled={isSending || phoneNumber.length < 10}
                    className="btn-primary w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send via WhatsApp
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
