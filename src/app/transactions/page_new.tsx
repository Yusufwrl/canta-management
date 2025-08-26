'use client'

import { useState, useEffect } from 'react'
import { Plus, TrendingUp, TrendingDown, Calendar } from 'lucide-react'

interface Transaction {
  id: string
  type: 'gelir' | 'gider'
  amount: number
  description: string
  category?: string
  date: Date
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [filter, setFilter] = useState<'all' | 'gelir' | 'gider'>('all')
  const [newTransaction, setNewTransaction] = useState({
    type: 'gelir' as 'gelir' | 'gider',
    amount: '',
    description: '',
    category: ''
  })

  // Demo veriler
  useEffect(() => {
    setTransactions([
      {
        id: '1',
        type: 'gelir',
        amount: 650,
        description: 'Sirt cantasi satisi - #001',
        category: 'Satis',
        date: new Date('2024-12-20')
      },
      {
        id: '2',
        type: 'gider',
        amount: 15000,
        description: 'Magaza kirasi - Aralik',
        category: 'Kira',
        date: new Date('2024-12-15')
      },
      {
        id: '3',
        type: 'gelir',
        amount: 550,
        description: 'Okul cantasi satisi - #002',
        category: 'Satis',
        date: new Date('2024-12-18')
      },
      {
        id: '4',
        type: 'gider',
        amount: 2500,
        description: 'Elektrik faturasi',
        category: 'Fatura',
        date: new Date('2024-12-10')
      }
    ])
  }, [])

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true
    return transaction.type === filter
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: newTransaction.type,
      amount: parseFloat(newTransaction.amount),
      description: newTransaction.description,
      category: newTransaction.category,
      date: new Date()
    }
    
    setTransactions(prev => [transaction, ...prev])
    setNewTransaction({
      type: 'gelir',
      amount: '',
      description: '',
      category: ''
    })
    setShowAddForm(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Bu islemi silmek istediginizden emin misiniz?')) {
      setTransactions(prev => prev.filter(t => t.id !== id))
    }
  }

  const totalGelir = transactions
    .filter(t => t.type === 'gelir')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalGider = transactions
    .filter(t => t.type === 'gider')
    .reduce((sum, t) => sum + t.amount, 0)

  const netGelir = totalGelir - totalGider

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gelir-Gider Takibi</h1>
          <p className="text-gray-600">Mali islemlerinizi yonetin</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Yeni Islem
        </button>
      </div>

      {/* Ozet Kartlari */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold">Toplam Gelir</h3>
              <p className="text-2xl font-bold text-green-600">
                {totalGelir.toLocaleString()} TL
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <TrendingDown className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold">Toplam Gider</h3>
              <p className="text-2xl font-bold text-red-600">
                {totalGider.toLocaleString()} TL
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold">Net Gelir</h3>
              <p className={`text-2xl font-bold ${netGelir >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {netGelir.toLocaleString()} TL
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Yeni Islem Formu */}
      {showAddForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Yeni Islem Ekle</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Islem Tipi *
                </label>
                <select
                  required
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction(prev => ({ 
                    ...prev, 
                    type: e.target.value as 'gelir' | 'gider' 
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                >
                  <option value="gelir">Gelir</option>
                  <option value="gider">Gider</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tutar (TL) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Aciklama *
              </label>
              <input
                type="text"
                required
                value={newTransaction.description}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                placeholder="Islem aciklamasi..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kategori
              </label>
              <input
                type="text"
                value={newTransaction.category}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, category: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                placeholder="Kategori (opsiyonel)"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Iptal
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtreler */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'all' 
                ? 'bg-blue-100 text-blue-800' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tumu ({transactions.length})
          </button>
          <button
            onClick={() => setFilter('gelir')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'gelir' 
                ? 'bg-green-100 text-green-800' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Gelir ({transactions.filter(t => t.type === 'gelir').length})
          </button>
          <button
            onClick={() => setFilter('gider')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'gider' 
                ? 'bg-red-100 text-red-800' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Gider ({transactions.filter(t => t.type === 'gider').length})
          </button>
        </div>
      </div>

      {/* Islemler Listesi */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Islemler ({filteredTransactions.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tip
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aciklama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Islemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.date.toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === 'gelir' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'gelir' ? 'Gelir' : 'Gider'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.category || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <span className={transaction.type === 'gelir' ? 'text-green-600' : 'text-red-600'}>
                      {transaction.type === 'gelir' ? '+' : '-'}{transaction.amount.toLocaleString()} TL
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Hic islem bulunamadi</p>
          </div>
        )}
      </div>
    </div>
  )
}
