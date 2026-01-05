'use client'

import { useState, useRef } from 'react'
import { 
  Menu, 
  X, 
  Upload, 
  FileText, 
  ChevronRight,
  User,
  History,
  LogOut,
  Home,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

// Exam data structure
const examData = {
  'UPSC': {
    subExams: ['Prelims', 'Mains'],
    papers: {
      'Prelims': ['GS Paper 1', 'GS Paper 2 (CSAT)'],
      'Mains': ['GS1', 'GS2', 'GS3', 'GS4', 'Essay', 'Optional Paper 1', 'Optional Paper 2']
    }
  },
  'GPSC': {
    subExams: ['Class 1-2', 'Class 3'],
    papers: {
      'Class 1-2': ['GS1', 'GS2', 'GS3', 'GS4', 'Essay', 'Gujarati Language', 'English Language'],
      'Class 3': ['GS1', 'GS2', 'Gujarati Language', 'English Language']
    }
  },
  'CBSE Class 12th': {
    subExams: ['Science', 'Arts', 'Commerce'],
    papers: {
      'Science': ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Computer Science'],
      'Arts': ['History', 'Geography', 'Political Science', 'Economics', 'English', 'Psychology'],
      'Commerce': ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'English']
    }
  }
}

const evaluationLevels = [
  { id: 'lenient', label: 'Lenient', description: 'Generous marking, focuses on key points' },
  { id: 'standard', label: 'Standard', description: 'Balanced evaluation approach' },
  { id: 'strict', label: 'Strict', description: 'Rigorous marking, detailed assessment' }
]

interface UploadedFile {
  id: string
  name: string
  size: string
  status: 'pending' | 'ready'
}

