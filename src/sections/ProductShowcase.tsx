import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Search, Filter, Plus, ChevronDown } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/utils'

gsap.registerPlugin(ScrollTrigger)

interface ProductShowcaseProps {
  onProductClick?: (productId: string) => void
}

const CATEGORIES = [
  { id: 'all', name: 'All Products' },
  { id: 'healing', name: 'Healing' },
  { id: 'growth', name: 'Growth' },
  { id: 'research', name: 'Research' },
]

export default function ProductShowcase({ onProductClick }: ProductShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const { products } = useAdmin()
  const { addToCart } = useCart()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set())

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      addToCart(product)
      setAddedProducts((prev) => new Set(prev).add(productId))
      setTimeout(() => {
        setAddedProducts((prev) => {
          const next = new Set(prev)
          next.delete(productId)
          return next
        })
      }, 2000)
    }
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.product-header', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        opacity: 0, y: 30, duration: 0.6,
      })
      gsap.from('.product-card-item', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        opacity: 0, y: 40, stagger: 0.1, duration: 0.6,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="products" ref={sectionRef} className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="product-header text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Research <span className="text-orange-DEFAULT">Peptides</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Browse our collection of high-purity peptides for scientific research applications. 
            All products are strictly for laboratory use only.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3"
            />
          </div>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none pl-4 pr-12 py-3 cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card-item product-card overflow-hidden group">
              <div className="aspect-square overflow-hidden cursor-pointer" onClick={() => onProductClick?.(product.id)}>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-orange-DEFAULT uppercase tracking-wider">{product.category}</span>
                  <span className="text-xs text-white/40">{product.purity}</span>
                </div>
                <h3 className="font-semibold text-lg mb-1 cursor-pointer hover:text-orange-DEFAULT transition-colors" onClick={() => onProductClick?.(product.id)}>
                  {product.name}
                </h3>
                <p className="text-sm text-white/50 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-orange-DEFAULT">{formatPrice(product.price)}</span>
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className={`p-3 rounded-full transition-all duration-300 ${
                      addedProducts.has(product.id) ? 'bg-green-500 text-white' : 'bg-orange-DEFAULT text-white hover:bg-orange-dark'
                    }`}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <Filter className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  )
}
