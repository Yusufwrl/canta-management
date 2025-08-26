'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Filter, Plus, Edit, Trash2, X, Eye, ArrowLeft } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'

function ProductsContent() {
  const { 
    products, 
    deleteProduct, 
    totalProducts, 
    inStockCount, 
    outOfStockCount, 
    totalValue,
    isLoading,
    refreshProducts,
    categories
  } = useApp()
  
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [highlightedProduct, setHighlightedProduct] = useState<string | null>(null)

  // URL parametrelerini kontrol et
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const searchParam = searchParams.get('search')
    const highlightParam = searchParams.get('highlight')
    
    if (categoryParam) {
      setFilterCategory(categoryParam)
    }
    if (searchParam) {
      setSearchTerm(searchParam)
    }
    if (highlightParam) {
      setHighlightedProduct(highlightParam)
      // 3 saniye sonra highlight'ı kaldır
      setTimeout(() => setHighlightedProduct(null), 3000)
    }
  }, [searchParams])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const uniqueCategories = Array.from(new Set(products.map(p => p.category))).filter(Boolean)

  const clearFilters = () => {
    setSearchTerm('')
    setFilterCategory('')
    window.history.pushState({}, '', '/products')
  }

  const handleDelete = async (id: string) => {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          deleteProduct(id)
        } else {
          const error = await response.json()
          alert(error.error || 'Ürün silinirken hata oluştu!')
        }
      } catch (error) {
        console.error('Silme hatası:', error)
        alert('Ürün silinirken hata oluştu!')
      }
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">
            Ürünler
            {filterCategory && (
              <span className="ml-3 text-blue-400 text-lg">
                - {filterCategory} Kategorisi
              </span>
            )}
          </h1>
          <p className="text-gray-400">
            {filterCategory ? 
              `${filterCategory} kategorisindeki ürünler (${filteredProducts.length} ürün)` :
              `Tüm ürünlerinizi yönetin (${filteredProducts.length}/${totalProducts} ürün gösteriliyor)`
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          {(filterCategory || searchTerm) && (
            <button
              onClick={clearFilters}
              className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Filtreleri Temizle
            </button>
          )}
          <button
            onClick={() => refreshProducts()}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-colors"
          >
            🔄 Yenile
          </button>
          <Link
            href="/products/add"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Yeni Ürün
          </Link>
        </div>
      </div>

      {/* Arama ve Filtreler */}
      <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Arama
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Ürün adı, kodu veya marka..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Kategori
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            >
              <option value="">Tüm Kategoriler</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>
                  {category} ({products.filter(p => p.category === category).length} ürün)
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="bg-gray-600 text-gray-200 px-4 py-2 rounded-md hover:bg-gray-500 flex items-center gap-2 transition-colors"
            >
              <Filter className="h-4 w-4" />
              Temizle
            </button>
          </div>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200">Toplam Ürün</h3>
          <p className="text-3xl font-bold text-blue-400">{totalProducts}</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200">Stokta Var</h3>
          <p className="text-3xl font-bold text-green-400">{inStockCount}</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200">Stokta Yok</h3>
          <p className="text-3xl font-bold text-red-400">{outOfStockCount}</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200">Toplam Değer</h3>
          <p className="text-3xl font-bold text-purple-400">{totalValue.toLocaleString('tr-TR')} ₺</p>
        </div>
      </div>

      {/* Ürün Listesi */}
      <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200">Ürün Listesi ({filteredProducts.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">GÖRSEL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ÜRÜN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">KATEGORİ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">FİYATLAR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">STOK</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">İŞLEMLER</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredProducts.map((product) => {
                // Basit resim parsing
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
                  <tr 
                    key={product.id} 
                    className={`transition-colors ${
                      highlightedProduct === product.id 
                        ? 'bg-blue-900 border-2 border-blue-500 animate-pulse' 
                        : 'hover:bg-gray-700'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex-shrink-0 w-16 h-16">
                        {firstImage ? (
                          <img 
                            src={firstImage} 
                            alt={product.name}
                            onClick={() => setSelectedImage(firstImage)}
                            className="w-full h-full object-cover rounded-md border border-gray-600 hover:border-blue-500 cursor-pointer transition-colors"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-600 rounded-md border border-gray-500 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">Resim Yok</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <div className="font-medium text-gray-100">{product.code}</div>
                          <div className="text-gray-300">{product.name}</div>
                          <div className="text-gray-400">{product.brand} - {product.color}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-900 text-blue-200">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div>Alış: {product.purchasePrice.toLocaleString('tr-TR')} ₺</div>
                      <div>Satış: {product.salePrice.toLocaleString('tr-TR')} ₺</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.inStock 
                          ? 'bg-green-900 text-green-200' 
                          : 'bg-red-900 text-red-200'
                      }`}>
                        {product.inStock ? 'Stokta' : 'Yok'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link 
                          href={`/products/edit/${product.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg inline-flex items-center justify-center"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400">Ürün bulunamadı.</div>
              <Link
                href="/products/add"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                İlk Ürünü Ekle
              </Link>
            </div>
          )}
        </div>
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

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-4">Yükleniyor...</div>}>
      <ProductsContent />
    </Suspense>
  )
}
