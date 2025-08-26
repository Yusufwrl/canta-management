'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X } from 'lucide-react'

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(prev => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Burada resim optimizasyonu ve veritabanina kaydetme islemi yapilacak
      console.log('Form verisi:', form)
      console.log('Resimler:', images)
      
      // Demo amacli setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('Urun basariyla eklendi!')
      router.push('/products')
    } catch (error) {
      console.error('Hata:', error)
      alert('Bir hata olustu!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateForm = (field: keyof ProductForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Yeni Urun Ekle</h1>
        <p className="text-gray-600">Magazaniza yeni bir urun ekleyin</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Urun Bilgileri</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Urun Adi *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => updateForm('name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                placeholder="Orn: Klasik Sirt Cantasi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Marka *
              </label>
              <input
                type="text"
                required
                value={form.brand}
                onChange={(e) => updateForm('brand', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                placeholder="Orn: Adidas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Renk *
              </label>
              <input
                type="text"
                required
                value={form.color}
                onChange={(e) => updateForm('color', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                placeholder="Orn: Siyah"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kategori *
              </label>
              <select
                required
                value={form.category}
                onChange={(e) => updateForm('category', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
              >
                <option value="">Kategori Secin</option>
                <option value="sirt-cantasi">Sirt Cantasi</option>
                <option value="okul-cantasi">Okul Cantasi</option>
                <option value="el-cantasi">El Cantasi</option>
                <option value="laptop-cantasi">Laptop Cantasi</option>
                <option value="diger">Diger</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Model *
              </label>
              <input
                type="text"
                required
                value={form.model}
                onChange={(e) => updateForm('model', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                placeholder="Orn: Classic 2024"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              Aciklama
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
              placeholder="Urun hakkinda detayli bilgi..."
            />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Fiyat Bilgileri</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Alis Fiyati (TL) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={form.purchasePrice}
                onChange={(e) => updateForm('purchasePrice', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Satis Fiyati (TL) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={form.salePrice}
                onChange={(e) => updateForm('salePrice', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Onerilen Fiyat (TL)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.suggestedSalePrice}
                onChange={(e) => updateForm('suggestedSalePrice', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Kar Marji Hesaplama */}
          {form.purchasePrice && form.salePrice && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900">Kar Marji</h3>
              <p className="text-lg font-bold text-blue-600">
                {((parseFloat(form.salePrice) - parseFloat(form.purchasePrice)) / parseFloat(form.purchasePrice) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-blue-700">
                Kar: {(parseFloat(form.salePrice) - parseFloat(form.purchasePrice)).toFixed(2)} TL
              </p>
            </div>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Urun Resimleri</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resim Yukle
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Tikla</span> veya surukle birak
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG veya WEBP (MAX. 5MB)</p>
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

            {/* Yuklenecek Resimler */}
            {images.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Secilen Resimler ({images.length})
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
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
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
          >
            Iptal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Kaydediliyor...' : 'Urun Ekle'}
          </button>
        </div>
      </form>
    </div>
  )
}
