import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Heliomark AI - Answer Sheet Evaluation',
  description: 'AI-powered answer sheet evaluation for teachers. Fast, accurate, and insightful.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-subtle min-h-screen">
        {children}
      </body>
    </html>
  )
}
