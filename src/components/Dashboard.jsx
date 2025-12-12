import React, { useState, useEffect } from 'react'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useLanguage } from '../context/LanguageContext'
import { getTranslation } from '../utils/translations'
import { format } from 'date-fns'
import { model } from '../config/gemini'

const StatCard = ({ title, value, color, icon }) => (
  <div className="card hover:-translate-y-1 transition-transform duration-300">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-stone-500 mb-1">{title}</p>
        <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
        {icon}
      </div>
    </div>
  </div>
)

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

  useEffect(() => { loadData() }, [startDate, endDate])

  const loadData = async () => {
    setLoading(true)
    try {
      const start = new Date(startDate); const end = new Date(endDate); end.setHours(23, 59, 59, 999);
      const q = query(collection(db, 'transactions'), where('date', '>=', start), where('date', '<=', end), orderBy('date', 'desc'));
      const [txSnap, invSnap] = await Promise.all([getDocs(q), getDocs(collection(db, 'inventory'))]);
      setTransactions(txSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setInventory(invSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) { console.error(error) } finally { setLoading(false) }
  }

  const stats = (() => {
    const inc = transactions.filter(t => t.type === 'income').reduce((s, t) => s + (t.amount || 0), 0);
    const exp = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + (t.amount || 0), 0);
    const stock = inventory.reduce((s, i) => s + ((i.price || 0) * (i.quantity || 0)), 0);
    return { income: inc, expenses: exp, net: inc - exp, stock };
  })();

  const getAiInsight = async () => {
    setAiLoading(true)
    const prompt = `Executive summary. Income: ${stats.income}, Expenses: ${stats.expenses}, Net: ${stats.net}, Stock: ${stats.stock}. Respond in ${language === 'en' ? 'English' : language === 'fr' ? 'French' : 'Amharic'}. Keep it encouraging.`
    try {
      const res = await model.generateContent(prompt); setAiInsight(res.response.text());
    } catch (e) { setAiInsight('AI Unavailable') } finally { setAiLoading(false) }
  }

  if (loading) return <div className="flex h-screen items-center justify-center text-deep-gold animate-pulse">Loading...</div>

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 no-print">
        <div>
          <h1 className="text-4xl font-serif font-bold text-dark-brown mb-2">{t('dashboard')}</h1>
          <p className="text-stone-500">Financial overview for {format(new Date(startDate), 'MMM d')} - {format(new Date(endDate), 'MMM d, yyyy')}</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary" onClick={() => window.print()}>
            <span className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>Print</span>
          </button>
        </div>
      </div>

      {/* Date Filter */}
      <div className="card flex flex-wrap gap-4 items-end no-print">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">{t('startDate')}</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input-field" />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">{t('endDate')}</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="input-field" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={t('income')} value={`${stats.income.toFixed(2)} €`} color="text-emerald-600" 
          icon={<svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>} />
        <StatCard title={t('expenses')} value={`${stats.expenses.toFixed(2)} €`} color="text-red-600" 
          icon={<svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>} />
        <StatCard title={t('netBalance')} value={`${stats.net.toFixed(2)} €`} color={stats.net >= 0 ? "text-emerald-600" : "text-red-600"} 
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard title={t('totalStockValue')} value={`${stats.stock.toFixed(2)} €`} color="text-amber-600" 
          icon={<svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>} />
      </div>

      {/* AI Section */}
      <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 border border-amber-100 shadow-soft relative overflow-hidden no-print">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <h2 className="text-xl font-serif font-bold text-deep-gold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          {t('aiFinancialAdvisor')}
        </h2>
        <p className="text-stone-600 leading-relaxed max-w-4xl">{aiLoading ? t('loading') : (aiInsight || "Click generate to get insights")}</p>
        <button onClick={getAiInsight} disabled={aiLoading} className="mt-6 btn-primary text-sm px-4 py-2">
          {aiLoading ? 'Thinking...' : 'Generate Insight'}
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden !p-0">
        <div className="p-6 border-b border-stone-100 bg-stone-50/50">
          <h2 className="text-lg font-serif font-bold text-dark-brown">{t('ledger')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 text-stone-500 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">{t('date')}</th>
                <th className="px-6 py-4 text-left">{t('type')}</th>
                <th className="px-6 py-4 text-left">{t('category')}</th>
                <th className="px-6 py-4 text-left">{t('amount')}</th>
                <th className="px-6 py-4 text-left">{t('description')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-amber-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">{format(t.date?.toDate() || new Date(), 'MMM d, yyyy')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${t.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900 font-medium">{t.category}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>{t.amount?.toFixed(2)} €</td>
                  <td className="px-6 py-4 text-sm text-stone-500 max-w-xs truncate">{t.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
