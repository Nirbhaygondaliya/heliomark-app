'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Check,
  X,
  Edit3,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  ThumbsUp,
  Download,
  Send,
  RotateCcw
} from 'lucide-react'

// Mock evaluated data - this would come from your backend
const mockEvaluationData = {
  studentInfo: {
    seatNo: 'A-2024-001542',
    candidateName: 'Rajesh Kumar Sharma',
    exam: 'UPSC',
    subExam: 'Mains',
    paper: 'GS1',
    evaluatedBy: 'Prof. Mehta',
    evaluationLevel: 'Standard',
    date: '04 Jan 2025'
  },
  totalMarks: 250,
  obtainedMarks: 178,
  answers: [
    {
      id: 1,
      questionNo: '1(a)',
      maxMarks: 15,
      obtainedMarks: 12,
      feedback: {
        good: ['Clear introduction with context', 'Good use of examples from Indian history'],
        missing: ['Did not mention recent policy changes', 'Conclusion could be stronger'],
        suggestions: ['Add data/statistics to support arguments', 'Include a diagram for better visualization']
      }
    },
    {
      id: 2,
      questionNo: '1(b)',
      maxMarks: 15,
      obtainedMarks: 10,
      feedback: {
        good: ['Structured approach to the answer'],
        missing: ['Key concept of federalism not explained', 'No mention of constitutional provisions'],
        suggestions: ['Reference Articles 245-255 for legislative relations']
      }
    },
    {
      id: 3,
      questionNo: '2(a)',
      maxMarks: 15,
      obtainedMarks: 14,
      feedback: {
        good: ['Excellent analysis', 'Comprehensive coverage of all aspects', 'Good contemporary examples'],
        missing: ['Minor factual error in date'],
        suggestions: ['Could add international comparison']
      }
    },
    {
      id: 4,
      questionNo: '2(b)',
      maxMarks: 15,
      obtainedMarks: 8,
      feedback: {
        good: ['Basic understanding shown'],
        missing: ['Superficial treatment of the topic', 'No case studies mentioned', 'Diagram missing'],
        suggestions: ['Study landmark Supreme Court judgments', 'Include flowchart for process explanation']
      }
    },
    {
      id: 5,
      questionNo: '3',
      maxMarks: 20,
      obtainedMarks: 16,
      feedback: {
        good: ['Well-structured essay format', 'Good introduction and conclusion', 'Balanced viewpoint presented'],
        missing: ['Could include more recent data'],
        suggestions: ['Add economic impact analysis']
      }
    }
  ]
}

// Mock PDF pages (in real app, these would be actual PDF page images)
const mockPdfPages = [
  { id: 1, label: 'Cover Page' },
  { id: 2, label: 'Answer 1(a)' },
  { id: 3, label: 'Answer 1(b)' },
  { id: 4, label: 'Answer 2(a)' },
  { id: 5, label: 'Answer 2(b)' },
  { id: 6, label: 'Answer 3' },
]

