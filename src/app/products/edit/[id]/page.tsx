'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const { products, updateProduct, refreshProducts } = useApp()
  
  const productId = params.id as string
  const product = products.find(p => p.id === productId)

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    brand: '',
    color: '',
    category: '',
    purchasePrice: '',
    salePrice: '',
    inStock: true,
    description: '',
    images: [] as string[]
  })

  const [isLoading, setIsLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (product) {
      const images = typeof product.images === 'string' ? JSON.parse(product.images) : (product.images || [])
      setFormData({
        code: product.code,
        name: product.name,
        brand: product.brand,
        color: product.color,
        category: product.category,
        purchasePrice: product.purchasePrice.toString(),
        salePrice: product.salePrice.toString(),
        inStock: product.inStock,
        description: product.description || '',
        images: images
      })
    }
  }, [product])

  if (!product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/products"
            className="inline-flex items-center text-gray-400 hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Ürünlere Dön
          </Link>
        </div>
        <div className="text-center py-12">
          <div className="text-red-400">Ürün bulunamadı!</div>
        </div>
      </div>
    )
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const newImages: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          const data = await response.json()
          newImages.push(data.url)
        }
      } catch (error) {
        console.error('Upload error:', error)
      }
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }))
    setUploading(false)
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          purchasePrice: parseFloat(formData.purchasePrice),
          salePrice: parseFloat(formData.salePrice),
          images: JSON.stringify(formData.images)
        })
      })

      if (response.ok) {
        const updatedProduct = await response.json()
        updateProduct(productId, updatedProduct)
        await refreshProducts() // Fresh data çek
        router.push('/products')
      } else {
        const error = await response.json()
        alert(error.error || 'Ürün güncellenirken hata oluştu!')
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('Ürün güncellenirken hata oluştu!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          href="/products"
          className="inline-flex items-center text-gray-400 hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Ürünlere Dön
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Ürün Düzenle</h1>
          <p className="text-gray-400">Ürün bilgilerini güncelleyin</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Temel Bilgiler</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Ürün Kodu *
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                placeholder="Örn: 001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Ürün Adı *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                placeholder="Ürün adını girin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Marka *
              </label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                placeholder="Marka adını girin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Renk *
              </label>
              <input
                type="text"
                required
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                placeholder="Renk bilgisini girin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Kategori *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              >
                <option value="">Kategori seçin</option>
                <option value="lux-canta">Lüks Çanta</option>
                <option value="spor-canta">Spor Çantası</option>
                <option value="el-cantasi">El Çantası</option>
                <option value="sirt-cantasi">Sırt Çantası</option>
                <option value="laptop-cantasi">Laptop Çantası</option>
                <option value="diger">Diğer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Stok Durumu
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={formData.inStock}
                    onChange={() => setFormData({ ...formData, inStock: true })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-200">Stokta Var</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!formData.inStock}
                    onChange={() => setFormData({ ...formData, inStock: false })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-200">Stokta Yok</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Fiyat Bilgileri</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Alış Fiyatı (₺) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                className="block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Satış Fiyatı (₺) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                className="block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Ürün Görselleri</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Görsel Yükle
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Tıklayın</span> veya dosyaları sürükleyin
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG, JPEG (MAX. 10MB)</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              {uploading && (
                <p className="text-sm text-blue-400 mt-2">Görsel yükleniyor...</p>
              )}
            </div>

            {formData.images.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-200 mb-2">Mevcut Görseller</h4>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="w-full h-24 bg-gray-900 rounded-lg border border-gray-600 overflow-hidden">
                        <img
                          src={image}
                          alt={`Ürün görseli ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Açıklama</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Ürün Açıklaması
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              placeholder="Ürün hakkında detaylı bilgi..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/products"
            className="bg-gray-600 text-gray-200 px-6 py-2 rounded-md hover:bg-gray-500 transition-colors"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Güncelliyor...' : 'Güncelle'}
          </button>
        </div>
      </form>
    </div>
  )
}
