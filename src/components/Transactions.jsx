import React, { useState, useEffect } from 'react'
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useLanguage } from '../context/LanguageContext'
import { getTranslation } from '../utils/translations'
import { format } from 'date-fns'
import { model } from '../config/gemini'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  
  // --- DATE PICKER STATE ---
  const [selectedDate, setSelectedDate] = useState(new Date())
  // -----------------------

  const [magicFillText, setMagicFillText] = useState('')
  const [magicFillLoading, setMagicFillLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    type: 'income',
    category: '',
    amount: '',
    description: '',
    donorName: ''
  })
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)

  useEffect(() => { loadTransactions() }, [])

  const loadTransactions = async () => {
    const transactionsRef = collection(db, 'transactions')
    const q = query(transactionsRef, orderBy('date', 'desc'))
    const snapshot = await getDocs(q)
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setTransactions(data)
    setLoading(false)
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleMagicFill = async () => {
    setMagicFillLoading(true)
    const prompt = `Parse: "${magicFillText}". Return JSON: { type, category, amount, date (YYYY-MM-DD), description, donorName }`
    try {
      const result = await model.generateContent(prompt)
      const parsed = JSON.parse(result.response.text().match(/\{[\s\S]*\}/)[0])
      setFormData({
        type: parsed.type || 'expense',
        category: parsed.category || '',
        amount: parsed.amount || '',
        description: parsed.description || '',
        donorName: parsed.donorName || ''
      })
      if(parsed.date) setSelectedDate(new Date(parsed.date))
      setMagicFillText('')
    } catch (error) { alert('Failed to parse text.') }
    setMagicFillLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: selectedDate // Save the selected date
    }
    try {
      if (editingTransaction) await updateDoc(doc(db, 'transactions', editingTransaction.id), transactionData)
      else await addDoc(collection(db, 'transactions'), transactionData)
      setShowModal(false); setEditingTransaction(null)
      setFormData({ type: 'income', category: '', amount: '', description: '', donorName: '' })
      loadTransactions()
    } catch (error) { alert('Error saving transaction') }
  }

  const handleEdit = (tx) => {
    setEditingTransaction(tx)
    setFormData({
      type: tx.type, category: tx.category, amount: tx.amount,
      description: tx.description, donorName: tx.donorName
    })
    // Handle date conversion securely
    if (tx.date && tx.date.toDate) {
        setSelectedDate(tx.date.toDate())
    } else {
        setSelectedDate(new Date())
    }
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm(t('deleteTransaction') + '?')) {
      await deleteDoc(doc(db, 'transactions', id)); loadTransactions();
    }
  }

  const categories = formData.type === 'income' ? Object.values(t('transactionCategories.income')) : Object.values(t('transactionCategories.expense'))

  if (loading) return <div className="text-center py-12">{t('loading')}</div>

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-serif text-deep-gold">{t('transactions')}</h1>
        <button onClick={() => { 
            setEditingTransaction(null); 
            setFormData({ type: 'income', category: '', amount: '', description: '', donorName: '' }); 
            setSelectedDate(new Date()); 
            setShowModal(true); 
        }} className="btn-primary flex items-center gap-2">
          <span>+</span> {t('addTransaction')}
        </button>
      </div>

      <div className="card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 text-stone-500 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">{t('date')}</th>
                <th className="px-6 py-4 text-left">{t('type')}</th>
                <th className="px-6 py-4 text-left">{t('category')}</th>
                <th className="px-6 py-4 text-left">{t('amount')}</th>
                <th className="px-6 py-4 text-left">{t('description')}</th>
                <th className="px-6 py-4 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-amber-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-stone-600">{format(tx.date?.toDate() || new Date(), 'MMM d, yyyy')}</td>
                  <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{tx.type}</span></td>
                  <td className="px-6 py-4 text-sm text-stone-900">{tx.category}</td>
                  <td className={`px-6 py-4 text-sm font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>{tx.amount?.toFixed(2)} €</td>
                  <td className="px-6 py-4 text-sm text-stone-500 max-w-xs truncate">{tx.description || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(tx)} className="text-deep-gold hover:text-amber-700 mr-3 font-medium">{t('edit')}</button>
                    <button onClick={() => handleDelete(tx.id)} className="text-red-600 hover:text-red-800 font-medium">{t('delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full transform transition-all scale-100">
            <h2 className="text-2xl font-serif text-deep-gold mb-6 font-bold">{editingTransaction ? t('editTransaction') : t('addTransaction')}</h2>
            
            {!editingTransaction && (
              <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <label className="block text-xs font-bold text-indigo-400 uppercase mb-2">{t('magicFill')}</label>
                <div className="flex gap-2">
                  <input value={magicFillText} onChange={e => setMagicFillText(e.target.value)} placeholder="e.g., Paid 50 euros for candles" className="input-field !py-2 !text-sm" />
                  <button onClick={handleMagicFill} disabled={magicFillLoading || !magicFillText} className="bg-indigo-600 text-white px-4 rounded-xl hover:bg-indigo-700 disabled:opacity-50">
                    <svg className={`w-5 h-5 ${magicFillLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">{t('transactionType')}</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="input-field">
                    <option value="income">{t('income')}</option>
                    <option value="expense">{t('expense')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">{t('amount')}</label>
                  <input type="number" name="amount" value={formData.amount} onChange={handleChange} required step="0.01" className="input-field" placeholder="0.00" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">{t('category')}</label>
                <select name="category" value={formData.category} onChange={handleChange} required className="input-field">
                  <option value="">Select Category...</option>
                  {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
                </select>
              </div>

              {/* THIS IS THE NEW BEAUTIFUL DATE PICKER */}
              <div className="relative z-50"> {/* <--- ADD z-50 HERE */}
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">{t('date')}</label>
                <DatePicker 
                    selected={selectedDate} 
                    onChange={(date) => setSelectedDate(date)} 
                    className="input-field w-full cursor-pointer relative z-10" 
                    dateFormat="MMMM d, yyyy"
                    popperClassName="!z-[100]" // <--- Force popup to be on top
                    portalId="root-portal" // <--- Renders it outside the modal to prevent clipping
                />
                <div className="absolute right-4 top-9 text-deep-gold pointer-events-none z-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">{t('description')}</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="input-field min-h-[80px]" />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">{t('donorName')}</label>
                <input type="text" name="donorName" value={formData.donorName} onChange={handleChange} className="input-field" />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">{t('cancel')}</button>
                <button type="submit" className="btn-primary flex-1">{t('save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transactions
