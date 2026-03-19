'use client'

import { useState, useEffect } from 'react'
import {
  FileText,
  Download,
  Send,
  CheckSquare,
  Square,
  Loader2,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react'
import AppShell from '@/components/AppShell'

interface EvaluatedSheet {
  id: string
  fileName: string
  studentName: string
  phoneNo: string
  downloadUrl: string
  completedAt: string
}

// TODO: Replace with real API call — GET /api/v1/evaluations
const mockSheets: EvaluatedSheet[] = [
  { id: '1', fileName: 'student_answer_1.pdf', studentName: '', phoneNo: '', downloadUrl: '#', completedAt: '2026-03-19T10:45:00Z' },
  { id: '2', fileName: 'gpsc_gs1_ravi.pdf', studentName: '', phoneNo: '', downloadUrl: '#', completedAt: '2026-03-18T14:20:00Z' },
  { id: '3', fileName: 'upsc_mains_priya.pdf', studentName: '', phoneNo: '', downloadUrl: '#', completedAt: '2026-03-17T09:30:00Z' },
  { id: '4', fileName: 'ca_paper1_amit.pdf', studentName: '', phoneNo: '', downloadUrl: '#', completedAt: '2026-03-16T16:00:00Z' },
]

export default function EvaluatedListPage() {
  const [sheets, setSheets] = useState<EvaluatedSheet[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useEffect(() => {
    // TODO: Replace with real API call
    setTimeout(() => {
      setSheets(mockSheets)
      setLoading(false)
    }, 500)
  }, [])

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === sheets.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(sheets.map(s => s.id)))
    }
  }

  const updateField = (id: string, field: 'studentName' | 'phoneNo', value: string) => {
    setSheets(prev => prev.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ))
  }

  const handleDownload = (url: string) => {
    // TODO: Replace with real download from S3
    window.open(url, '_blank')
  }

  const handleExcelExport = () => {
    // TODO: Implement Excel export
    alert('Excel export coming soon — will download student details as .xlsx')
  }

  if (loading) {
    return (
      <AppShell>
        <div className="pt-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-helio-500" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="pt-8 pb-8 px-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-ink-900">List of Evaluated Answer Sheets</h1>
            <p className="text-ink-400 text-sm mt-1">{sheets.length} evaluated</p>
          </div>
          <button
            onClick={handleExcelExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-sand-200 text-ink-600 hover:bg-sand-50 transition-colors text-sm font-semibold"
          >
            <FileSpreadsheet size={16} />
            Download Excel
          </button>
        </div>

        {sheets.length === 0 ? (
          <div className="card p-12 text-center">
            <FileText size={32} className="text-ink-200 mx-auto mb-4" />
            <p className="text-ink-400 font-semibold">No evaluated sheets yet</p>
            <p className="text-ink-300 text-sm mt-1">Completed evaluations will appear here</p>
            <a href="/evaluate" className="btn-primary inline-flex items-center gap-2 mt-6 text-sm">
              Upload Answer Sheets
            </a>
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-sand-200 bg-sand-50">
                  <th className="py-3 px-4 text-left">
                    <button onClick={toggleSelectAll} className="text-ink-400 hover:text-ink-600">
                      {selected.size === sheets.length
                        ? <CheckSquare size={18} className="text-helio-500" />
                        : <Square size={18} />
                      }
                    </button>
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">No</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">Name of PDF</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">Student&apos;s Name</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">Phone No.</th>
                  <th className="text-center py-3 px-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">WhatsApp</th>
                  <th className="text-center py-3 px-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">Download</th>
                </tr>
              </thead>
              <tbody>
                {sheets.map((sheet, index) => (
                  <tr key={sheet.id} className="border-b border-sand-100 last:border-0 hover:bg-sand-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <button onClick={() => toggleSelect(sheet.id)} className="text-ink-400 hover:text-ink-600">
                        {selected.has(sheet.id)
                          ? <CheckSquare size={18} className="text-helio-500" />
                          : <Square size={18} />
                        }
                      </button>
                    </td>
                    <td className="py-3 px-3 text-sm text-ink-400">{index + 1}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-helio-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-ink-700">{sheet.fileName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="text"
                        value={sheet.studentName}
                        onChange={e => updateField(sheet.id, 'studentName', e.target.value)}
                        placeholder="Enter name"
                        className="w-full px-3 py-1.5 text-sm border border-sand-200 rounded-lg bg-white focus:border-helio-400 focus:ring-1 focus:ring-helio-100 transition-all placeholder:text-ink-200"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="tel"
                        value={sheet.phoneNo}
                        onChange={e => updateField(sheet.id, 'phoneNo', e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="Enter phone"
                        className="w-full px-3 py-1.5 text-sm border border-sand-200 rounded-lg bg-white focus:border-helio-400 focus:ring-1 focus:ring-helio-100 transition-all placeholder:text-ink-200"
                        maxLength={10}
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        disabled
                        title="WhatsApp sending coming soon"
                        className="p-2 rounded-lg text-ink-200 cursor-not-allowed"
                      >
                        <Send size={16} />
                      </button>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleDownload(sheet.downloadUrl)}
                        className="p-2 rounded-lg text-helio-500 hover:bg-helio-50 transition-colors"
                        title="Download evaluated PDF"
                      >
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  )
}