'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product, Transaction } from '@/types'

interface TransactionWithProduct extends Transaction {
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
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  refreshProducts: () => Promise<void>
  
  // Transactions
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<Transaction>
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
  // LocalStorage'dan veri yükle
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('canta-products')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('canta-transactions')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  
  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('canta-categories')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  
  const [isLoading, setIsLoading] = useState(false)

  // LocalStorage'a kaydet
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('canta-products', JSON.stringify(products))
    }
  }, [products])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('canta-transactions', JSON.stringify(transactions))
    }
  }, [transactions])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('canta-categories', JSON.stringify(categories))
    }
  }, [categories])

  // Products functions
  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      })
      
      if (response.ok) {
        const newProduct = await response.json()
        setProducts(prev => [newProduct, ...prev])
        return newProduct
      } else {
        throw new Error('Ürün eklenemedi')
      }
    } catch (error) {
      console.error('Add product error:', error)
      alert('Ürün eklenirken hata oluştu')
      throw error
    }
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
        // API'den gelen veriyi localStorage'a da kaydet
        if (typeof window !== 'undefined') {
          localStorage.setItem('canta-products', JSON.stringify(data))
        }
      }
    } catch (error) {
      console.error('Products yüklenirken hata:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Transactions functions
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
      })
      
      if (response.ok) {
        const newTransaction = await response.json()
        setTransactions(prev => [newTransaction, ...prev])
        return newTransaction
      } else {
        throw new Error('İşlem eklenemedi')
      }
    } catch (error) {
      console.error('Add transaction error:', error)
      alert('İşlem eklenirken hata oluştu')
      throw error
    }
  }

  const refreshTransactions = async () => {
    try {
      const response = await fetch('/api/transactions')
      if (response.ok) {
        const data = await response.json()
        setTransactions(data)
        // API'den gelen veriyi localStorage'a da kaydet
        if (typeof window !== 'undefined') {
          localStorage.setItem('canta-transactions', JSON.stringify(data))
        }
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
        // API'den gelen veriyi localStorage'a da kaydet
        if (typeof window !== 'undefined') {
          localStorage.setItem('canta-categories', JSON.stringify(data))
        }
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
    .filter(t => t.type === 'gelir' && new Date(t.date) >= thirtyDaysAgo)
    .reduce((sum, t) => sum + t.amount, 0)

  // İlk yükleme - her zaman API'den fresh data çek
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
