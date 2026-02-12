import { CheckCircle, Copy, Package, Truck } from 'lucide-react'
import { useState } from 'react'

interface OrderSuccessProps {
  orderId: string
  onClose: () => void
}

export default function OrderSuccess({ orderId, onClose }: OrderSuccessProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-navy-900 rounded-2xl border border-white/10 p-8 w-full max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-10 h-10 text-green-500" /></div>
        <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
        <p className="text-white/60 mb-6">Thank you for your order. We've sent a confirmation email with your order details.</p>
        <div className="pill-panel p-4 mb-6">
          <p className="text-sm text-white/50 mb-1">Order Number</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl font-bold text-orange-DEFAULT">{orderId}</span>
            <button onClick={handleCopy} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Copy className="w-4 h-4" /></button>
          </div>
          {copied && <p className="text-xs text-green-500 mt-1">Copied!</p>}
        </div>
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5"><Package className="w-5 h-5 text-orange-DEFAULT" /><div className="text-left"><p className="text-sm font-medium">Order Processing</p><p className="text-xs text-white/50">We'll prepare your order within 24 hours</p></div></div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5"><Truck className="w-5 h-5 text-orange-DEFAULT" /><div className="text-left"><p className="text-sm font-medium">Shipping</p><p className="text-xs text-white/50">You'll receive tracking info via email</p></div></div>
        </div>
        <button onClick={onClose} className="w-full btn-primary">Continue Shopping</button>
      </div>
    </div>
  )
}
