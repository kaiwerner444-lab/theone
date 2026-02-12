import { FlaskConical } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-12 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-DEFAULT to-orange-dark flex items-center justify-center"><FlaskConical className="w-5 h-5 text-white" /></div>
              <span className="text-xl font-bold text-white">PEP<span className="text-orange-DEFAULT">.</span>CENTER</span>
            </div>
            <p className="text-white/60 max-w-md mb-4">Premium research peptides for scientific applications. Committed to quality, purity, and supporting the research community.</p>
            <p className="text-sm text-orange-DEFAULT">For research purposes only. Not for human consumption.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><button onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} className="text-white/60 hover:text-white transition-colors">Products</button></li>
              <li><button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="text-white/60 hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="text-white/60 hover:text-white transition-colors">Contact</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><button className="text-white/60 hover:text-white transition-colors">Terms of Service</button></li>
              <li><button className="text-white/60 hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button className="text-white/60 hover:text-white transition-colors">Shipping Policy</button></li>
              <li><button className="text-white/60 hover:text-white transition-colors">Refund Policy</button></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">&copy; {currentYear} PEP.CENTER. All rights reserved.</p>
          <p className="text-white/40 text-sm">Designed for scientific research applications.</p>
        </div>
      </div>
    </footer>
  )
}
