'use client'

import { useState, useCallback } from 'react'
import {
  Upload,
  FileText,
  FolderOpen,
  X,
  AlertCircle,
  CheckCircle,
  Info,
  ArrowRight,
  Loader2
} from 'lucide-react'
import AppShell from '@/components/AppShell'
import { submitEvaluation } from '@/lib/api'

export default function EvaluatePage() {
  const [singleFile, setSingleFile] = useState<File | null>(null)
  const [singleDragActive, setSingleDragActive] = useState(false)
  const [folderFiles, setFolderFiles] = useState<File[]>([])
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedCount, setSubmittedCount] = useState(0)

  const handleSingleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setSingleDragActive(true)
    else if (e.type === 'dragleave') setSingleDragActive(false)
  }, [])

  const handleSingleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSingleDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetSingle(e.dataTransfer.files[0])
    }
  }, [])

  const validateAndSetSingle = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF file')
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB')
      return
    }
    setSingleFile(file)
    setFolderFiles([])
    setError('')
  }

  const handleSingleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetSingle(e.target.files[0])
    }
  }

  const handleFolderInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const pdfs = Array.from(e.target.files).filter(f =>
        f.name.toLowerCase().endsWith('.pdf')
      )
      if (pdfs.length === 0) {
        setError('No PDF files found in selected folder')
        return
      }
      setFolderFiles(pdfs)
      setSingleFile(null)
      setError('')
    }
  }

  const removeFolderFile = (index: number) => {
    setFolderFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    const files = singleFile ? [singleFile] : folderFiles
    if (files.length === 0) {
      setError('Please upload at least one PDF')
      return
    }
    setIsSubmitting(true)
    setError('')
    try {
      for (const file of files) {
        await submitEvaluation(file)
      }
      setSubmittedCount(files.length)
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Submission failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setSingleFile(null)
    setFolderFiles([])
    setError('')
    setSubmitted(false)
    setSubmittedCount(0)
  }

  const hasFiles = singleFile !== null || folderFiles.length > 0

  if (submitted) {
    return (
      <AppShell>
        <div className="pt-12 pb-8 px-4 max-w-2xl mx-auto">
          <div className="card p-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-display font-bold text-ink-900 mb-2">
              Submitted Successfully!
            </h2>
            <p className="text-ink-400 mb-8">
              {submittedCount} answer sheet{submittedCount > 1 ? 's' : ''} submitted for evaluation.
            </p>
            <div className="space-y-3 max-w-sm mx-auto">
              <a href="/processing" className="flex items-center justify-between p-4 rounded-2xl border-2 border-sand-200 hover:border-helio-300 hover:bg-sand-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Loader2 size={18} className="text-helio-500" />
                  <span className="text-sm font-semibold text-ink-700">View pending evaluations</span>
                </div>
                <ArrowRight size={16} className="text-ink-300" />
              </a>
              <a href="/evaluated" className="flex items-center justify-between p-4 rounded-2xl border-2 border-sand-200 hover:border-helio-300 hover:bg-sand-50 transition-colors">
                <div className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-green-500" />
                  <span className="text-sm font-semibold text-ink-700">View evaluated answer sheets</span>
                </div>
                <ArrowRight size={16} className="text-ink-300" />
              </a>
            </div>
            <button onClick={handleReset} className="mt-8 text-sm text-helio-500 hover:text-helio-700 font-semibold transition-colors">
              Upload more answer sheets
            </button>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="pt-8 pb-8 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-ink-900 mb-2">Evaluate Answer Sheets</h1>
          <p className="text-ink-400">Upload a single PDF or select a folder with multiple answer sheets</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fade-in max-w-2xl mx-auto">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Single PDF */}
          <div className="card p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-helio-50 flex items-center justify-center">
                <Upload size={18} className="text-helio-500" />
              </div>
              <h2 className="font-display font-bold text-ink-900">Upload Answer Sheet</h2>
            </div>

            {!singleFile ? (
              <div
                className={`p-8 border-2 border-dashed rounded-2xl transition-all ${singleDragActive ? 'border-helio-400 bg-helio-50/50' : 'border-sand-300 hover:border-helio-300 hover:bg-sand-50'} ${folderFiles.length > 0 ? 'opacity-50 pointer-events-none' : ''}`}
                onDragEnter={handleSingleDrag}
                onDragLeave={handleSingleDrag}
                onDragOver={handleSingleDrag}
                onDrop={handleSingleDrop}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-helio-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <FileText size={22} className="text-helio-500" />
                  </div>
                  <p className="text-ink-700 font-semibold mb-1">Drop your PDF here</p>
                  <p className="text-sm text-ink-300 mb-4">PDF only — max 50MB</p>
                  <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-helio-500 text-white rounded-2xl font-semibold cursor-pointer hover:bg-helio-600 transition-colors shadow-warm text-sm">
                    <input type="file" accept=".pdf" onChange={handleSingleInput} className="hidden" />
                    Select PDF
                  </label>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4 bg-sand-50 rounded-2xl border-2 border-sand-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <FileText size={20} className="text-helio-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-ink-900 truncate text-sm">{singleFile.name}</h4>
                  <p className="text-xs text-ink-400">{(singleFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                </div>
                <button onClick={() => { setSingleFile(null); setError('') }} className="p-2 hover:bg-sand-200 rounded-xl transition-colors">
                  <X size={16} className="text-ink-400" />
                </button>
              </div>
            )}

            <div className="flex items-start gap-2 mt-4 text-xs text-ink-300">
              <Info size={14} className="flex-shrink-0 mt-0.5" />
              <div>
                <p>Max PDF size: 50MB</p>
                <p>Add only one student&apos;s answer sheet</p>
              </div>
            </div>
          </div>

          {/* Folder upload */}
          <div className="card p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-helio-50 flex items-center justify-center">
                <FolderOpen size={18} className="text-helio-500" />
              </div>
              <h2 className="font-display font-bold text-ink-900">Select Folder from PC</h2>
            </div>

            {folderFiles.length === 0 ? (
              <div className={`p-8 border-2 border-dashed rounded-2xl border-sand-300 hover:border-helio-300 hover:bg-sand-50 transition-all ${singleFile ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-helio-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <FolderOpen size={22} className="text-helio-500" />
                  </div>
                  <p className="text-ink-700 font-semibold mb-1">Select a folder</p>
                  <p className="text-sm text-ink-300 mb-4">All PDFs inside will be uploaded</p>
                  <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-helio-500 text-white rounded-2xl font-semibold cursor-pointer hover:bg-helio-600 transition-colors shadow-warm text-sm">
                    <input type="file" accept=".pdf" multiple onChange={handleFolderInput} className="hidden" ref={(input) => { if (input) input.setAttribute('webkitdirectory', '') }} />
                    Browse Folder
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {folderFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-sand-50 rounded-xl border border-sand-100">
                    <FileText size={16} className="text-helio-500 flex-shrink-0" />
                    <span className="flex-1 text-sm text-ink-700 truncate">{file.name}</span>
                    <span className="text-xs text-ink-300">{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                    <button onClick={() => removeFolderFile(i)} className="p-1 hover:bg-sand-200 rounded-lg transition-colors">
                      <X size={14} className="text-ink-400" />
                    </button>
                  </div>
                ))}
                <p className="text-xs text-ink-400 font-semibold mt-2">{folderFiles.length} PDF{folderFiles.length > 1 ? 's' : ''} selected</p>
              </div>
            )}

            <div className="flex items-start gap-2 mt-4 text-xs text-ink-300">
              <Info size={14} className="flex-shrink-0 mt-0.5" />
              <div>
                <p>Can add any number of PDFs inside folder</p>
                <p>Name files as 1, 2, 3, 4... etc.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button onClick={handleSubmit} disabled={!hasFiles || isSubmitting} className="btn-primary px-12 py-4 text-lg flex items-center justify-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>Submit</>
            )}
          </button>
        </div>
      </div>
    </AppShell>
  )
}