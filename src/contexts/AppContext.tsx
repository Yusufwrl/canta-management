'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Product {
  id: string
  code: string
  name: string
  brand: string
  color: string
  category: string
  model: string
  description?: string
  purchasePrice: number
  salePrice: number
  suggestedSalePrice?: number
  images: string[]
  inStock: boolean
  createdAt: string
  updatedAt: string
}

interface Transaction {
  id: string
  type: string
  amount: number
  description: string
  category?: string
  productId?: string
  date: string
  product?: Product
}

interface Category {
  id: string
  name: string
  description?: string
  productCount: number
}

interface AppContextType {
  // Products
  products: Product[]
  setProducts: (products: Product[]) => void
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  refreshProducts: () => Promise<void>
  
  // Transactions
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
  addTransaction: (transaction: Transaction) => void
  refreshTransactions: () => Promise<void>
  
  // Categories
  categories: Category[]
  setCategories: (categories: Category[]) => void
  deleteCategory: (id: string) => void
  refreshCategories: () => Promise<void>
  
  // Stats
  totalProducts: number
  totalValue: number
  monthlyIncome: number
  lowStockCount: number
  inStockCount: number
  outOfStockCount: number
  
  // Loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Products functions
  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev])
  }

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p))
  }

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id.toString() !== id))
        await refreshTransactions() // Transactions'ı da güncelle
      } else {
        const error = await response.json()
        alert(error.error || 'Ürün silinirken hata oluştu')
      }
    } catch (error) {
      console.error('Delete product error:', error)
      alert('Ürün silinirken hata oluştu')
    }
  }

  const refreshProducts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Products yüklenirken hata:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Transactions functions
  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev])
  }

  const refreshTransactions = async () => {
    try {
      const response = await fetch('/api/transactions')
      if (response.ok) {
        const data = await response.json()
        setTransactions(data)
      }
    } catch (error) {
      console.error('Transactions yüklenirken hata:', error)
    }
  }

  // Categories functions
  const refreshCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Categories yüklenirken hata:', error)
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setCategories(prev => prev.filter(c => c.id.toString() !== id))
      } else {
        const error = await response.json()
        alert(error.error || 'Kategori silinirken hata oluştu')
      }
    } catch (error) {
      console.error('Delete category error:', error)
      alert('Kategori silinirken hata oluştu')
    }
  }

  // Computed stats
  const totalProducts = products.length
  const inStockCount = products.filter(p => p.inStock).length
  const outOfStockCount = products.filter(p => !p.inStock).length
  const lowStockCount = Math.floor(totalProducts * 0.1) // %10'u düşük stok sayılır
  const totalValue = products.reduce((sum, p) => sum + (p.salePrice * (p.inStock ? 1 : 0)), 0)
  
  // Aylık gelir hesaplama (son 30 gün)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const monthlyIncome = transactions
    .filter(t => t.type === 'income' && new Date(t.date) >= thirtyDaysAgo)
    .reduce((sum, t) => sum + t.amount, 0)

  // İlk yükleme
  useEffect(() => {
    refreshProducts()
    refreshTransactions()
    refreshCategories()
  }, [])

  const value: AppContextType = {
    // Products
    products,
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
    
    // Transactions
    transactions,
    setTransactions,
    addTransaction,
    refreshTransactions,
    
    // Categories
    categories,
    setCategories,
    deleteCategory,
    refreshCategories,
    
    // Stats
    totalProducts,
    totalValue,
    monthlyIncome,
    lowStockCount,
    inStockCount,
    outOfStockCount,
    
    // Loading
    isLoading,
    setIsLoading
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
