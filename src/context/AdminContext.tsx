import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Product, Order } from '../types'

interface AdminContextType {
  products: Product[]
  orders: Order[]
  updateProduct: (product: Product) => void
  addProduct: (product: Omit<Product, 'id'>) => void
  deleteProduct: (productId: string) => void
  updateOrderStatus: (orderId: string, status: Order['status']) => void
  getOrderById: (orderId: string) => Order | undefined
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'bpc-157',
    name: 'BPC-157',
    description: 'Research peptide for tissue regeneration studies',
    price: 49.99,
    category: 'healing',
    purity: '99.2%',
    form: 'Lyophilized Powder',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=400&fit=crop',
    inStock: true,
  },
  {
    id: 'tb-500',
    name: 'TB-500',
    description: 'Research peptide for cellular migration studies',
    price: 59.99,
    category: 'healing',
    purity: '98.9%',
    form: 'Lyophilized Powder',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop',
    inStock: true,
  },
  {
    id: 'cjc-1295',
    name: 'CJC-1295',
    description: 'Research peptide for growth hormone studies',
    price: 79.99,
    category: 'growth',
    purity: '99.1%',
    form: 'Lyophilized Powder',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=400&fit=crop',
    inStock: true,
  },
  {
    id: 'ipamorelin',
    name: 'Ipamorelin',
    description: 'Research peptide for growth hormone secretion studies',
    price: 69.99,
    category: 'growth',
    purity: '98.7%',
    form: 'Lyophilized Powder',
    image: 'https://images.unsplash.com/photo-1615461066842-32561977e3d8?w=400&h=400&fit=crop',
    inStock: true,
  },
  {
    id: 'melanotan-2',
    name: 'Melanotan II',
    description: 'Research peptide for melanogenesis studies',
    price: 54.99,
    category: 'research',
    purity: '99.0%',
    form: 'Lyophilized Powder',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=400&fit=crop',
    inStock: true,
  },
  {
    id: 'pt-141',
    name: 'PT-141',
    description: 'Research peptide for melanocortin receptor studies',
    price: 64.99,
    category: 'research',
    purity: '98.8%',
    form: 'Lyophilized Powder',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
    inStock: true,
  },
  {
    id: 'ghrp-6',
    name: 'GHRP-6',
    description: 'Research peptide for growth hormone release studies',
    price: 59.99,
    category: 'growth',
    purity: '98.9%',
    form: 'Lyophilized Powder',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&h=400&fit=crop',
    inStock: true,
  },
  {
    id: 'hexarelin',
    name: 'Hexarelin',
    description: 'Research peptide for growth hormone studies',
    price: 74.99,
    category: 'growth',
    purity: '99.3%',
    form: 'Lyophilized Powder',
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=400&h=400&fit=crop',
    inStock: true,
  },
  {
    id: 'mod-grf',
    name: 'Mod GRF 1-29',
    description: 'Research peptide for growth hormone pulse studies',
    price: 69.99,
    category: 'growth',
    purity: '98.6%',
    form: 'Lyophilized Powder',
    image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&h=400&fit=crop',
    inStock: true,
  },
  {
    id: 'selank',
    name: 'Selank',
    description: 'Research peptide for cognitive studies',
    price: 79.99,
    category: 'research',
    purity: '99.1%',
    form: 'Lyophilized Powder',
    image: 'https://images.unsplash.com/photo-1550831147-00de90d0d84e?w=400&h=400&fit=crop',
    inStock: true,
  },
  {
    id: 'semax',
    name: 'Semax',
    description: 'Research peptide for neuroprotective studies',
    price: 84.99,
    category: 'research',
    purity: '99.4%',
    form: 'Lyophilized Powder',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop',
    inStock: true,
  },
  {
    id: 'dsip',
    name: 'DSIP',
    description: 'Research peptide for sleep-related studies',
    price: 49.99,
    category: 'research',
    purity: '98.7%',
    form: 'Lyophilized Powder',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=400&fit=crop',
    inStock: true,
  },
]

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pepcenter-products')
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS
    }
    return DEFAULT_PRODUCTS
  })

  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pepcenter-orders')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem('pepcenter-products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem('pepcenter-orders', JSON.stringify(orders))
  }, [orders])

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
    }
    setProducts((prev) => [...prev, newProduct])
  }

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    )
  }

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId))
  }

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    )
    const allOrders = JSON.parse(localStorage.getItem('pepcenter-orders') || '[]')
    const updatedOrders = allOrders.map((o: Order) =>
      o.id === orderId ? { ...o, status } : o
    )
    localStorage.setItem('pepcenter-orders', JSON.stringify(updatedOrders))
  }

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId)
  }

  return (
    <AdminContext.Provider
      value={{
        products,
        orders,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        getOrderById,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
