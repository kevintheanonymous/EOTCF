import React, { useState, useEffect } from 'react'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useLanguage } from '../context/LanguageContext'
import { getTranslation } from '../utils/translations'
import { format } from 'date-fns'
import { model } from '../config/gemini'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

const StatCard = ({ title, value, colorClass, icon }) => (
  <div className="card group hover:-translate-y-1 transition-all duration-300 border-0 shadow-lg hover:shadow-xl relative overflow-hidden">
    <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
        {icon}
    </div>
    <div className="relative z-10">
      <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">{title}</p>
      <h3 className={`text-3xl font-serif font-bold ${colorClass.replace('bg-', 'text-')}`}>
        {value}
      </h3>
    </div>
  </div>
)

const Dashboard = () => {
  // Use Date objects for the picker
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1))
  const [endDate, setEndDate] = useState(new Date())
  
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
    
    // Set time to start of day and end of day correctly
    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)
    
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)
    
    const q = query(
      collection(db, 'transactions'),
      where('date', '>=', start),
      where('date', '<=', end),
      orderBy('date', 'desc')
    )
    
    const inventoryRef = collection(db, 'inventory')

    try {
      const [transactionsSnap, inventorySnap] = await Promise.all([
        getDocs(q),
        getDocs(inventoryRef)
      ])

      setTransactions(transactionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setInventory(inventorySnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const stats = (() => {
    const inc = transactions.filter(t => t.type === 'income').reduce((s, t) => s + (t.amount || 0), 0);
    const exp = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + (t.amount || 0), 0);
    const stock = inventory.reduce((s, i) => s + ((i.price || 0) * (i.quantity || 0)), 0);
    return { income: inc, expenses: exp, net: inc - exp, stock };
  })();

  const getAiInsight = async () => {
    setAiLoading(true)
    const prompt = `Provide a 3-sentence executive summary of the financial status. Income: ${stats.income} euros, Expenses: ${stats.expenses} euros, Net Balance: ${stats.net} euros, Total Stock Value: ${stats.stock} euros. Respond in ${language === 'en' ? 'English' : language === 'fr' ? 'French' : 'Amharic'}.`
    
    try {
      const result = await model.generateContent(prompt)
      setAiInsight(result.response.text())
    } catch (error) {
      setAiInsight('Unable to generate AI insight at this time.')
    }
    setAiLoading(false)
  }

  const exportToExcel = () => {
    const headers = [t('date'), t('type'), t('category'), t('amount'), t('description'), t('donorName')]
    const rows = transactions.map(t => [
      format(t.date?.toDate() || new Date(), 'yyyy-MM-dd'),
      t.type,
      t.category,
      t.amount,
      t.description || '',
      t.donorName || ''
    ])
    
    const csv = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `transactions_${format(startDate, 'yyyy-MM-dd')}_${format(endDate, 'yyyy-MM-dd')}.csv`
    link.click()
  }

  if (loading) return <div className="flex h-screen items-center justify-center text-deep-gold animate-pulse">Loading...</div>

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 no-print">
        <div>
          <h1 className="text-4xl font-serif font-bold text-dark-brown mb-1">{t('dashboard')}</h1>
          <p className="text-stone-500">Overview for {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportToExcel} className="btn-secondary text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            {t('exportExcel')}
          </button>
          <button onClick={() => window.print()} className="btn-primary text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            {t('exportPDF')}
          </button>
        </div>
      </div>

      {/* Date Filter Card - FULLY FIXED */}
      <div className="card flex flex-wrap gap-6 items-end no-print bg-white/80 backdrop-blur z-20 relative overflow-visible">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">{t('startDate')}</label>
          <div className="relative z-30">
            <DatePicker 
                selected={startDate} 
                onChange={(date) => setStartDate(date)} 
                className="input-field w-full cursor-pointer relative z-10 !pr-12" /* Added right padding for text */
                dateFormat="MMM d, yyyy"
                popperClassName="!z-[100]" 
            />
            {/* Perfectly centered icon, sitting on top of input */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-deep-gold pointer-events-none z-20">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">{t('endDate')}</label>
          <div className="relative z-30">
            <DatePicker 
                selected={endDate} 
                onChange={(date) => setEndDate(date)} 
                className="input-field w-full cursor-pointer relative z-10 !pr-12" /* Added right padding for text */
                dateFormat="MMM d, yyyy"
                popperClassName="!z-[100]" 
                popperPlacement="bottom-end" /* Aligns popup to the right edge */
            />
            {/* Perfectly centered icon, sitting on top of input */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-deep-gold pointer-events-none z-20">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <StatCard title={t('income')} value={`${stats.income.toFixed(2)} €`} colorClass="text-emerald-600 bg-emerald-600" 
          icon={<svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>} />
        <StatCard title={t('expenses')} value={`${stats.expenses.toFixed(2)} €`} colorClass="text-red-600 bg-red-600" 
          icon={<svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>} />
        <StatCard title={t('netBalance')} value={`${stats.net.toFixed(2)} €`} colorClass={stats.net >= 0 ? "text-emerald-600 bg-emerald-600" : "text-red-600 bg-red-600"} 
          icon={<svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard title={t('totalStockValue')} value={`${stats.stock.toFixed(2)} €`} colorClass="text-amber-600 bg-amber-600" 
          icon={<svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>} />
      </div>

      {/* AI Section */}
      <div className="bg-gradient-to-br from-amber-50 via-white to-white rounded-2xl p-8 border border-amber-100 shadow-soft relative overflow-hidden no-print group z-10">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold-gradient opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-500"></div>
        <h2 className="text-xl font-serif font-bold text-deep-gold mb-4 flex items-center gap-2 relative z-10">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          {t('aiFinancialAdvisor')}
        </h2>
        <p className="text-stone-600 leading-relaxed max-w-4xl relative z-10">
          {aiLoading ? t('loading') : (aiInsight || "Click the button below to generate an AI analysis of your current financial standing.")}
        </p>
        <button onClick={getAiInsight} disabled={aiLoading} className="mt-6 btn-primary text-sm px-6 py-2 relative z-10">
          {aiLoading ? 'Analyzing...' : 'Generate Insight'}
        </button>
      </div>

      {/* Ledger Table */}
      <div className="card overflow-hidden !p-0 border border-stone-100 shadow-soft z-10">
        <div className="p-6 border-b border-stone-50 bg-stone-50/30">
          <h2 className="text-lg font-serif font-bold text-dark-brown">{t('ledger')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 text-stone-500 font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">{t('date')}</th>
                <th className="px-6 py-4 text-left">{t('type')}</th>
                <th className="px-6 py-4 text-left">{t('category')}</th>
                <th className="px-6 py-4 text-left">{t('amount')}</th>
                <th className="px-6 py-4 text-left">{t('description')}</th>
                <th className="px-6 py-4 text-left">{t('donorName')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-stone-400 italic">{t('noTransactions')}</td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-amber-50/30 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">{format(t.date?.toDate() || new Date(), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${t.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-800 font-medium">{t.category}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {t.amount?.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-500 max-w-xs truncate">{t.description || '-'}</td>
                    <td className="px-6 py-4 text-sm text-stone-500">{t.donorName || '-'}</td>
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