export default function ReviewPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [editingAnswer, setEditingAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState(mockEvaluationData.answers)
  const [tempMarks, setTempMarks] = useState<number>(0)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const totalPages = mockPdfPages.length
  const obtainedTotal = answers.reduce((sum, a) => sum + a.obtainedMarks, 0)
  const percentage = ((obtainedTotal / mockEvaluationData.totalMarks) * 100).toFixed(1)

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50))

  const handleEditMarks = (answerId: number, currentMarks: number) => {
    setEditingAnswer(answerId)
    setTempMarks(currentMarks)
  }

  const handleSaveMarks = (answerId: number, maxMarks: number) => {
    if (tempMarks >= 0 && tempMarks <= maxMarks) {
      setAnswers(prev => prev.map(a => 
        a.id === answerId ? { ...a, obtainedMarks: tempMarks } : a
      ))
    }
    setEditingAnswer(null)
  }

  const handleCancelEdit = () => {
    setEditingAnswer(null)
  }

  const handleConfirm = () => {
    setShowConfirmModal(true)
  }

  const handleProceedToResult = () => {
    // In real app, save final marks to backend first
    router.push('/result')
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
                Review Evaluation
              </h1>
              <p className="text-sm text-helio-500">
                {mockEvaluationData.studentInfo.candidateName} • {mockEvaluationData.studentInfo.seatNo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/evaluate')}
              className="btn-secondary flex items-center gap-2 py-2 px-4"
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">Re-evaluate</span>
            </button>
            <button
              onClick={handleConfirm}
              className="btn-primary flex items-center gap-2 py-2 px-4"
            >
              <Check size={16} />
              <span className="hidden sm:inline">Confirm</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Two Panel Layout */}
      <main className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
          
          {/* Left Panel - PDF Preview */}
          <div className="card flex flex-col overflow-hidden">
            {/* PDF Toolbar */}
            <div className="p-3 border-b border-helio-100 flex items-center justify-between bg-helio-50/50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} className="text-helio-600" />
                </button>
                <span className="text-sm text-helio-700 min-w-[100px] text-center">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} className="text-helio-600" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 50}
                  className="p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <ZoomOut size={18} className="text-helio-600" />
                </button>
                <span className="text-sm text-helio-600 min-w-[50px] text-center">{zoomLevel}%</span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 200}
                  className="p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <ZoomIn size={18} className="text-helio-600" />
                </button>
              </div>
            </div>

            {/* PDF Preview Area */}
            <div className="flex-1 overflow-auto p-4 bg-helio-100/50">
              <div 
                className="bg-white rounded-lg shadow-soft mx-auto transition-transform"
                style={{ 
                  width: `${(595 * zoomLevel) / 100}px`,
                  minHeight: `${(842 * zoomLevel) / 100}px`
                }}
              >
                {/* Mock PDF Content */}
                <div className="p-8 space-y-4">
                  {currentPage === 1 ? (
                    /* Cover Page */
                    <div className="text-center py-12 space-y-6">
                      <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-soft overflow-hidden">
                        <img src="/logo.png" alt="Heliomark AI" className="w-16 h-16 object-contain" />
                      </div>
                      <div>
                        <h2 className="text-xl font-display font-bold text-helio-900 mb-1">
                          Evaluation Report
                        </h2>
                        <p className="text-helio-500 text-sm">Generated by Heliomark AI</p>
                      </div>
                      
                      <div className="bg-helio-50 rounded-xl p-6 text-left max-w-sm mx-auto space-y-3">
                        <div className="flex justify-between">
                          <span className="text-helio-500">Seat No:</span>
                          <span className="font-medium text-helio-900">{mockEvaluationData.studentInfo.seatNo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-helio-500">Candidate:</span>
                          <span className="font-medium text-helio-900">{mockEvaluationData.studentInfo.candidateName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-helio-500">Paper:</span>
                          <span className="font-medium text-helio-900">{mockEvaluationData.studentInfo.paper}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-helio-500">Evaluated by:</span>
                          <span className="font-medium text-helio-900">{mockEvaluationData.studentInfo.evaluatedBy} Sir</span>
                        </div>
                        <div className="text-center text-xs text-helio-400 pt-2 border-t border-helio-200">
                          Assisted by heliomark.ai
                        </div>
                      </div>

                      <div className="bg-cream-100 rounded-xl p-6 max-w-sm mx-auto">
                        <div className="text-4xl font-display font-bold text-helio-900 mb-1">
                          {obtainedTotal} / {mockEvaluationData.totalMarks}
                        </div>
                        <div className="text-helio-600">Total Marks ({percentage}%)</div>
                      </div>
                    </div>
                  ) : (
                    /* Answer Page */
                    <div className="space-y-4">
                      <div className="text-sm text-helio-400">
                        {mockPdfPages[currentPage - 1]?.label}
                      </div>
                      <div className="h-96 bg-helio-50 rounded-lg flex items-center justify-center text-helio-400">
                        <div className="text-center">
                          <MessageSquare size={48} className="mx-auto mb-2 opacity-50" />
                          <p>Answer sheet content</p>
                          <p className="text-sm">Page {currentPage}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Page Thumbnails */}
            <div className="p-3 border-t border-helio-100 bg-helio-50/50">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {mockPdfPages.map((page, index) => (
                  <button
                    key={page.id}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`flex-shrink-0 w-16 h-20 rounded-lg border-2 transition-all ${
                      currentPage === index + 1
                        ? 'border-helio-600 bg-white'
                        : 'border-transparent bg-white/50 hover:bg-white'
                    }`}
                  >
                    <div className="w-full h-full flex items-center justify-center text-xs text-helio-500">
                      {index + 1}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Marks & Feedback */}
          <div className="card flex flex-col overflow-hidden">
            <div className="p-4 border-b border-helio-100 bg-helio-50/50">
              <h2 className="font-display font-semibold text-helio-900">Marks & Feedback</h2>
              <p className="text-sm text-helio-500">Click on marks to edit</p>
            </div>

            {/* Marks Summary */}
            <div className="p-4 border-b border-helio-100">
              <div className="flex items-center justify-between p-4 bg-cream-100 rounded-xl">
                <div>
                  <div className="text-sm text-helio-600">Total Score</div>
                  <div className="text-2xl font-display font-bold text-helio-900">
                    {obtainedTotal} / {mockEvaluationData.totalMarks}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-helio-600">Percentage</div>
                  <div className="text-2xl font-display font-bold text-helio-700">
                    {percentage}%
                  </div>
                </div>
              </div>
            </div>

            {/* Answer-wise Breakdown */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {answers.map((answer) => (
                <div key={answer.id} className="border border-helio-200 rounded-xl overflow-hidden">
                  {/* Answer Header */}
                  <div className="p-4 bg-helio-50 flex items-center justify-between">
                    <span className="font-medium text-helio-900">
                      Question {answer.questionNo}
                    </span>
                    
                    {/* Editable Marks */}
                    {editingAnswer === answer.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={tempMarks}
                          onChange={(e) => setTempMarks(Number(e.target.value))}
                          min={0}
                          max={answer.maxMarks}
                          className="w-16 px-2 py-1 text-center border border-helio-300 rounded-lg focus:border-helio-500 focus:ring-2 focus:ring-helio-100"
                          autoFocus
                        />
                        <span className="text-helio-500">/ {answer.maxMarks}</span>
                        <button
                          onClick={() => handleSaveMarks(answer.id, answer.maxMarks)}
                          className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditMarks(answer.id, answer.obtainedMarks)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-helio-200 hover:border-helio-400 transition-colors group"
                      >
                        <span className="font-semibold text-helio-900">
                          {answer.obtainedMarks}
                        </span>
                        <span className="text-helio-500">/ {answer.maxMarks}</span>
                        <Edit3 size={14} className="text-helio-400 group-hover:text-helio-600" />
                      </button>
                    )}
                  </div>

                  {/* Feedback Section */}
                  <div className="p-4 space-y-3">
                    {/* Good Points */}
                    {answer.feedback.good.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                          <ThumbsUp size={14} />
                          Good Points
                        </div>
                        <ul className="space-y-1 pl-5">
                          {answer.feedback.good.map((point, i) => (
                            <li key={i} className="text-sm text-helio-600 list-disc">{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Missing Points */}
                    {answer.feedback.missing.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
                          <AlertTriangle size={14} />
                          Missing Points
                        </div>
                        <ul className="space-y-1 pl-5">
                          {answer.feedback.missing.map((point, i) => (
                            <li key={i} className="text-sm text-helio-600 list-disc">{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Suggestions */}
                    {answer.feedback.suggestions.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                          <Lightbulb size={14} />
                          Suggestions
                        </div>
                        <ul className="space-y-1 pl-5">
                          {answer.feedback.suggestions.map((point, i) => (
                            <li key={i} className="text-sm text-helio-600 list-disc">{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-display font-semibold text-helio-900 mb-2">
                Confirm Evaluation
              </h3>
              <p className="text-helio-500">
                Final score: <strong>{obtainedTotal} / {mockEvaluationData.totalMarks}</strong> ({percentage}%)
              </p>
            </div>

            <div className="bg-helio-50 rounded-xl p-4 text-sm text-helio-600">
              Once confirmed, the evaluated answer sheet with marks and feedback will be ready for download or sharing.
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn-secondary flex-1"
              >
                Go Back
              </button>
              <button
                onClick={handleProceedToResult}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                Confirm
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
