import React, { useState, useEffect } from 'react'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useLanguage } from '../context/LanguageContext'
import { getTranslation } from '../utils/translations'
import { format } from 'date-fns'
import { model } from '../config/gemini'

const Dashboard = () => {
  const [startDate, setStartDate] = useState(format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [transactions, setTransactions] = useState([])
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [aiInsight, setAiInsight] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)

  useEffect(() => {
    loadData()
  }, [startDate, endDate])

  const loadData = async () => {
    setLoading(true)
    
    // Load transactions
    const transactionsRef = collection(db, 'transactions')
    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)
    
    const q = query(
      transactionsRef,
      where('date', '>=', start),
      where('date', '<=', end),
      orderBy('date', 'desc')
    )
    
    const transactionsSnap = await getDocs(q)
    const transactionsData = transactionsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setTransactions(transactionsData)

    // Load inventory
    const inventoryRef = collection(db, 'inventory')
    const inventorySnap = await getDocs(inventoryRef)
    const inventoryData = inventorySnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setInventory(inventoryData)
    
    setLoading(false)
  }

  const calculateStats = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0)
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0)
    
    const netBalance = income - expenses
    
    const totalStockValue = inventory.reduce((sum, item) => {
      return sum + ((item.price || 0) * (item.quantity || 0))
    }, 0)

    return { income, expenses, netBalance, totalStockValue }
  }

  const getAiInsight = async () => {
    setAiLoading(true)
    const stats = calculateStats()
    
    const prompt = `Provide a 3-sentence executive summary of the financial status. Income: ${stats.income} euros, Expenses: ${stats.expenses} euros, Net Balance: ${stats.netBalance} euros, Total Stock Value: ${stats.totalStockValue} euros. Respond in ${language === 'en' ? 'English' : language === 'fr' ? 'French' : 'Amharic'}.`
    
    try {
      const result = await model.generateContent(prompt)
      const response = await result.response
      setAiInsight(response.text())
    } catch (error) {
      setAiInsight('Unable to generate AI insight at this time.')
    }
    setAiLoading(false)
  }

  const exportToExcel = () => {
    const stats = calculateStats()
    const headers = [t('date'), t('type'), t('category'), t('amount'), t('description'), t('donorName')]
    const rows = transactions.map(t => [
      format(t.date?.toDate() || new Date(), 'yyyy-MM-dd'),
      t.type,
      t.category,
      t.amount,
      t.description || '',
      t.donorName || ''
    ])
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `transactions_${startDate}_${endDate}.csv`
    link.click()
  }

  const exportToPDF = () => {
    window.print()
  }

  useEffect(() => {
    if (transactions.length > 0) {
      getAiInsight()
    }
  }, [transactions, language])

  const stats = calculateStats()

  if (loading) {
    return <div className="text-center py-12">{t('loading')}</div>
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center no-print">
        <h1 className="text-3xl font-serif text-deep-gold">{t('dashboard')}</h1>
        <div className="flex gap-4">
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-emerald-green text-white rounded-lg hover:bg-green-700"
          >
            {t('exportExcel')}
          </button>
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-deep-gold text-white rounded-lg hover:bg-amber-700"
          >
            {t('exportPDF')}
          </button>
        </div>
      </div>

      {/* Date Filter */}
      <div className="mb-6 flex gap-4 no-print">
        <div>
          <label className="block text-sm font-medium mb-2">{t('startDate')}</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('endDate')}</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 mb-2">{t('income')}</p>
          <p className="text-2xl font-bold text-emerald-green">{stats.income.toFixed(2)} €</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 mb-2">{t('expenses')}</p>
          <p className="text-2xl font-bold text-liturgical-red">{stats.expenses.toFixed(2)} €</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 mb-2">{t('netBalance')}</p>
          <p className={`text-2xl font-bold ${stats.netBalance >= 0 ? 'text-emerald-green' : 'text-liturgical-red'}`}>
            {stats.netBalance.toFixed(2)} €
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 mb-2">{t('totalStockValue')}</p>
          <p className="text-2xl font-bold text-deep-gold">{stats.totalStockValue.toFixed(2)} €</p>
        </div>
      </div>

      {/* AI Financial Advisor */}
      <div className="bg-white p-6 rounded-lg shadow mb-6 no-print">
        <h2 className="text-xl font-serif text-deep-gold mb-4">{t('aiFinancialAdvisor')}</h2>
        {aiLoading ? (
          <p>{t('loading')}</p>
        ) : (
          <p className="text-dark-brown">{aiInsight || 'Click to generate insight'}</p>
        )}
        <button
          onClick={getAiInsight}
          className="mt-4 px-4 py-2 bg-deep-gold text-white rounded-lg hover:bg-amber-700"
        >
          Refresh Insight
        </button>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-serif text-deep-gold">{t('ledger')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('date')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('type')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('category')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('amount')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('description')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('donorName')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {t('noTransactions')}
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(transaction.date?.toDate() || new Date(), 'yyyy-MM-dd')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded ${
                        transaction.type === 'income' ? 'bg-emerald-green/20 text-emerald-green' : 'bg-liturgical-red/20 text-liturgical-red'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{transaction.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">
                      {transaction.amount?.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4">{transaction.description || '-'}</td>
                    <td className="px-6 py-4">{transaction.donorName || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

