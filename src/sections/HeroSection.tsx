import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowRight, FlaskConical, Shield, Beaker } from 'lucide-react'

interface HeroSectionProps {
  onShopNow: () => void
}

export default function HeroSection({ onShopNow }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.hero-title', { opacity: 0, y: 40 })
      gsap.set('.hero-subtitle', { opacity: 0, y: 30 })
      gsap.set('.hero-buttons', { opacity: 0, y: 20 })
      gsap.set('.hero-features', { opacity: 0, y: 20 })
      gsap.set('.hero-image', { opacity: 0, scale: 0.9 })

      const tl = gsap.timeline({ delay: 0.3 })
      tl.to('.hero-title', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
        .to('.hero-buttons', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
        .to('.hero-features', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
        .to('.hero-image', { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }, '-=0.7')
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="hero" ref={sectionRef} className="min-h-screen flex items-center pt-20 pb-12 px-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-DEFAULT/10 border border-orange-DEFAULT/20">
              <FlaskConical className="w-4 h-4 text-orange-DEFAULT" />
              <span className="text-sm text-orange-DEFAULT font-medium">Research Grade Peptides</span>
            </div>

            <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Premium Peptides for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-DEFAULT to-orange-dark">
                Scientific Research
              </span>
            </h1>

            <p className="hero-subtitle text-lg text-white/70 max-w-xl">
              High-purity peptides manufactured under strict quality control standards. 
              Trusted by researchers worldwide for laboratory studies and scientific applications.
            </p>

            <div className="hero-buttons flex flex-wrap gap-4">
              <button onClick={onShopNow} className="btn-primary flex items-center gap-2">
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="btn-secondary">
                Learn More
              </button>
            </div>

            <div className="hero-features flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-DEFAULT/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-orange-DEFAULT" />
                </div>
                <span className="text-sm text-white/70">99%+ Purity</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-DEFAULT/10 flex items-center justify-center">
                  <Beaker className="w-5 h-5 text-orange-DEFAULT" />
                </div>
                <span className="text-sm text-white/70">Lab Tested</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-DEFAULT/10 flex items-center justify-center">
                  <FlaskConical className="w-5 h-5 text-orange-DEFAULT" />
                </div>
                <span className="text-sm text-white/70">Research Grade</span>
              </div>
            </div>
          </div>

          <div className="hero-image relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-DEFAULT/30 to-purple-500/30 rounded-full blur-3xl opacity-50" />
              <div className="relative pill-panel p-8 aspect-square flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=600&fit=crop"
                  alt="Research Laboratory"
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute bottom-6 left-6 right-6 glass rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/60">Quality Assured</p>
                      <p className="font-semibold">HPLC Tested</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-orange-DEFAULT flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
