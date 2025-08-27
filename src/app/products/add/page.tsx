'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'

interface ProductForm {
  name: string
  brand: string
  color: string
  category: string
  model: string
  description: string
  purchasePrice: string
  salePrice: string
  suggestedSalePrice: string
}

export default function AddProductPage() {
  const router = useRouter()
  const { categories, refreshCategories } = useApp()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [form, setForm] = useState<ProductForm>({
    name: '',
    brand: '',
    color: '',
    category: '',
    model: '',
    description: '',
    purchasePrice: '',
    salePrice: '',
    suggestedSalePrice: ''
  })

  // Sayfa yüklendiğinde kategorileri güncelle
  useEffect(() => {
    refreshCategories()
  }, [refreshCategories])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(prev => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Resimleri base64'e çevir
      const imagePromises = images.map(convertImageToBase64)
      const imageBase64Array = await Promise.all(imagePromises)

      const productData = {
        ...form,
        images: imageBase64Array,
        purchasePrice: parseFloat(form.purchasePrice),
        salePrice: parseFloat(form.salePrice),
        suggestedSalePrice: form.suggestedSalePrice ? parseFloat(form.suggestedSalePrice) : null
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        alert('Ürün başarıyla eklendi!')
        router.push('/products')
      } else {
        const error = await response.json()
        alert(error.error || 'Bir hata oluştu!')
      }
    } catch (error) {
      console.error('Hata:', error)
      alert('Bir hata oluştu!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateForm = (field: keyof ProductForm, value: string) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value }
      
      // Alış fiyatı değiştiğinde önerilen fiyatı otomatik hesapla (%80 fazlası)
      if (field === 'purchasePrice' && value) {
        const purchasePrice = parseFloat(value)
        if (!isNaN(purchasePrice) && purchasePrice > 0) {
          const suggestedPrice = (purchasePrice * 1.8).toFixed(2) // %80 fazlası
          updated.suggestedSalePrice = suggestedPrice
        } else {
          updated.suggestedSalePrice = ''
        }
      }
      
      return updated
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Yeni Ürün Ekle</h1>
        <p className="text-gray-400">Mağazanıza yeni bir ürün ekleyin</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          <h2 className="text-lg font-medium text-gray-200 mb-4">Ürün Bilgileri</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Ürün Adı *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => updateForm('name', e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                placeholder="Örn: Klasik Çanta"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Marka *
              </label>
              <input
                type="text"
                required
                value={form.brand}
                onChange={(e) => updateForm('brand', e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                placeholder="Örn: Louis Vuitton"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Renk *
              </label>
              <input
                type="text"
                required
                value={form.color}
                onChange={(e) => updateForm('color', e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                placeholder="Örn: Siyah"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Kategori *
              </label>
              <select
                required
                value={form.category}
                onChange={(e) => updateForm('category', e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              >
                <option value="">Kategori Seçin</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Model
              </label>
              <input
                type="text"
                value={form.model}
                onChange={(e) => updateForm('model', e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                placeholder="Örn: Classic 2024 (opsiyonel)"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300">
              Açıklama
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              placeholder="Ürün hakkında detaylı bilgi..."
            />
          </div>
        </div>

        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          <h2 className="text-lg font-medium text-gray-200 mb-4">Fiyat Bilgileri</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Alış Fiyatı (₺) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={form.purchasePrice}
                onChange={(e) => updateForm('purchasePrice', e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Satış Fiyatı (₺) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={form.salePrice}
                onChange={(e) => updateForm('salePrice', e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Önerilen Fiyat (₺)
                <span className="text-xs text-gray-400 ml-2">(Alış fiyatının %80 fazlası)</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.suggestedSalePrice}
                readOnly
                className="mt-1 block w-full rounded-md bg-gray-600 border-gray-500 text-gray-300 shadow-sm px-3 py-2 border cursor-not-allowed"
                placeholder="Alış fiyatı girin..."
              />
            </div>
          </div>

          {/* Kar Marjı Hesaplama */}
          {form.purchasePrice && form.salePrice && (
            <div className="mt-4 p-4 bg-blue-900/20 rounded-lg border border-blue-700">
              <h3 className="text-sm font-medium text-blue-300">Kar Marjı</h3>
              <p className="text-lg font-bold text-blue-400">
                {((parseFloat(form.salePrice) - parseFloat(form.purchasePrice)) / parseFloat(form.purchasePrice) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-blue-300">
                Kar: {(parseFloat(form.salePrice) - parseFloat(form.purchasePrice)).toLocaleString('tr-TR')} ₺
              </p>
            </div>
          )}

          {/* Önerilen Fiyat Bilgisi */}
          {form.purchasePrice && form.suggestedSalePrice && (
            <div className="mt-4 p-4 bg-green-900/20 rounded-lg border border-green-700">
              <h3 className="text-sm font-medium text-green-300">Önerilen Fiyat Bilgisi</h3>
              <p className="text-lg font-bold text-green-400">
                Önerilen: {parseFloat(form.suggestedSalePrice).toLocaleString('tr-TR')} ₺
              </p>
              <p className="text-sm text-green-300">
                %80 kar marjı ile hesaplanmıştır
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          <h2 className="text-lg font-medium text-gray-200 mb-4">Ürün Resimleri</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Resim Yükle
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-300">
                      <span className="font-semibold">Tıkla</span> veya sürükle bırak
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG veya WEBP (MAX. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Yüklenecek Resimler */}
            {images.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Seçilen Resimler ({images.length})
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/products')}
            className="bg-gray-600 text-gray-200 px-6 py-2 rounded-md hover:bg-gray-500 transition-colors"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Kaydediliyor...' : 'Ürün Ekle'}
          </button>
        </div>
      </form>
    </div>
  )
}
