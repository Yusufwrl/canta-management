'use client'

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Plus, Filter, TrendingUp, TrendingDown } from 'lucide-react'

export default function TransactionsPage() {
  const { transactions, addTransaction, monthlyIncome } = useApp()
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    type: 'income' as 'income' | 'expense',
    amount: '',
    description: ''
  })

  const filteredTransactions = transactions.filter(transaction => {
    if (filterType === 'all') return true
    if (filterType === 'income') return transaction.type === 'income' || transaction.type === 'gelir'
    if (filterType === 'expense') return transaction.type === 'expense' || transaction.type === 'gider'
    return false
  })

  const totalIncome = transactions
    .filter(t => t.type === 'income' || t.type === 'gelir')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter(t => t.type === 'expense' || t.type === 'gider')
    .reduce((sum, t) => sum + t.amount, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTransaction.amount || !newTransaction.description) return

    const transaction = {
      id: Date.now().toString(),
      type: newTransaction.type,
      amount: parseFloat(newTransaction.amount),
      description: newTransaction.description,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    addTransaction(transaction)
    setNewTransaction({
      type: 'income',
      amount: '',
      description: ''
    })
    setShowAddForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Gelir-Gider</h1>
          <p className="text-gray-400">Finansal işlemlerinizi yönetin</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Yeni İşlem
        </button>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-200">Toplam Gelir</h3>
              <p className="text-3xl font-bold text-green-400">{totalIncome.toLocaleString('tr-TR')} ₺</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-200">Toplam Gider</h3>
              <p className="text-3xl font-bold text-red-400">{totalExpense.toLocaleString('tr-TR')} ₺</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-200">Net Kar</h3>
              <p className={`text-3xl font-bold ${(totalIncome - totalExpense) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {(totalIncome - totalExpense).toLocaleString('tr-TR')} ₺
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Yeni İşlem Formu */}
      {showAddForm && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-medium text-gray-200 mb-4">Yeni İşlem Ekle</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">İşlem Türü</label>
              <select
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value as 'income' | 'expense'})}
                className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 px-3 py-2 border"
              >
                <option value="income">Gelir</option>
                <option value="expense">Gider</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tutar (₺)</label>
              <input
                type="number"
                step="0.01"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 px-3 py-2 border"
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Açıklama</label>
              <input
                type="text"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 px-3 py-2 border"
                placeholder="İşlem açıklaması"
                required
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

      {/* Filtre */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded text-sm ${filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Tümü
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-3 py-1 rounded text-sm ${filterType === 'income' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Gelir
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1 rounded text-sm ${filterType === 'expense' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Gider
            </button>
          </div>
        </div>
      </div>

      {/* İşlem Listesi */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200">
            İşlem Geçmişi ({filteredTransactions.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Tarih</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Tür</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Açıklama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Tutar</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(transaction.date).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      (transaction.type === 'income' || transaction.type === 'gelir')
                        ? 'bg-green-900 text-green-200' 
                        : 'bg-red-900 text-red-200'
                    }`}>
                      {(transaction.type === 'income' || transaction.type === 'gelir') ? 'Gelir' : 'Gider'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{transaction.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={(transaction.type === 'income' || transaction.type === 'gelir') ? 'text-green-400' : 'text-red-400'}>
                      {(transaction.type === 'income' || transaction.type === 'gelir') ? '+' : '-'}{transaction.amount.toLocaleString('tr-TR')} ₺
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400">Henüz işlem bulunamadı.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
