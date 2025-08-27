'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'

export default function SearchPage() {
  const { products, isLoading } = useApp()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const router = useRouter()

  // Real-time arama - her karakter yazıldığında çalışır
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    
    if (value.trim().length > 0) {
      const results = products.filter(product =>
        product.code.toLowerCase().includes(value.toLowerCase()) ||
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        product.brand.toLowerCase().includes(value.toLowerCase()) ||
        product.category.toLowerCase().includes(value.toLowerCase()) ||
        (product.model && product.model.toLowerCase().includes(value.toLowerCase())) ||
        (product.color && product.color.toLowerCase().includes(value.toLowerCase()))
      )
      setSearchResults(results)
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  const goToProduct = (productId: string) => {
    router.push(`/products?highlight=${productId}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-300">Ürünler yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Hızlı Ürün Arama</h1>
        <p className="text-gray-400">Ürün kodu, adı, marka, kategori veya renge göre arayın</p>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Ürün kodu, adı, marka, kategori, model veya renk girin..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            className="w-full px-6 py-4 text-lg bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            autoFocus
          />
        </div>
        
        {/* Arama Sonuçları */}
        {showResults && (
          <div>
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h4 className="text-lg font-medium text-gray-200 mb-4">
                {searchResults.length > 0 ? `${searchResults.length} ürün bulundu` : 'Ürün bulunamadı'}
              </h4>
              {searchResults.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {searchResults.map((product) => {
                    // Resim parsing
                    let firstImage = null
                    try {
                      if (product.images && typeof product.images === 'string') {
                        const images = JSON.parse(product.images)
                        firstImage = images && images.length > 0 ? images[0] : null
                      }
                    } catch (error) {
                      firstImage = null
                    }

                    return (
                      <div 
                        key={product.id}
                        onClick={() => goToProduct(product.id)}
                        className="flex items-center p-4 bg-gray-800 rounded-lg border border-gray-600 hover:border-blue-500 cursor-pointer transition-all hover:shadow-lg"
                      >
                        {/* Ürün Resmi */}
                        <div className="flex-shrink-0 w-24 h-24 mr-6">
                          {firstImage ? (
                            <img 
                              src={firstImage} 
                              alt={product.name}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedImage(firstImage)
                              }}
                              className="w-full h-full object-cover rounded-lg border border-gray-600 hover:border-blue-500 cursor-pointer transition-colors"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-600 rounded-lg border border-gray-500 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">Resim Yok</span>
                            </div>
                          )}
                        </div>

                        {/* Ürün Bilgileri */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center space-x-3 mb-2">
                                <span className="text-blue-400 font-mono text-lg font-bold">{product.code}</span>
                                <span className={`text-xs px-3 py-1 rounded-full font-medium ${product.inStock ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'}`}>
                                  {product.inStock ? 'Stokta' : 'Tükendi'}
                                </span>
                              </div>
                              <h3 className="text-gray-100 font-bold text-xl mb-2">{product.name}</h3>
                            </div>
                            
                            {/* BÜYÜK FİYAT */}
                            <div className="text-right">
                              <div className="text-green-400 font-bold text-3xl">
                                {product.salePrice.toLocaleString('tr-TR')} ₺
                              </div>
                              <div className="text-gray-400 text-sm mt-1">
                                Satış Fiyatı
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 mb-3">
                            <div><strong className="text-gray-200">Marka:</strong> {product.brand}</div>
                            <div><strong className="text-gray-200">Kategori:</strong> {product.category}</div>
                            <div><strong className="text-gray-200">Renk:</strong> {product.color}</div>
                            {product.model && <div><strong className="text-gray-200">Model:</strong> {product.model}</div>}
                          </div>
                          
                          {product.description && (
                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                              <span>Alış: {product.purchasePrice.toLocaleString('tr-TR')} ₺</span>
                              {product.suggestedSalePrice && (
                                <span className="ml-4">Önerilen: {product.suggestedSalePrice.toLocaleString('tr-TR')} ₺</span>
                              )}
                            </div>
                            <span className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                              Detaylar için tıklayın →
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-gray-400 text-center py-12">
                  <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Aradığınız kriterlere uygun ürün bulunamadı.</p>
                  <p className="text-sm">Farklı anahtar kelimeler deneyin.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {!showResults && (
          <div className="text-center py-12 text-gray-400">
            <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Arama yapmak için yukarıdaki kutuya yazın</p>
            <p className="text-sm mt-2">Toplam {products.length} ürün mevcut</p>
          </div>
        )}
      </div>

      {/* Resim Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl max-h-4xl p-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors z-10"
            >
              <X className="h-6 w-6" />
            </button>
            <img 
              src={selectedImage} 
              alt="Ürün resmi"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}
