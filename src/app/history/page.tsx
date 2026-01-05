'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  FileText,
  Download,
  Eye,
  MessageCircle,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  Trash2,
  X
} from 'lucide-react'

// Mock history data grouped by date
const mockHistoryData = [
  {
    date: '04 Jan 2025',
    dateKey: '2025-01-04',
    evaluations: [
      {
        id: 'eval-001',
        seatNo: 'A-2024-001542',
        candidateName: 'Rajesh Kumar Sharma',
        exam: 'UPSC',
        paper: 'GS1',
        marks: 178,
        totalMarks: 250,
        percentage: 71.2,
        time: '2:45 PM'
      },
      {
        id: 'eval-002',
        seatNo: 'A-2024-001543',
        candidateName: 'Priya Patel',
        exam: 'UPSC',
        paper: 'GS1',
        marks: 195,
        totalMarks: 250,
        percentage: 78.0,
        time: '1:30 PM'
      },
      {
        id: 'eval-003',
        seatNo: 'A-2024-001544',
        candidateName: 'Amit Singh',
        exam: 'UPSC',
        paper: 'GS2',
        marks: 162,
        totalMarks: 250,
        percentage: 64.8,
        time: '11:15 AM'
      }
    ]
  },
  {
    date: '03 Jan 2025',
    dateKey: '2025-01-03',
    evaluations: [
      {
        id: 'eval-004',
        seatNo: 'B-2024-002211',
        candidateName: 'Sneha Gupta',
        exam: 'GPSC',
        paper: 'GS1',
        marks: 145,
        totalMarks: 200,
        percentage: 72.5,
        time: '4:20 PM'
      },
      {
        id: 'eval-005',
        seatNo: 'B-2024-002212',
        candidateName: 'Vikram Rao',
        exam: 'GPSC',
        paper: 'Essay',
        marks: 118,
        totalMarks: 150,
        percentage: 78.7,
        time: '3:00 PM'
      }
    ]
  },
  {
    date: '02 Jan 2025',
    dateKey: '2025-01-02',
    evaluations: [
      {
        id: 'eval-006',
        seatNo: 'C-2024-003301',
        candidateName: 'Ananya Reddy',
        exam: 'CBSE Class 12th',
        paper: 'Physics',
        marks: 68,
        totalMarks: 70,
        percentage: 97.1,
        time: '5:45 PM'
      },
      {
        id: 'eval-007',
        seatNo: 'C-2024-003302',
        candidateName: 'Rohan Joshi',
        exam: 'CBSE Class 12th',
        paper: 'Chemistry',
        marks: 58,
        totalMarks: 70,
        percentage: 82.9,
        time: '2:15 PM'
      },
      {
        id: 'eval-008',
        seatNo: 'C-2024-003303',
        candidateName: 'Meera Nair',
        exam: 'CBSE Class 12th',
        paper: 'Mathematics',
        marks: 62,
        totalMarks: 70,
        percentage: 88.6,
        time: '10:30 AM'
      }
    ]
  },
  {
    date: '31 Dec 2024',
    dateKey: '2024-12-31',
    evaluations: [
      {
        id: 'eval-009',
        seatNo: 'A-2024-001540',
        candidateName: 'Karthik Menon',
        exam: 'UPSC',
        paper: 'GS3',
        marks: 172,
        totalMarks: 250,
        percentage: 68.8,
        time: '6:00 PM'
      }
    ]
  }
]

