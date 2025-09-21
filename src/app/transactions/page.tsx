'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Filter, TrendingUp, TrendingDown } from 'lucide-react'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  date: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    type: 'income' as 'income' | 'expense',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0] // Bugünün tarihi YYYY-MM-DD formatında
  })

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions')
      const data = await response.json()
      setTransactions(data)
      setLoading(false)
    } catch (error) {
      console.error('İşlemler yüklenirken hata:', error)
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    if (filterType === 'all') return true
    return transaction.type === filterType
  })

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.amount || !formData.description) return

    try {
      const transactionData = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description,
        date: new Date(formData.date + 'T12:00:00.000Z').toISOString() // Seçilen tarihi kullan, öğlen saati ile
      }

      if (editingTransaction) {
        // Güncelleme
        const response = await fetch(`/api/transactions/${editingTransaction.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transactionData)
        })
        
        if (response.ok) {
          fetchTransactions()
          setEditingTransaction(null)
        }
      } else {
        // Yeni ekleme
        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transactionData)
        })
        
        if (response.ok) {
          fetchTransactions()
          setShowAddForm(false)
        }
      }

      setFormData({ 
        type: 'income', 
        amount: '', 
        description: '', 
        date: new Date().toISOString().split('T')[0] 
      })
    } catch (error) {
      console.error('İşlem kaydedilirken hata:', error)
    }
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      description: transaction.description,
      date: new Date(transaction.date).toISOString().split('T')[0]
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu işlemi silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchTransactions()
      }
    } catch (error) {
      console.error('İşlem silinirken hata:', error)
    }
  }

  const resetForm = () => {
    setFormData({ 
      type: 'income', 
      amount: '', 
      description: '', 
      date: new Date().toISOString().split('T')[0] 
    })
    setEditingTransaction(null)
    setShowAddForm(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-300">Yükleniyor...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Başlık */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">💳 Gelir-Gider</h1>
            <p className="text-gray-400">Finansal işlemlerinizi yönetin</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Yeni İşlem</span>
            <span className="sm:hidden">Ekle</span>
          </button>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-gray-800 p-4 lg:p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm lg:text-lg font-semibold text-gray-200">Toplam Gelir</h3>
                <p className="text-xl lg:text-3xl font-bold text-green-400">
                  {totalIncome.toLocaleString('tr-TR')} ₺
                </p>
              </div>
              <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 lg:p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm lg:text-lg font-semibold text-gray-200">Toplam Gider</h3>
                <p className="text-xl lg:text-3xl font-bold text-red-400">
                  {totalExpense.toLocaleString('tr-TR')} ₺
                </p>
              </div>
              <TrendingDown className="h-6 w-6 lg:h-8 lg:w-8 text-red-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 lg:p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm lg:text-lg font-semibold text-gray-200">Net Kar</h3>
                <p className={`text-xl lg:text-3xl font-bold ${(totalIncome - totalExpense) >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                  {(totalIncome - totalExpense).toLocaleString('tr-TR')} ₺
                </p>
              </div>
              <div className="text-2xl lg:text-3xl">
                {(totalIncome - totalExpense) >= 0 ? '📈' : '📉'}
              </div>
            </div>
          </div>
        </div>

        {/* İşlem Ekleme/Düzenleme Formu */}
        {showAddForm && (
          <div className="bg-gray-800 rounded-lg p-4 lg:p-6 border border-gray-700">
            <h3 className="text-lg font-medium text-gray-200 mb-4">
              {editingTransaction ? 'İşlem Düzenle' : 'Yeni İşlem Ekle'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">İşlem Türü</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as 'income' | 'expense'})}
                    className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 px-3 py-2 border focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="income">💰 Gelir</option>
                    <option value="expense">💸 Gider</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tutar (₺)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 px-3 py-2 border focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Açıklama</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 px-3 py-2 border focus:ring-2 focus:ring-blue-500"
                  placeholder="İşlem açıklaması"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tarih</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const currentDate = new Date(formData.date)
                      currentDate.setDate(currentDate.getDate() - 1)
                      setFormData({...formData, date: currentDate.toISOString().split('T')[0]})
                    }}
                    className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
                    title="Bir gün geri"
                  >
                    ⬅️
                  </button>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="flex-1 rounded-md bg-gray-700 border-gray-600 text-gray-100 px-3 py-2 border focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const currentDate = new Date(formData.date)
                      currentDate.setDate(currentDate.getDate() + 1)
                      setFormData({...formData, date: currentDate.toISOString().split('T')[0]})
                    }}
                    className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
                    title="Bir gün ileri"
                  >
                    ➡️
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-300 bg-gray-600 rounded-md hover:bg-gray-500 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingTransaction ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filtre */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex space-x-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Tümü
              </button>
              <button
                onClick={() => setFilterType('income')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  filterType === 'income' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Gelir
              </button>
              <button
                onClick={() => setFilterType('expense')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  filterType === 'expense' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Gider
              </button>
            </div>
          </div>
        </div>

        {/* İşlem Listesi */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="px-4 lg:px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-gray-200">
              İşlem Geçmişi ({filteredTransactions.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Tarih</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Tür</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Açıklama</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Tutar</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(transaction.date).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.type === 'income'
                          ? 'bg-green-900 text-green-200' 
                          : 'bg-red-900 text-red-200'
                      }`}>
                        {transaction.type === 'income' ? '💰 Gelir' : '💸 Gider'}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                      {transaction.description}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}>
                        {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString('tr-TR')} ₺
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          title="Düzenle"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
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
            
            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400">Henüz işlem bulunamadı.</div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  İlk işleminizi ekleyin
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
