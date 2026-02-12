import { useState } from 'react'
import { CartProvider } from './context/CartContext'
import { AdminProvider } from './context/AdminContext'
import Navigation from './sections/Navigation'
import HeroSection from './sections/HeroSection'
import ProductShowcase from './sections/ProductShowcase'
import CartPage from './sections/CartPage'
import AdminDashboard from './sections/AdminDashboard'
import AboutSection from './sections/AboutSection'
import ContactSection from './sections/ContactSection'
import Footer from './sections/Footer'
import OrderSuccess from './sections/OrderSuccess'

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState('home')

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <CartProvider>
      <AdminProvider>
        <div className="min-h-screen bg-navy-900">
          <Navigation
            onCartClick={() => setIsCartOpen(true)}
            onProductsClick={scrollToProducts}
            onAdminClick={() => setIsAdminOpen(true)}
            currentView={currentView}
          />
          <main>
            <HeroSection onShopNow={scrollToProducts} />
            <ProductShowcase />
            <AboutSection />
            <ContactSection />
          </main>
          <Footer />
          <CartPage isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onOrderComplete={(orderId) => { setIsCartOpen(false); setCompletedOrderId(orderId) }} />
          <AdminDashboard isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
          {completedOrderId && <OrderSuccess orderId={completedOrderId} onClose={() => setCompletedOrderId(null)} />}
        </div>
      </AdminProvider>
    </CartProvider>
  )
}

export default App
