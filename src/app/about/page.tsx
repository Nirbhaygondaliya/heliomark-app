'use client'

import { Clock, TrendingUp, Award, ArrowRight } from 'lucide-react'
import AppShell from '@/components/AppShell'

const features = [
  {
    title: "Save Teacher's Time",
    description: "Automate answer sheet evaluation with AI. What takes hours now takes minutes — freeing teachers to focus on what matters most: teaching.",
    icon: Clock,
    color: 'from-helio-400 to-helio-600',
    iconBg: 'bg-helio-500',
    stats: '90% faster evaluation',
  },
  {
    title: "Boost Student's Career",
    description: "Detailed, consistent feedback on every answer helps students understand exactly where to improve — accelerating their exam preparation.",
    icon: TrendingUp,
    color: 'from-green-400 to-green-600',
    iconBg: 'bg-green-500',
    stats: 'Detailed feedback per question',
  },
  {
    title: "Enhance Institute's Pride",
    description: "Offer cutting-edge AI evaluation to your students. Stand out as a forward-thinking institute that invests in quality education.",
    icon: Award,
    color: 'from-amber-400 to-amber-600',
    iconBg: 'bg-amber-500',
    stats: 'Modern & professional reports',
  },
]

export default function AboutPage() {
  return (
    <AppShell>
      <div className="pt-10 pb-16 px-4">
        {/* Hero */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-helio-50 rounded-full text-sm font-semibold text-helio-600 mb-4">
            <span className="w-2 h-2 bg-helio-500 rounded-full" />
            About Us
          </div>
          <p className="text-ink-400 text-lg leading-relaxed">
            Built for UPSC, State PCS, CA, CBSE, State Boards and more.
          </p>
        </div>

        {/* Feature cards */}
        <div className="max-w-5xl mx-auto space-y-6">
          {features.map((feature, index) => {
            const isReversed = index % 2 !== 0
            return (
              <div key={index} className="card overflow-hidden">
                <div className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                  {/* Text side */}
                  <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
                    <span className="text-5xl font-display font-bold text-sand-200 mb-2">
                      0{index + 1}
                    </span>
                    <h2 className="text-2xl font-display font-bold text-ink-900 mb-3">
                      {feature.title}
                    </h2>
                    <p className="text-ink-400 leading-relaxed mb-5">
                      {feature.description}
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-helio-600">
                      <ArrowRight size={14} />
                      {feature.stats}
                    </div>
                  </div>

                  {/* Visual side */}
                  <div className={`w-full md:w-80 h-56 md:h-auto bg-gradient-to-br ${feature.color} flex items-center justify-center relative overflow-hidden`}>
                    {/* Decorative circles */}
                    <div className="absolute top-4 right-4 w-24 h-24 bg-white/10 rounded-full" />
                    <div className="absolute bottom-6 left-6 w-16 h-16 bg-white/10 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                      <feature.icon size={36} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="card inline-block p-8 md:p-10">
            <h3 className="text-xl font-display font-bold text-ink-900 mb-2">Ready to get started?</h3>
            <p className="text-ink-400 mb-6">Try evaluating your first answer sheet — it&apos;s free.</p>
            <a href="/evaluate" className="btn-primary inline-flex items-center gap-2">
              Start Evaluating <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  )
}