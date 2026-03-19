'use client'

import { Zap } from 'lucide-react'
import AppShell from '@/components/AppShell'

const plans = [
  { name: 'Starter', pages: 500, price: '₹745', perPage: '₹1.49/page' },
  { name: 'Standard', pages: 2000, price: '₹2,580', perPage: '₹1.29/page' },
  { name: 'Pro', pages: 5000, price: '₹5,450', perPage: '₹1.09/page' },
]

export default function UsagePage() {
  const pagesUsed = 12
  const pagesTotal = 100
  const percentUsed = Math.round((pagesUsed / pagesTotal) * 100)

  return (
    <AppShell>
      <div className="pt-8 pb-12 px-4 max-w-5xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-ink-900 mb-8">Usage & Credits</h1>

        <div className="card p-6 mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-helio-50 flex items-center justify-center">
              <Zap size={18} className="text-helio-500" />
            </div>
            <h2 className="font-display font-bold text-ink-900">Current Plan: Free Trial</h2>
          </div>
          <div className="flex items-end justify-between mb-3">
            <p className="text-sm text-ink-400">{pagesUsed} of {pagesTotal} pages used</p>
            <p className="text-sm font-semibold text-ink-700">{percentUsed}%</p>
          </div>
          <div className="w-full bg-sand-200 rounded-full h-3">
            <div className="bg-helio-500 h-3 rounded-full transition-all" style={{ width: `${percentUsed}%` }} />
          </div>
          <p className="text-xs text-ink-300 mt-2">{pagesTotal - pagesUsed} pages remaining — no expiry</p>
        </div>

        <h2 className="font-display font-bold text-ink-900 mb-4">Upgrade Plan</h2>
        <div className="grid grid-cols-3 gap-4">
          {plans.map((plan, index) => (
            <div key={plan.name} className={`card p-6 text-center ${index === 1 ? 'ring-2 ring-helio-400' : ''}`}>
              {index === 1 && (
                <span className="inline-block text-xs font-bold text-helio-600 bg-helio-50 px-2.5 py-1 rounded-full mb-3">Most Popular</span>
              )}
              <h3 className="font-display font-bold text-ink-900 text-lg">{plan.name}</h3>
              <p className="text-3xl font-bold text-ink-900 mt-3">{plan.price}</p>
              <p className="text-sm text-ink-400 mt-2">{plan.pages.toLocaleString()} pages</p>
              <p className="text-sm font-semibold text-helio-600 mt-1">{plan.perPage}</p>
              <button className="w-full mt-5 py-2.5 rounded-xl font-semibold text-sm bg-helio-500 text-white hover:bg-helio-600 shadow-warm transition-colors">
                Buy Now
              </button>
            </div>
          ))}
        </div>

        <p className="text-xs text-ink-300 text-center mt-6">Payments powered by Razorpay • Credits never expire</p>
      </div>
    </AppShell>
  )
}