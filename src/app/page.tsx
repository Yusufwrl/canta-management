'use client'

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'

export default function Home() {
  const { 
    totalProducts, 
    totalValue, 
    monthlyIncome, 
    lowStockCount,
    inStockCount,
    outOfStockCount,
    isLoading,
    products 
  } = useApp()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const router = useRouter()

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setShowResults(false)
      return
    }

    const results = products.filter(product =>
      product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setSearchResults(results)
    setShowResults(true)
  }

  // Real-time arama - her karakter yazıldığında çalışır
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    
    if (value.trim().length > 0) {
      const results = products.filter(product =>
        product.code.toLowerCase().includes(value.toLowerCase()) ||
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        product.brand.toLowerCase().includes(value.toLowerCase()) ||
        product.category.toLowerCase().includes(value.toLowerCase())
      )
      setSearchResults(results)
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const goToProduct = (productId: string) => {
    router.push(`/products?highlight=${productId}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-300">Veriler yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Ana Sayfa</h1>
        <p className="text-gray-400">Çanta mağazanızın genel durumu</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200">Toplam Ürün</h3>
          <p className="text-3xl font-bold text-blue-400">{totalProducts}</p>
          <p className="text-sm text-gray-400">Stokta: {inStockCount} | Yok: {outOfStockCount}</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200">Toplam Değer</h3>
          <p className="text-3xl font-bold text-green-400">{totalValue.toLocaleString('tr-TR')} ₺</p>
          <p className="text-sm text-gray-400">Aktif stok değeri</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200">Aylık Gelir</h3>
          <p className="text-3xl font-bold text-green-400">{monthlyIncome.toLocaleString('tr-TR')} ₺</p>
          <p className="text-sm text-gray-400">Son 30 gün</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200">Düşük Stok</h3>
          <p className="text-3xl font-bold text-yellow-400">{lowStockCount}</p>
          <p className="text-sm text-gray-400">Dikkat gerektiren</p>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Hızlı Ürün Arama</h3>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Ürün kodu, adı, marka veya kategori girin..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button 
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Ara
          </button>
        </div>
        
        {/* Arama Sonuçları */}
        {showResults && (
          <div className="mt-4">
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h4 className="text-sm font-medium text-gray-200 mb-3">
                Arama Sonuçları ({searchResults.length} ürün bulundu)
              </h4>
              {searchResults.length > 0 ? (
                <div className="space-y-4 lg:max-h-96 lg:overflow-y-auto">
                  {searchResults.slice(0, 8).map((product) => {
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
                        className="flex items-center p-4 bg-gray-800 rounded-lg border border-gray-600 hover:border-blue-500 cursor-pointer transition-colors"
                      >
                        {/* Ürün Resmi */}
                        <div className="flex-shrink-0 w-20 h-20 mr-4">
                          {firstImage ? (
                            <img 
                              src={firstImage} 
                              alt={product.name}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedImage(firstImage)
                              }}
                              className="w-full h-full object-cover rounded-md border border-gray-600 hover:border-blue-500 cursor-pointer transition-colors"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-600 rounded-md border border-gray-500 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">Resim Yok</span>
                            </div>
                          )}
                        </div>

                        {/* Ürün Bilgileri */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-blue-400 font-mono text-sm font-semibold">{product.code}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${product.inStock ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'}`}>
                                {product.inStock ? 'Stokta' : 'Tükendi'}
                              </span>
                            </div>
                            <div className="text-green-400 font-bold text-lg">
                              {product.salePrice.toLocaleString('tr-TR')} ₺
                            </div>
                          </div>
                          
                          <h3 className="text-gray-100 font-semibold text-base mb-1 truncate">{product.name}</h3>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span><strong>Marka:</strong> {product.brand}</span>
                            <span><strong>Kategori:</strong> {product.category}</span>
                            {product.color && <span><strong>Renk:</strong> {product.color}</span>}
                          </div>
                          
                          {product.description && (
                            <p className="text-gray-400 text-sm mt-2 truncate">{product.description}</p>
                          )}
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="text-xs text-gray-500">
                              <span>Alış: {product.purchasePrice.toLocaleString('tr-TR')} ₺</span>
                              {product.suggestedSalePrice && (
                                <span className="ml-3">Önerilen: {product.suggestedSalePrice.toLocaleString('tr-TR')} ₺</span>
                              )}
                            </div>
                            <span className="text-xs text-blue-400">Detaylar için tıklayın →</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {searchResults.length > 8 && (
                    <div className="text-center pt-2">
                      <button 
                        onClick={() => router.push(`/products?search=${encodeURIComponent(searchQuery)}`)}
                        className="text-blue-400 hover:text-blue-300 text-sm underline"
                      >
                        Tüm sonuçları görüntüle ({searchResults.length - 8} ürün daha)
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400 text-center py-8">
                  <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Aradığınız kriterlere uygun ürün bulunamadı.</p>
                  <p className="text-sm mt-1">Farklı anahtar kelimeler deneyin.</p>
                </div>
              )}
            </div>
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
