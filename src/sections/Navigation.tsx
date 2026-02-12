import { useState, useEffect } from 'react'
import { ShoppingCart, Menu, X, FlaskConical } from 'lucide-react'
import { useCart } from '../context/CartContext'

interface NavigationProps {
  onCartClick: () => void
  onProductsClick: () => void
  onAdminClick: () => void
  currentView: string
}

export default function Navigation({
  onCartClick,
  onProductsClick,
  onAdminClick,
  currentView,
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { cartCount } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass py-3' : 'py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-DEFAULT to-orange-dark flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">
            PEP<span className="text-orange-DEFAULT">.</span>CENTER
          </span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('hero')}
            className="text-white/80 hover:text-white transition-colors"
          >
            Home
          </button>
          <button
            onClick={onProductsClick}
            className="text-white/80 hover:text-white transition-colors"
          >
            Products
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="text-white/80 hover:text-white transition-colors"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="text-white/80 hover:text-white transition-colors"
          >
            Contact
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onCartClick}
            className="relative p-2 text-white/80 hover:text-white transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-DEFAULT rounded-full text-xs font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={onAdminClick}
            className="hidden md:block px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            Admin
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden glass mt-3 mx-6 rounded-2xl p-6">
          <div className="flex flex-col gap-4">
            <button onClick={() => scrollToSection('hero')} className="text-white/80 hover:text-white text-left py-2">Home</button>
            <button onClick={onProductsClick} className="text-white/80 hover:text-white text-left py-2">Products</button>
            <button onClick={() => scrollToSection('about')} className="text-white/80 hover:text-white text-left py-2">About</button>
            <button onClick={() => scrollToSection('contact')} className="text-white/80 hover:text-white text-left py-2">Contact</button>
            <button onClick={onAdminClick} className="text-white/60 hover:text-white text-left py-2">Admin</button>
          </div>
        </div>
      )}
    </nav>
  )
}
