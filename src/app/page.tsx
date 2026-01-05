'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to login page
    router.push('/login')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse">
        <div className="w-16 h-16 bg-helio-200 rounded-2xl"></div>
      </div>
    </div>
  )
}
