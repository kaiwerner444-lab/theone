import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FlaskConical, Shield, Beaker, Microscope } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-title', { scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }, opacity: 0, y: 30, duration: 0.6 })
      gsap.from('.about-text', { scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }, opacity: 0, y: 30, stagger: 0.2, duration: 0.6 })
      gsap.from('.about-feature', { scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' }, opacity: 0, y: 40, stagger: 0.15, duration: 0.6 })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const features = [
    { icon: Shield, title: 'Quality Assured', description: 'Every batch undergoes rigorous HPLC testing to ensure 99%+ purity.' },
    { icon: Beaker, title: 'Lab Tested', description: 'Independent third-party laboratory verification for all products.' },
    { icon: Microscope, title: 'Research Grade', description: 'Manufactured in ISO-certified facilities for scientific research.' },
    { icon: FlaskConical, title: 'Expert Support', description: 'Dedicated team of scientists available for research inquiries.' },
  ]

  return (
    <section id="about" ref={sectionRef} className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="about-title text-3xl md:text-4xl font-bold mb-6">
              Committed to <span className="text-orange-DEFAULT">Scientific Excellence</span>
            </h2>
            <div className="space-y-4 text-white/70">
              <p className="about-text">PEP.CENTER is dedicated to providing researchers with the highest quality peptides for scientific studies. Our products are strictly intended for laboratory research purposes only.</p>
              <p className="about-text">We maintain rigorous quality control standards, with every batch undergoing comprehensive HPLC analysis to verify purity and composition. Our commitment to transparency means you receive detailed certificates of analysis with every order.</p>
              <p className="about-text">All peptides are synthesized in state-of-the-art facilities under strict GMP guidelines, ensuring consistency and reliability for your research applications.</p>
            </div>
            <div className="about-text mt-8 p-4 rounded-xl bg-orange-DEFAULT/10 border border-orange-DEFAULT/20">
              <p className="text-sm text-orange-DEFAULT"><strong>Important Notice:</strong> All products sold on PEP.CENTER are intended for research purposes only. Not for human consumption. Researchers must comply with all applicable laws and regulations.</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="about-feature pill-panel p-6 hover:border-orange-DEFAULT/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-orange-DEFAULT/10 flex items-center justify-center mb-4"><feature.icon className="w-6 h-6 text-orange-DEFAULT" /></div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-white/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