export default function HistoryPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedExam, setSelectedExam] = useState('all')
  const [expandedDates, setExpandedDates] = useState<string[]>(mockHistoryData.map(d => d.dateKey))
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  const toggleDate = (dateKey: string) => {
    setExpandedDates(prev => 
      prev.includes(dateKey) 
        ? prev.filter(d => d !== dateKey)
        : [...prev, dateKey]
    )
  }

  const filteredData = mockHistoryData.map(dateGroup => ({
    ...dateGroup,
    evaluations: dateGroup.evaluations.filter(evaluation => {
      const matchesSearch = searchQuery === '' || 
        evaluation.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evaluation.seatNo.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesExam = selectedExam === 'all' || evaluation.exam === selectedExam
      
      return matchesSearch && matchesExam
    })
  })).filter(dateGroup => dateGroup.evaluations.length > 0)

  const totalEvaluations = filteredData.reduce((sum, d) => sum + d.evaluations.length, 0)

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50'
    if (percentage >= 60) return 'text-blue-600 bg-blue-50'
    if (percentage >= 40) return 'text-amber-600 bg-amber-50'
    return 'text-red-600 bg-red-50'
  }

  const handleView = (id: string) => {
    // In real app, navigate to view specific evaluation
    router.push('/review')
    setActiveMenu(null)
  }

  const handleDownload = (id: string) => {
    // In real app, trigger download
    alert(`Downloading evaluation ${id}`)
    setActiveMenu(null)
  }

  const handleWhatsApp = (id: string) => {
    // In real app, open WhatsApp modal
    alert(`Opening WhatsApp for ${id}`)
    setActiveMenu(null)
  }

  const handleDelete = (id: string) => {
    // In real app, confirm and delete
    if (confirm('Are you sure you want to delete this evaluation?')) {
      alert(`Deleted evaluation ${id}`)
    }
    setActiveMenu(null)
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
                Past Evaluations
              </h1>
              <p className="text-sm text-helio-500">
                {totalEvaluations} evaluation{totalEvaluations !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-8 px-4 max-w-4xl mx-auto">
        
        {/* Search and Filter Bar */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-helio-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or seat number..."
                className="input-field pl-10"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-helio-400" />
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="dropdown-select pl-10 min-w-[160px]"
              >
                <option value="all">All Exams</option>
                <option value="UPSC">UPSC</option>
                <option value="GPSC">GPSC</option>
                <option value="CBSE Class 12th">CBSE Class 12th</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredData.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-helio-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={28} className="text-helio-400" />
            </div>
            <h3 className="text-lg font-display font-semibold text-helio-900 mb-2">
              No evaluations found
            </h3>
            <p className="text-helio-500 mb-6">
              {searchQuery || selectedExam !== 'all' 
                ? 'Try adjusting your search or filter'
                : 'Start evaluating answer sheets to see them here'}
            </p>
            <button
              onClick={() => router.push('/evaluate')}
              className="btn-primary"
            >
              New Evaluation
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredData.map((dateGroup) => (
              <div key={dateGroup.dateKey} className="card overflow-hidden">
                {/* Date Header */}
                <button
                  onClick={() => toggleDate(dateGroup.dateKey)}
                  className="w-full p-4 flex items-center justify-between bg-helio-50/50 hover:bg-helio-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Calendar size={18} className="text-helio-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-helio-900">{dateGroup.date}</div>
                      <div className="text-sm text-helio-500">
                        {dateGroup.evaluations.length} evaluation{dateGroup.evaluations.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <ChevronDown 
                    size={20} 
                    className={`text-helio-400 transition-transform ${
                      expandedDates.includes(dateGroup.dateKey) ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Evaluations List */}
                {expandedDates.includes(dateGroup.dateKey) && (
                  <div className="divide-y divide-helio-100">
                    {dateGroup.evaluations.map((evaluation) => (
                      <div 
                        key={evaluation.id}
                        className="p-4 hover:bg-helio-50/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-helio-900 truncate">
                                {evaluation.candidateName}
                              </h4>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getScoreColor(evaluation.percentage)}`}>
                                {evaluation.percentage}%
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-helio-500">
                              <span>{evaluation.seatNo}</span>
                              <span className="w-1 h-1 bg-helio-300 rounded-full"></span>
                              <span>{evaluation.exam} - {evaluation.paper}</span>
                              <span className="w-1 h-1 bg-helio-300 rounded-full"></span>
                              <span>{evaluation.marks}/{evaluation.totalMarks}</span>
                            </div>
                          </div>

                          {/* Time */}
                          <div className="text-sm text-helio-400 hidden sm:block">
                            {evaluation.time}
                          </div>

                          {/* Actions */}
                          <div className="relative">
                            <button
                              onClick={() => setActiveMenu(activeMenu === evaluation.id ? null : evaluation.id)}
                              className="p-2 hover:bg-helio-100 rounded-lg transition-colors"
                            >
                              <MoreVertical size={18} className="text-helio-500" />
                            </button>

                            {/* Dropdown Menu */}
                            {activeMenu === evaluation.id && (
                              <>
                                <div 
                                  className="fixed inset-0 z-10"
                                  onClick={() => setActiveMenu(null)}
                                />
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-helio-100 py-2 z-20 animate-slide-up">
                                  <button
                                    onClick={() => handleView(evaluation.id)}
                                    className="w-full px-4 py-2 text-left text-sm text-helio-700 hover:bg-helio-50 flex items-center gap-3"
                                  >
                                    <Eye size={16} />
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => handleDownload(evaluation.id)}
                                    className="w-full px-4 py-2 text-left text-sm text-helio-700 hover:bg-helio-50 flex items-center gap-3"
                                  >
                                    <Download size={16} />
                                    Download PDF
                                  </button>
                                  <button
                                    onClick={() => handleWhatsApp(evaluation.id)}
                                    className="w-full px-4 py-2 text-left text-sm text-helio-700 hover:bg-helio-50 flex items-center gap-3"
                                  >
                                    <MessageCircle size={16} />
                                    Send WhatsApp
                                  </button>
                                  <div className="my-1 border-t border-helio-100"></div>
                                  <button
                                    onClick={() => handleDelete(evaluation.id)}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                                  >
                                    <Trash2 size={16} />
                                    Delete
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
