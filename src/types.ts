export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  purity: string
  form: string
  image: string
  inStock: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface ShippingDetails {
  firstName: string
  lastName: string
  email: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface Order {
  id: string
  items: CartItem[]
  shipping: ShippingDetails
  shippingMethod: 'standard' | 'express' | 'overnight'
  subtotal: number
  shippingCost: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  createdAt: string
  trackingNumber?: string
}

export type ShippingMethod = {
  id: 'standard' | 'express' | 'overnight'
  name: string
  description: string
  price: number
  estimatedDays: string
}
