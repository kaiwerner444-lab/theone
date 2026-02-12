import { useState } from 'react'
import { X, Plus, Minus, ShoppingBag, Truck, Package, Zap } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/utils'
import type { ShippingDetails, ShippingMethod } from '../types'

interface CartPageProps {
  isOpen: boolean
  onClose: () => void
  onOrderComplete: (orderId: string) => void
}

const SHIPPING_METHODS: ShippingMethod[] = [
  { id: 'standard', name: 'Standard Shipping', description: '5-7 business days', price: 8.99, estimatedDays: '5-7 days' },
  { id: 'express', name: 'Express Shipping', description: '2-3 business days', price: 15.99, estimatedDays: '2-3 days' },
  { id: 'overnight', name: 'Overnight Shipping', description: 'Next business day', price: 29.99, estimatedDays: '1 day' },
]

export default function CartPage({ isOpen, onClose, onOrderComplete }: CartPageProps) {
  const { cart, removeFromCart, updateQuantity, cartTotal, checkout } = useCart()
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment'>('cart')
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod['id']>('standard')
  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    firstName: '', lastName: '', email: '', address: '', city: '', state: '', zipCode: '', country: 'US',
  })

  const shippingCost = SHIPPING_METHODS.find((m) => m.id === selectedShipping)?.price || 8.99
  const total = cartTotal + shippingCost

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setShippingDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckout = async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const order = checkout(shippingDetails, selectedShipping)
    setIsProcessing(false)
    onOrderComplete(order.id)
    setStep('cart')
    setShippingDetails({ firstName: '', lastName: '', email: '', address: '', city: '', state: '', zipCode: '', country: 'US' })
  }

  const isShippingValid = () => {
    return shippingDetails.firstName && shippingDetails.lastName && shippingDetails.email && 
           shippingDetails.address && shippingDetails.city && shippingDetails.state && shippingDetails.zipCode
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-navy-900 border-l border-white/10 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-orange-DEFAULT" />
            {step === 'cart' && 'Shopping Cart'}
            {step === 'shipping' && 'Shipping Details'}
            {step === 'payment' && 'Payment'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/50">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-4 p-4 rounded-xl bg-white/5">
                      <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.product.name}</h4>
                        <p className="text-sm text-white/50">{item.product.purity}</p>
                        <p className="text-orange-DEFAULT font-semibold mt-1">{formatPrice(item.product.price)}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button onClick={() => removeFromCart(item.product.id)} className="p-1 hover:text-red-400 transition-colors"><X className="w-5 h-5" /></button>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1 hover:bg-white/10 rounded transition-colors"><Minus className="w-4 h-4" /></button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1 hover:bg-white/10 rounded transition-colors"><Plus className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 'shipping' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-semibold">Select Shipping Method</h3>
                {SHIPPING_METHODS.map((method) => (
                  <label key={method.id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${selectedShipping === method.id ? 'border-orange-DEFAULT bg-orange-DEFAULT/10' : 'border-white/10 hover:border-white/20'}`}>
                    <input type="radio" name="shipping" value={method.id} checked={selectedShipping === method.id} onChange={() => setSelectedShipping(method.id)} className="hidden" />
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      {method.id === 'standard' && <Truck className="w-5 h-5" />}
                      {method.id === 'express' && <Package className="w-5 h-5" />}
                      {method.id === 'overnight' && <Zap className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-white/50">{method.description}</p>
                    </div>
                    <span className="font-semibold">{formatPrice(method.price)}</span>
                  </label>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Shipping Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="firstName" placeholder="First Name" value={shippingDetails.firstName} onChange={handleInputChange} />
                  <input type="text" name="lastName" placeholder="Last Name" value={shippingDetails.lastName} onChange={handleInputChange} />
                </div>
                <input type="email" name="email" placeholder="Email Address" value={shippingDetails.email} onChange={handleInputChange} />
                <input type="text" name="address" placeholder="Street Address" value={shippingDetails.address} onChange={handleInputChange} />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="city" placeholder="City" value={shippingDetails.city} onChange={handleInputChange} />
                  <input type="text" name="state" placeholder="State" value={shippingDetails.state} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="zipCode" placeholder="ZIP Code" value={shippingDetails.zipCode} onChange={handleInputChange} />
                  <select name="country" value={shippingDetails.country} onChange={handleInputChange}>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-orange-DEFAULT/10 border border-orange-DEFAULT/20">
                <p className="text-sm text-orange-DEFAULT">This is a demo checkout. No actual payment will be processed.</p>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Payment Method</h3>
                <div className="p-4 rounded-xl border border-white/10"><p className="text-white/50">Mock Payment (Demo Mode)</p></div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-white/50">Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
                  <div className="flex justify-between"><span className="text-white/50">Shipping</span><span>{formatPrice(shippingCost)}</span></div>
                  <div className="border-t border-white/10 pt-2 flex justify-between font-semibold"><span>Total</span><span className="text-orange-DEFAULT">{formatPrice(total)}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-white/10 space-y-4">
            {step === 'cart' && (
              <>
                <div className="flex justify-between items-center"><span className="text-white/50">Subtotal</span><span className="text-xl font-bold">{formatPrice(cartTotal)}</span></div>
                <button onClick={() => setStep('shipping')} className="w-full btn-primary">Proceed to Checkout</button>
              </>
            )}
            {step === 'shipping' && (
              <>
                <div className="flex justify-between items-center"><span className="text-white/50">Total</span><span className="text-xl font-bold text-orange-DEFAULT">{formatPrice(total)}</span></div>
                <div className="flex gap-3">
                  <button onClick={() => setStep('cart')} className="flex-1 btn-secondary">Back</button>
                  <button onClick={() => setStep('payment')} disabled={!isShippingValid()} className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed">Continue</button>
                </div>
              </>
            )}
            {step === 'payment' && (
              <>
                <div className="flex justify-between items-center"><span className="text-white/50">Total</span><span className="text-xl font-bold text-orange-DEFAULT">{formatPrice(total)}</span></div>
                <div className="flex gap-3">
                  <button onClick={() => setStep('shipping')} className="flex-1 btn-secondary">Back</button>
                  <button onClick={handleCheckout} disabled={isProcessing} className="flex-1 btn-primary disabled:opacity-50">{isProcessing ? 'Processing...' : 'Complete Order'}</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
