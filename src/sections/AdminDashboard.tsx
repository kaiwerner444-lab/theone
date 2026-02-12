import { useState } from 'react'
import { X, Package, ShoppingCart, Users, DollarSign, Printer, Search, Edit2, Trash2, Plus } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import { formatPrice } from '../lib/utils'
import type { Product } from '../types'

interface AdminDashboardProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const { products, orders, updateProduct, deleteProduct, addProduct, updateOrderStatus } = useAdmin()
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const pendingOrders = orders.filter((o) => o.status === 'pending').length

  const handlePrintLabel = (order: typeof orders[0]) => {
    const labelWindow = window.open('', '_blank')
    if (labelWindow) {
      labelWindow.document.write(`
        <html><head><title>Shipping Label - ${order.id}</title>
        <style>body{font-family:Arial,sans-serif;padding:40px}.label{border:2px solid #000;padding:20px;max-width:400px}.header{font-size:24px;font-weight:bold;margin-bottom:20px}.section{margin-bottom:15px}.label-title{font-weight:bold;margin-bottom:5px}</style>
        </head><body>
        <div class="label"><div class="header">PEP.CENTER</div>
        <div class="section"><div class="label-title">SHIP TO:</div><div>${order.shipping.firstName} ${order.shipping.lastName}</div><div>${order.shipping.address}</div><div>${order.shipping.city}, ${order.shipping.state} ${order.shipping.zipCode}</div><div>${order.shipping.country}</div></div>
        <div class="section"><div class="label-title">TRACKING #:</div><div>${order.trackingNumber}</div></div>
        <div class="section"><div class="label-title">ORDER #:</div><div>${order.id}</div></div>
        </div></body></html>
      `)
      labelWindow.document.close()
      labelWindow.print()
    }
  }

  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const productData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      purity: formData.get('purity') as string,
      form: formData.get('form') as string,
      image: formData.get('image') as string,
      inStock: formData.get('inStock') === 'true',
    }
    if (editingProduct) {
      updateProduct({ ...editingProduct, ...productData })
      setEditingProduct(null)
    } else {
      addProduct(productData)
      setIsAddingProduct(false)
    }
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-4 md:inset-10 bg-navy-900 rounded-2xl border border-white/10 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6" /></button>
        </div>

        <div className="flex gap-1 p-2 border-b border-white/10">
          {(['overview', 'products', 'orders'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 rounded-lg font-medium capitalize transition-colors ${activeTab === tab ? 'bg-orange-DEFAULT text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="pill-panel p-6"><div className="flex items-center justify-between mb-4"><Package className="w-8 h-8 text-orange-DEFAULT" /><span className="text-2xl font-bold">{products.length}</span></div><p className="text-white/60">Total Products</p></div>
              <div className="pill-panel p-6"><div className="flex items-center justify-between mb-4"><ShoppingCart className="w-8 h-8 text-orange-DEFAULT" /><span className="text-2xl font-bold">{orders.length}</span></div><p className="text-white/60">Total Orders</p></div>
              <div className="pill-panel p-6"><div className="flex items-center justify-between mb-4"><Users className="w-8 h-8 text-orange-DEFAULT" /><span className="text-2xl font-bold">{pendingOrders}</span></div><p className="text-white/60">Pending Orders</p></div>
              <div className="pill-panel p-6"><div className="flex items-center justify-between mb-4"><DollarSign className="w-8 h-8 text-orange-DEFAULT" /><span className="text-2xl font-bold">{formatPrice(totalRevenue)}</span></div><p className="text-white/60">Total Revenue</p></div>
              <div className="md:col-span-2 lg:col-span-4">
                <h3 className="font-semibold mb-4">Recent Orders</h3>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                      <div><p className="font-medium">{order.id}</p><p className="text-sm text-white/50">{order.shipping.firstName} {order.shipping.lastName}</p></div>
                      <div className="text-right"><p className="font-semibold">{formatPrice(order.total)}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : order.status === 'processing' ? 'bg-blue-500/20 text-blue-500' : order.status === 'shipped' ? 'bg-purple-500/20 text-purple-500' : 'bg-green-500/20 text-green-500'}`}>{order.status}</span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && <p className="text-white/50 text-center py-8">No orders yet</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" /><input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3" /></div>
                <button onClick={() => setIsAddingProduct(true)} className="btn-primary flex items-center gap-2"><Plus className="w-5 h-5" />Add Product</button>
              </div>
              <div className="grid gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1"><p className="font-semibold">{product.name}</p><p className="text-sm text-white/50">{product.category}</p></div>
                    <div className="text-right"><p className="font-semibold text-orange-DEFAULT">{formatPrice(product.price)}</p><p className="text-sm text-white/50">{product.purity}</p></div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingProduct(product)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Edit2 className="w-5 h-5" /></button>
                      <button onClick={() => deleteProduct(product.id)} className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="p-4 rounded-xl bg-white/5">
                  <div className="flex items-start justify-between mb-4">
                    <div><p className="font-semibold">{order.id}</p><p className="text-sm text-white/50">{new Date(order.createdAt).toLocaleDateString()}</p></div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-3 py-1 rounded-full ${order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : order.status === 'processing' ? 'bg-blue-500/20 text-blue-500' : order.status === 'shipped' ? 'bg-purple-500/20 text-purple-500' : 'bg-green-500/20 text-green-500'}`}>{order.status}</span>
                      <button onClick={() => handlePrintLabel(order)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Printer className="w-5 h-5" /></button>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div><p className="text-sm text-white/50 mb-1">Customer</p><p>{order.shipping.firstName} {order.shipping.lastName}</p><p className="text-sm text-white/50">{order.shipping.email}</p></div>
                    <div><p className="text-sm text-white/50 mb-1">Shipping Address</p><p className="text-sm">{order.shipping.address}</p><p className="text-sm">{order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}</p></div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div><p className="text-sm text-white/50">Items</p><p className="text-sm">{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</p></div>
                    <div className="text-right"><p className="text-sm text-white/50">Total</p><p className="text-xl font-bold text-orange-DEFAULT">{formatPrice(order.total)}</p></div>
                  </div>
                  {order.status !== 'delivered' && (
                    <div className="flex gap-2 mt-4">
                      {order.status === 'pending' && <button onClick={() => updateOrderStatus(order.id, 'processing')} className="flex-1 py-2 bg-blue-500/20 text-blue-500 rounded-lg hover:bg-blue-500/30 transition-colors">Mark Processing</button>}
                      {order.status === 'processing' && <button onClick={() => updateOrderStatus(order.id, 'shipped')} className="flex-1 py-2 bg-purple-500/20 text-purple-500 rounded-lg hover:bg-purple-500/30 transition-colors">Mark Shipped</button>}
                      {order.status === 'shipped' && <button onClick={() => updateOrderStatus(order.id, 'delivered')} className="flex-1 py-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-colors">Mark Delivered</button>}
                    </div>
                  )}
                </div>
              ))}
              {orders.length === 0 && <p className="text-white/50 text-center py-8">No orders yet</p>}
            </div>
          )}
        </div>
      </div>

      {(editingProduct || isAddingProduct) && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setEditingProduct(null); setIsAddingProduct(false) }} />
          <div className="relative bg-navy-900 rounded-2xl border border-white/10 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-6">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div><label className="block text-sm text-white/60 mb-1">Name</label><input type="text" name="name" defaultValue={editingProduct?.name} required /></div>
              <div><label className="block text-sm text-white/60 mb-1">Description</label><textarea name="description" defaultValue={editingProduct?.description} required rows={3} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-white/60 mb-1">Price</label><input type="number" name="price" step="0.01" defaultValue={editingProduct?.price} required /></div>
                <div><label className="block text-sm text-white/60 mb-1">Category</label><select name="category" defaultValue={editingProduct?.category || 'research'}><option value="healing">Healing</option><option value="growth">Growth</option><option value="research">Research</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-white/60 mb-1">Purity</label><input type="text" name="purity" defaultValue={editingProduct?.purity || '99.0%'} required /></div>
                <div><label className="block text-sm text-white/60 mb-1">Form</label><input type="text" name="form" defaultValue={editingProduct?.form || 'Lyophilized Powder'} required /></div>
              </div>
              <div><label className="block text-sm text-white/60 mb-1">Image URL</label><input type="url" name="image" defaultValue={editingProduct?.image} required /></div>
              <div><label className="block text-sm text-white/60 mb-1">In Stock</label><select name="inStock" defaultValue={editingProduct?.inStock ? 'true' : 'false'}><option value="true">Yes</option><option value="false">No</option></select></div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => { setEditingProduct(null); setIsAddingProduct(false) }} className="flex-1 btn-secondary">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