export default function EvaluatePage() {
  // Menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Form state
  const [evaluationMode, setEvaluationMode] = useState<'single' | 'bulk'>('single')
  const [selectedExam, setSelectedExam] = useState('')
  const [selectedSubExam, setSelectedSubExam] = useState('')
  const [selectedPaper, setSelectedPaper] = useState('')
  const [evaluationLevel, setEvaluationLevel] = useState('standard')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  
  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get available options based on selections
  const availableSubExams = selectedExam ? examData[selectedExam as keyof typeof examData]?.subExams || [] : []
  const availablePapers = selectedExam && selectedSubExam 
    ? examData[selectedExam as keyof typeof examData]?.papers[selectedSubExam as keyof typeof examData[keyof typeof examData]['papers']] || []
    : []

  // Reset dependent dropdowns when parent changes
  const handleExamChange = (exam: string) => {
    setSelectedExam(exam)
    setSelectedSubExam('')
    setSelectedPaper('')
  }

  const handleSubExamChange = (subExam: string) => {
    setSelectedSubExam(subExam)
    setSelectedPaper('')
  }

  // File upload handling
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles: UploadedFile[] = Array.from(files).map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: formatFileSize(file.size),
      status: 'ready'
    }))

    if (evaluationMode === 'single') {
      setUploadedFiles(newFiles.slice(0, 1))
    } else {
      setUploadedFiles(prev => [...prev, ...newFiles])
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (!files) return

    const newFiles: UploadedFile[] = Array.from(files)
      .filter(file => file.type === 'application/pdf')
      .map((file, index) => ({
        id: `file-${Date.now()}-${index}`,
        name: file.name,
        size: formatFileSize(file.size),
        status: 'ready'
      }))

    if (evaluationMode === 'single') {
      setUploadedFiles(newFiles.slice(0, 1))
    } else {
      setUploadedFiles(prev => [...prev, ...newFiles])
    }
  }

  const isFormComplete = selectedExam && selectedSubExam && selectedPaper && uploadedFiles.length > 0

  const handleEvaluate = () => {
    // Navigate to review page
    // In real app, you would send data to backend first
    console.log('Evaluating...', {
      mode: evaluationMode,
      exam: selectedExam,
      subExam: selectedSubExam,
      paper: selectedPaper,
      level: evaluationLevel,
      files: uploadedFiles
    })
    window.location.href = '/review'
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-helio-100 z-40">
        <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm overflow-hidden">
              <img src="/logo.png" alt="Heliomark AI" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-lg font-display font-semibold text-helio-900 hidden sm:block">
              Heliomark AI
            </span>
          </div>

          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 hover:bg-helio-50 rounded-xl transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} className="text-helio-700" />
          </button>
        </div>
      </header>

      {/* Sidebar Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar Menu */}
      <aside className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-4 border-b border-helio-100 flex items-center justify-between">
          <span className="font-display font-semibold text-helio-900">Menu</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 hover:bg-helio-50 rounded-xl transition-colors"
          >
            <X size={20} className="text-helio-500" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <a href="/evaluate" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-helio-50 text-helio-900 font-medium">
            <Home size={20} />
            Dashboard
          </a>
          <a href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-helio-50 text-helio-600 transition-colors">
            <User size={20} />
            Profile
          </a>
          <a href="/history" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-helio-50 text-helio-600 transition-colors">
            <History size={20} />
            Past Evaluations
          </a>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-helio-100">
          <a href="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors">
            <LogOut size={20} />
            Sign out
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-24 pb-8 px-4 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-helio-900 mb-2">
            Evaluate Answer Sheets
          </h1>
          <p className="text-helio-500">
            Upload scanned PDFs and get AI-powered evaluation with detailed feedback
          </p>
        </div>

        {/* Two Panel Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Configuration */}
          <div className="card p-6 space-y-6">
            <div className="flex items-center gap-2 text-helio-700 font-medium">
              <span className="w-6 h-6 bg-helio-100 rounded-full flex items-center justify-center text-sm">1</span>
              Configuration
            </div>

            {/* Evaluation Mode */}
            <div>
              <label className="block text-sm font-medium text-helio-700 mb-3">
                Evaluation Mode
              </label>
              <div className="flex gap-3">
                <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  evaluationMode === 'single' 
                    ? 'border-helio-600 bg-helio-50 text-helio-900' 
                    : 'border-helio-200 hover:border-helio-300 text-helio-600'
                }`}>
                  <input
                    type="radio"
                    name="mode"
                    value="single"
                    checked={evaluationMode === 'single'}
                    onChange={() => { setEvaluationMode('single'); setUploadedFiles(prev => prev.slice(0, 1)) }}
                    className="sr-only"
                  />
                  <FileText size={20} />
                  <span className="font-medium">Single</span>
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  evaluationMode === 'bulk' 
                    ? 'border-helio-600 bg-helio-50 text-helio-900' 
                    : 'border-helio-200 hover:border-helio-300 text-helio-600'
                }`}>
                  <input
                    type="radio"
                    name="mode"
                    value="bulk"
                    checked={evaluationMode === 'bulk'}
                    onChange={() => setEvaluationMode('bulk')}
                    className="sr-only"
                  />
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                  <span className="font-medium">Bulk</span>
                </label>
              </div>
            </div>

            {/* Exam Selection */}
            <div>
              <label className="block text-sm font-medium text-helio-700 mb-2">
                Select Exam
              </label>
              <select 
                value={selectedExam}
                onChange={(e) => handleExamChange(e.target.value)}
                className="dropdown-select"
              >
                <option value="">Choose an exam...</option>
                {Object.keys(examData).map(exam => (
                  <option key={exam} value={exam}>{exam}</option>
                ))}
              </select>
            </div>

            {/* Sub-exam Selection */}
            <div>
              <label className="block text-sm font-medium text-helio-700 mb-2">
                Select Stream / Category
              </label>
              <select 
                value={selectedSubExam}
                onChange={(e) => handleSubExamChange(e.target.value)}
                className="dropdown-select"
                disabled={!selectedExam}
              >
                <option value="">
                  {selectedExam ? 'Choose stream...' : 'Select exam first'}
                </option>
                {availableSubExams.map(subExam => (
                  <option key={subExam} value={subExam}>{subExam}</option>
                ))}
              </select>
            </div>

            {/* Paper Selection */}
            <div>
              <label className="block text-sm font-medium text-helio-700 mb-2">
                Select Paper / Subject
              </label>
              <select 
                value={selectedPaper}
                onChange={(e) => setSelectedPaper(e.target.value)}
                className="dropdown-select"
                disabled={!selectedSubExam}
              >
                <option value="">
                  {selectedSubExam ? 'Choose paper...' : 'Select stream first'}
                </option>
                {availablePapers.map(paper => (
                  <option key={paper} value={paper}>{paper}</option>
                ))}
              </select>
            </div>

            {/* Evaluation Level */}
            <div>
              <label className="block text-sm font-medium text-helio-700 mb-3">
                Evaluation Level
              </label>
              <div className="space-y-2">
                {evaluationLevels.map(level => (
                  <label 
                    key={level.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      evaluationLevel === level.id
                        ? 'border-helio-600 bg-helio-50'
                        : 'border-helio-200 hover:border-helio-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="level"
                      value={level.id}
                      checked={evaluationLevel === level.id}
                      onChange={() => setEvaluationLevel(level.id)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium text-helio-900">{level.label}</div>
                      <div className="text-sm text-helio-500">{level.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Upload */}
          <div className="card p-6 space-y-6">
            <div className="flex items-center gap-2 text-helio-700 font-medium">
              <span className="w-6 h-6 bg-helio-100 rounded-full flex items-center justify-center text-sm">2</span>
              Upload & Evaluate
            </div>

            {/* Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-helio-300 rounded-2xl p-8 text-center cursor-pointer hover:border-helio-500 hover:bg-helio-50/50 transition-all"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                multiple={evaluationMode === 'bulk'}
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="w-16 h-16 bg-helio-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload size={28} className="text-helio-600" />
              </div>
              <p className="text-helio-900 font-medium mb-1">
                {evaluationMode === 'single' ? 'Upload Answer Sheet' : 'Upload Answer Sheets'}
              </p>
              <p className="text-sm text-helio-500 mb-4">
                Drag & drop or click to browse
              </p>
              <p className="text-xs text-helio-400">
                PDF files only • Max 20MB per file
              </p>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-helio-700">
                    Uploaded Files ({uploadedFiles.length})
                  </span>
                  {uploadedFiles.length > 1 && (
                    <button 
                      onClick={() => setUploadedFiles([])}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove all
                    </button>
                  )}
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {uploadedFiles.map(file => (
                    <div 
                      key={file.id}
                      className="flex items-center gap-3 p-3 bg-helio-50 rounded-xl"
                    >
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <FileText size={20} className="text-helio-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-helio-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-helio-500">{file.size}</p>
                      </div>
                      <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1.5 hover:bg-white rounded-lg transition-colors flex-shrink-0"
                      >
                        <Trash2 size={16} className="text-helio-400 hover:text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selection Summary */}
            {(selectedExam || selectedSubExam || selectedPaper) && (
              <div className="p-4 bg-cream-100 rounded-xl">
                <div className="text-sm text-helio-700 font-medium mb-2">Selected:</div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-helio-600">
                  {selectedExam && (
                    <>
                      <span className="px-2 py-1 bg-white rounded-lg">{selectedExam}</span>
                      {selectedSubExam && <ChevronRight size={14} />}
                    </>
                  )}
                  {selectedSubExam && (
                    <>
                      <span className="px-2 py-1 bg-white rounded-lg">{selectedSubExam}</span>
                      {selectedPaper && <ChevronRight size={14} />}
                    </>
                  )}
                  {selectedPaper && (
                    <span className="px-2 py-1 bg-white rounded-lg">{selectedPaper}</span>
                  )}
                </div>
              </div>
            )}

            {/* Evaluate Button */}
            <button
              onClick={handleEvaluate}
              disabled={!isFormComplete}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFormComplete ? (
                <>
                  Evaluate {uploadedFiles.length > 1 ? `${uploadedFiles.length} Sheets` : 'Sheet'}
                  <ChevronRight size={18} />
                </>
              ) : (
                <>
                  <AlertCircle size={18} />
                  Complete all fields to evaluate
                </>
              )}
            </button>

            {/* Info Note */}
            <p className="text-xs text-helio-400 text-center">
              Evaluation typically takes 30-60 seconds per answer sheet
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
