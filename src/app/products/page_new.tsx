'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, Plus, Edit, Trash2 } from 'lucide-react'

interface Product {
  id: string
  code: string
  name: string
  brand: string
  color: string
  category: string
  model: string
  purchasePrice: number
  salePrice: number
  images: string[]
  inStock: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  // Demo veriler
  useEffect(() => {
    setProducts([
      {
        id: '1',
        code: '001',
        name: 'Klasik Sirt Cantasi',
        brand: 'Adidas',
        color: 'Siyah',
        category: 'sirt-cantasi',
        model: 'Classic 2024',
        purchasePrice: 400,
        salePrice: 650,
        images: ['/uploads/bag1.webp'],
        inStock: true
      },
      {
        id: '2',
        code: '002',
        name: 'Okul Cantasi',
        brand: 'Eastpak',
        color: 'Mavi',
        category: 'okul-cantasi',
        model: 'Student Pro',
        purchasePrice: 350,
        salePrice: 550,
        images: ['/uploads/bag2.webp'],
        inStock: true
      },
      {
        id: '3',
        code: '003',
        name: 'Spor Cantasi',
        brand: 'Nike',
        color: 'Kirmizi',
        category: 'sirt-cantasi',
        model: 'Sport Max',
        purchasePrice: 500,
        salePrice: 800,
        images: ['/uploads/bag3.webp'],
        inStock: false
      }
    ])
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code.includes(searchTerm) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleDelete = (id: string) => {
    if (confirm('Bu urunu silmek istediginizden emin misiniz?')) {
      setProducts(prev => prev.filter(p => p.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Urunler</h1>
          <p className="text-gray-600">Tum urunlerinizi yonetin</p>
        </div>
        <Link
          href="/products/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Yeni Urun
        </Link>
      </div>

      {/* Arama ve Filtreler */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arama
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Urun adi, kodu veya marka..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
            >
              <option value="">Tum Kategoriler</option>
              <option value="sirt-cantasi">Sirt Cantasi</option>
              <option value="okul-cantasi">Okul Cantasi</option>
              <option value="el-cantasi">El Cantasi</option>
              <option value="laptop-cantasi">Laptop Cantasi</option>
              <option value="diger">Diger</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterCategory('')
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Temizle
            </button>
          </div>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Toplam Urun</h3>
          <p className="text-3xl font-bold text-blue-600">{products.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Stokta Var</h3>
          <p className="text-3xl font-bold text-green-600">
            {products.filter(p => p.inStock).length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Stokta Yok</h3>
          <p className="text-3xl font-bold text-red-600">
            {products.filter(p => !p.inStock).length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Toplam Deger</h3>
          <p className="text-3xl font-bold text-purple-600">
            {products.reduce((sum, p) => sum + p.salePrice, 0).toLocaleString()} TL
          </p>
        </div>
      </div>

      {/* Urun Listesi */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Urun Listesi ({filteredProducts.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urun
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fiyatlar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stok
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Islemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {product.code}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.brand} - {product.color}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.category.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>Alis: {product.purchasePrice} TL</div>
                    <div>Satis: {product.salePrice} TL</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.inStock 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.inStock ? 'Stokta' : 'Stok Yok'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="Duzenle"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Hic urun bulunamadi</p>
          </div>
        )}
      </div>
    </div>
  )
}
