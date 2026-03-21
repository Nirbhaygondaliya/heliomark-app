'use client'

import { useState, useEffect } from 'react'
import { getStats } from '@/lib/api'

export default function Footer() {
  const [stats, setStats] = useState({
    totalSheets: 0,
    totalInstitutes: 0
  })

  useEffect(() => {
    getStats()
      .then(data => setStats({
        totalSheets: data.totalSheets || 0,
        totalInstitutes: data.totalInstitutes || 0
      }))
      .catch(() => {})
  }, [])

  return (
    <footer className="border-t border-sand-200 bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <p className="text-sm text-ink-400">
          Total Answersheets evaluated:{' '}
          <span className="font-bold text-ink-700">
            {stats.totalSheets.toLocaleString()}
          </span>
        </p>
        <p className="text-sm text-ink-400">
          Total institutes joined:{' '}
          <span className="font-bold text-ink-700">
            {stats.totalInstitutes.toLocaleString()}
          </span>
        </p>
      </div>
    </footer>
  )
}