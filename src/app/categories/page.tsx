'use client'

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Package, Eye, ArrowRight } from 'lucide-react'

export default function CategoriesPage() {
  const { categories, products, deleteCategory, refreshCategories } = useApp()
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  })
  const [editCategory, setEditCategory] = useState({
    name: '',
    description: ''
  })
  const router = useRouter()

  // Debug bilgileri geçici olarak kaldırıldı

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategory.name) return

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      })

      if (response.ok) {
        setNewCategory({ name: '', description: '' })
        setShowAddForm(false)
        await refreshCategories()
      } else {
        alert('Kategori eklenirken hata oluştu!')
      }
    } catch (error) {
      console.error('Error adding category:', error)
      alert('Kategori eklenirken hata oluştu!')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      await deleteCategory(id)
    }
  }

  const getCategoryProducts = (categoryName: string) => {
    return products.filter(product => product.category === categoryName)
  }

  const getCategoryStats = (categoryName: string) => {
    const categoryProducts = getCategoryProducts(categoryName)
    const inStock = categoryProducts.filter(p => p.inStock).length
    const outOfStock = categoryProducts.filter(p => !p.inStock).length
    const totalValue = categoryProducts.reduce((sum, p) => sum + (p.inStock ? p.salePrice : 0), 0)
    
    return { total: categoryProducts.length, inStock, outOfStock, totalValue }
  }

  const viewCategoryDetails = (categoryName: string) => {
    router.push(`/products?category=${encodeURIComponent(categoryName)}`)
  }

  const syncCategories = async () => {
    try {
      const response = await fetch('/api/categories/sync', { method: 'POST' })
      const result = await response.json()
      alert(`${result.addedCategories?.length || 0} kategori eklendi`)
      await refreshCategories()
    } catch (error) {
      alert('Senkronizasyon hatası')
    }
  }

  const handleEdit = (category: any) => {
    setEditingCategory(category)
    setEditCategory({
      name: category.name,
      description: category.description || ''
    })
    setShowEditForm(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editCategory.name || !editingCategory) return

    try {
      console.log('Editing category:', editingCategory) // Debug için
      
      const response = await fetch('/api/categories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingCategory.id,
          name: editCategory.name,
          description: editCategory.description
        }),
      })

      const result = await response.json()
      console.log('Update response:', result) // Debug için

      if (response.ok) {
        setEditCategory({ name: '', description: '' })
        setShowEditForm(false)
        setEditingCategory(null)
        await refreshCategories()
        alert('Kategori güncellendi!')
      } else {
        console.error('Update error:', result)
        alert(`Kategori güncellenirken hata oluştu: ${result.error || result.details || 'Bilinmeyen hata'}`)
      }
    } catch (error) {
      console.error('Error updating category:', error)
      alert('Kategori güncellenirken ağ hatası oluştu!')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Kategoriler</h1>
          <p className="text-gray-400">Ürün kategorilerinizi yönetin</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={syncCategories}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            🔄 Kategorileri Senkronize Et
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Yeni Kategori
          </button>
        </div>
      </div>

      {/* Yeni Kategori Formu */}
      {showAddForm && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-medium text-gray-200 mb-4">Yeni Kategori Ekle</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Kategori Adı</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 px-3 py-2 border"
                placeholder="Kategori adı"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Açıklama</label>
              <textarea
                value={newCategory.description}
                onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 px-3 py-2 border"
                placeholder="Kategori açıklaması"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-300 bg-gray-600 rounded-md hover:bg-gray-500 transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Ekle
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Kategori Düzenleme Formu */}
      {showEditForm && editingCategory && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-medium text-gray-200 mb-4">Kategori Düzenle</h3>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Kategori Adı</label>
              <input
                type="text"
                value={editCategory.name}
                onChange={(e) => setEditCategory({...editCategory, name: e.target.value})}
                className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 px-3 py-2 border"
                placeholder="Kategori adı"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Açıklama</label>
              <textarea
                value={editCategory.description}
                onChange={(e) => setEditCategory({...editCategory, description: e.target.value})}
                className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 px-3 py-2 border"
                placeholder="Kategori açıklaması"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowEditForm(false)
                  setEditingCategory(null)
                  setEditCategory({ name: '', description: '' })
                }}
                className="px-4 py-2 text-gray-300 bg-gray-600 rounded-md hover:bg-gray-500 transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Güncelle
              </button>
            </div>
          </form>
        </div>
      )}

      {/* İstatistikler */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-200">Toplam Kategori</h3>
              <p className="text-3xl font-bold text-blue-400">{categories.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-200">Aktif Kategoriler</h3>
              <p className="text-3xl font-bold text-green-400">{categories.filter(c => getCategoryStats(c.name).total > 0).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-200">Boş Kategoriler</h3>
              <p className="text-3xl font-bold text-yellow-400">{categories.filter(c => getCategoryStats(c.name).total === 0).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Kategori Listesi */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const stats = getCategoryStats(category.name)
          return (
            <div key={category.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">{category.name}</h3>
                  {category.description && (
                    <p className="text-gray-400 text-sm mb-3">{category.description}</p>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(category)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id.toString())}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Kategori İstatistikleri */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Toplam Ürün:</span>
                  <span className="text-blue-400 font-semibold">{stats.total}</span>
                </div>
                
                {stats.total > 0 && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Stokta:</span>
                      <span className="text-green-400 font-semibold">{stats.inStock}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Tükenen:</span>
                      <span className="text-red-400 font-semibold">{stats.outOfStock}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Toplam Değer:</span>
                      <span className="text-yellow-400 font-semibold">{stats.totalValue.toLocaleString('tr-TR')} ₺</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min((stats.total / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Ürün yoğunluğu</p>
                    </div>
                    
                    {/* Kategori Detayını Görüntüle Butonu */}
                    <button
                      onClick={() => viewCategoryDetails(category.name)}
                      className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Kategoriyi Görüntüle
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </>
                )}
                
                {stats.total === 0 && (
                  <div className="text-center py-6 text-gray-400 border-2 border-dashed border-gray-600 rounded-lg">
                    <Package className="h-8 w-8 mx-auto mb-3 opacity-50" />
                    <p className="text-sm mb-3">Bu kategoride henüz ürün yok</p>
                    <button
                      onClick={() => router.push('/products/add')}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3 rounded-md transition-colors"
                    >
                      İlk Ürünü Ekle
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-400 mb-4">Henüz kategori eklenmemiş.</div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            İlk Kategoriyi Ekle
          </button>
        </div>
      )}
    </div>
  )
}
