import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Product, CartItem, ShippingDetails, Order } from '../types'
import { generateOrderId, generateTrackingNumber } from '../lib/utils'

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
  checkout: (shipping: ShippingDetails, shippingMethod: 'standard' | 'express' | 'overnight') => Order
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const SHIPPING_COSTS = {
  standard: 8.99,
  express: 15.99,
  overnight: 29.99,
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pepcenter-cart')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem('pepcenter-cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const checkout = (
    shipping: ShippingDetails,
    shippingMethod: 'standard' | 'express' | 'overnight'
  ): Order => {
    const subtotal = cartTotal
    const shippingCost = SHIPPING_COSTS[shippingMethod]
    const total = subtotal + shippingCost

    const order: Order = {
      id: generateOrderId(),
      items: [...cart],
      shipping,
      shippingMethod,
      subtotal,
      shippingCost,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      trackingNumber: generateTrackingNumber(),
    }

    const existingOrders = JSON.parse(localStorage.getItem('pepcenter-orders') || '[]')
    localStorage.setItem('pepcenter-orders', JSON.stringify([order, ...existingOrders]))

    clearCart()
    return order
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
