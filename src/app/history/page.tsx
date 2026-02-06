'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  FileText,
  Eye,
  ChevronDown,
  MoreVertical,
  Trash2,
  Loader2
} from 'lucide-react'
import { isAuthenticated } from '@/lib/auth'
import { getEvaluations } from '@/lib/api'

interface Evaluation {
  evaluationId: string
  fileName: string
  evaluationType: string
  status: string
  results: string
  createdAt: string
}

interface GroupedEvaluations {
  date: string
  dateKey: string
  evaluations: Evaluation[]
}

export default function HistoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [expandedDates, setExpandedDates] = useState<string[]>([])
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    loadEvaluations()
  }, [router])

  const loadEvaluations = async () => {
    try {
      const data = await getEvaluations()
      const evals = Array.isArray(data) ? data : (data?.evaluations || [])
      setEvaluations(evals)
      // Expand all dates by default
      const dates = [...new Set(evals.map((e: Evaluation) =>
        new Date(e.createdAt).toDateString()
    } catch (err) {
      console.error('Failed to load evaluations:', err)
    } finally {
      setLoading(false)
    }
  }

  // Group evaluations by date
  const groupedEvaluations: GroupedEvaluations[] = evaluations
    .filter(evaluation => {
      const matchesSearch = searchQuery === '' || 
        evaluation.fileName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = selectedType === 'all' || evaluation.evaluationType === selectedType
      return matchesSearch && matchesType
    })
    .reduce((groups: GroupedEvaluations[], evaluation) => {
      const date = new Date(evaluation.createdAt)
      const dateKey = date.toDateString()
      const dateStr = date.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      })
      
      const existingGroup = groups.find(g => g.dateKey === dateKey)
      if (existingGroup) {
        existingGroup.evaluations.push(evaluation)
      } else {
        groups.push({
          date: dateStr,
          dateKey,
          evaluations: [evaluation]
        })
      }
      return groups
    }, [])
    .sort((a, b) => new Date(b.dateKey).getTime() - new Date(a.dateKey).getTime())

  const toggleDate = (dateKey: string) => {
    setExpandedDates(prev => 
      prev.includes(dateKey) 
        ? prev.filter(d => d !== dateKey)
        : [...prev, dateKey]
    )
  }

  const totalEvaluations = groupedEvaluations.reduce((sum, d) => sum + d.evaluations.length, 0)

  const handleView = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation)
    setActiveMenu(null)
  }

  if (loading) {
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
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-helio-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by file name..."
                className="input-field pl-10"
              />
            </div>

            <div className="relative">
              <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-helio-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="dropdown-select pl-10 min-w-[160px]"
              >
                <option value="all">All Types</option>
                <option value="general">General</option>
                <option value="upsc">UPSC</option>
                <option value="cbse">CBSE</option>
                <option value="essay">Essay</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {groupedEvaluations.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-helio-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={28} className="text-helio-400" />
            </div>
            <h3 className="text-lg font-display font-semibold text-helio-900 mb-2">
              No evaluations found
            </h3>
            <p className="text-helio-500 mb-6">
              {searchQuery || selectedType !== 'all' 
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
            {groupedEvaluations.map((dateGroup) => (
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
                        key={evaluation.evaluationId}
                        className="p-4 hover:bg-helio-50/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-helio-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FileText size={18} className="text-helio-600" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-helio-900 truncate">
                              {evaluation.fileName}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-helio-500">
                              <span className="capitalize">{evaluation.evaluationType}</span>
                              <span className="w-1 h-1 bg-helio-300 rounded-full"></span>
                              <span className="capitalize">{evaluation.status}</span>
                            </div>
                          </div>

                          <div className="text-sm text-helio-400 hidden sm:block">
                            {new Date(evaluation.createdAt).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>

                          <div className="relative">
                            <button
                              onClick={() => setActiveMenu(activeMenu === evaluation.evaluationId ? null : evaluation.evaluationId)}
                              className="p-2 hover:bg-helio-100 rounded-lg transition-colors"
                            >
                              <MoreVertical size={18} className="text-helio-500" />
                            </button>

                            {activeMenu === evaluation.evaluationId && (
                              <>
                                <div 
                                  className="fixed inset-0 z-10"
                                  onClick={() => setActiveMenu(null)}
                                />
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-helio-100 py-2 z-20">
                                  <button
                                    onClick={() => handleView(evaluation)}
                                    className="w-full px-4 py-2 text-left text-sm text-helio-700 hover:bg-helio-50 flex items-center gap-3"
                                  >
                                    <Eye size={16} />
                                    View Results
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

      {/* Results Modal */}
      {selectedEvaluation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-helio-100 flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold text-helio-900">
                  {selectedEvaluation.fileName}
                </h3>
                <p className="text-sm text-helio-500 capitalize">
                  {selectedEvaluation.evaluationType} • {new Date(selectedEvaluation.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedEvaluation(null)}
                className="p-2 hover:bg-helio-50 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-helio-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="whitespace-pre-wrap text-helio-700 leading-relaxed">
                {selectedEvaluation.results}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
