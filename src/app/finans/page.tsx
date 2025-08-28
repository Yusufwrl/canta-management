'use client'

import { useState, useEffect } from 'react'

interface DailyStats {
  date: string
  income: number
  expense: number
  profit: number
}

export default function FinansPage() {
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([])
  const [loading, setLoading] = useState(true)
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)

  useEffect(() => {
    fetchDailyStats()
  }, [])

  const fetchDailyStats = async () => {
    try {
      const response = await fetch('/api/transactions')
      const transactions = await response.json()

      // Günlük istatistikleri grupla
      const statsMap = new Map<string, DailyStats>()
      let totalInc = 0
      let totalExp = 0

      transactions.forEach((transaction: any) => {
        const date = new Date(transaction.date).toLocaleDateString('tr-TR')
        const amount = transaction.amount

        if (!statsMap.has(date)) {
          statsMap.set(date, {
            date,
            income: 0,
            expense: 0,
            profit: 0
          })
        }

        const dayStats = statsMap.get(date)!
        
        if (transaction.type === 'income') {
          dayStats.income += amount
          totalInc += amount
        } else {
          dayStats.expense += amount
          totalExp += amount
        }
        
        dayStats.profit = dayStats.income - dayStats.expense
      })

      // Son 30 gün için sırala
      const sortedStats = Array.from(statsMap.values())
        .sort((a, b) => new Date(b.date.split('.').reverse().join('-')).getTime() - 
                       new Date(a.date.split('.').reverse().join('-')).getTime())
        .slice(0, 30)

      setDailyStats(sortedStats)
      setTotalIncome(totalInc)
      setTotalExpense(totalExp)
      setTotalProfit(totalInc - totalExp)
      setLoading(false)
    } catch (error) {
      console.error('Finans verileri yüklenirken hata:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-300">Yükleniyor...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Başlık */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
            📊 Finans Özeti
          </h1>
          <p className="text-gray-400">Günlük gelir-gider analizi ve kar takibi</p>
        </div>

        {/* Genel Özet Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Toplam Gelir</p>
                <p className="text-2xl font-bold">{totalIncome.toLocaleString('tr-TR')} ₺</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>

          <div className="bg-red-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Toplam Gider</p>
                <p className="text-2xl font-bold">{totalExpense.toLocaleString('tr-TR')} ₺</p>
              </div>
              <div className="text-3xl">💸</div>
            </div>
          </div>

          <div className={`${totalProfit >= 0 ? 'bg-blue-600' : 'bg-orange-600'} rounded-lg p-4 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Net Kar</p>
                <p className="text-2xl font-bold">{totalProfit.toLocaleString('tr-TR')} ₺</p>
              </div>
              <div className="text-3xl">{totalProfit >= 0 ? '📈' : '📉'}</div>
            </div>
          </div>
        </div>

        {/* Günlük Detaylar */}
        <div className="bg-gray-800 rounded-lg shadow">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Günlük Finans Detayları (Son 30 Gün)</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Gelir
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Gider
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Kar/Zarar
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Durum
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {dailyStats.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      Henüz işlem kaydı bulunmuyor
                    </td>
                  </tr>
                ) : (
                  dailyStats.map((stat, index) => (
                    <tr key={index} className="hover:bg-gray-700">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-white">
                        {stat.date}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-green-400">
                        +{stat.income.toLocaleString('tr-TR')} ₺
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-red-400">
                        -{stat.expense.toLocaleString('tr-TR')} ₺
                      </td>
                      <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${
                        stat.profit >= 0 ? 'text-blue-400' : 'text-orange-400'
                      }`}>
                        {stat.profit >= 0 ? '+' : ''}{stat.profit.toLocaleString('tr-TR')} ₺
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {stat.profit >= 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            📈 Kar
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            📉 Zarar
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alt bilgi */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          Son güncelleme: {new Date().toLocaleString('tr-TR')}
        </div>
      </div>
    </div>
  )
}
