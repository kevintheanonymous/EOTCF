import React, { useState, useEffect } from 'react'
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useLanguage } from '../context/LanguageContext'
import { getTranslation } from '../utils/translations'
import { format } from 'date-fns'
import { model } from '../config/gemini'

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [magicFillText, setMagicFillText] = useState('')
  const [magicFillLoading, setMagicFillLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: 'income',
    category: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    donorName: ''
  })
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    const transactionsRef = collection(db, 'transactions')
    const q = query(transactionsRef, orderBy('date', 'desc'))
    const snapshot = await getDocs(q)
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setTransactions(data)
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleMagicFill = async () => {
    setMagicFillLoading(true)
    const prompt = `Parse this financial transaction text and return ONLY a JSON object with these exact fields: type (income or expense), category, amount (number only), date (YYYY-MM-DD format), description, donorName. Text: "${magicFillText}". Respond with ONLY the JSON, no other text.`
    
    try {
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text().trim()
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        setFormData({
          type: parsed.type || 'expense',
          category: parsed.category || '',
          amount: parsed.amount || '',
          date: parsed.date || format(new Date(), 'yyyy-MM-dd'),
          description: parsed.description || '',
          donorName: parsed.donorName || ''
        })
        setMagicFillText('')
      }
    } catch (error) {
      alert('Failed to parse text. Please fill manually.')
    }
    setMagicFillLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date)
    }

    try {
      if (editingTransaction) {
        await updateDoc(doc(db, 'transactions', editingTransaction.id), transactionData)
      } else {
        await addDoc(collection(db, 'transactions'), transactionData)
      }
      setShowModal(false)
      setEditingTransaction(null)
      setFormData({
        type: 'income',
        category: '',
        amount: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
        donorName: ''
      })
      loadTransactions()
    } catch (error) {
      alert('Error saving transaction')
    }
  }

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
    setFormData({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount?.toString() || '',
      date: format(transaction.date?.toDate() || new Date(), 'yyyy-MM-dd'),
      description: transaction.description || '',
      donorName: transaction.donorName || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm(t('deleteTransaction') + '?')) {
      await deleteDoc(doc(db, 'transactions', id))
      loadTransactions()
    }
  }

  const categories = formData.type === 'income' 
    ? Object.values(t('transactionCategories.income'))
    : Object.values(t('transactionCategories.expense'))

  if (loading) {
    return <div className="text-center py-12">{t('loading')}</div>
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-serif text-deep-gold">{t('transactions')}</h1>
        <button
          onClick={() => {
            setEditingTransaction(null)
            setFormData({
              type: 'income',
              category: '',
              amount: '',
              date: format(new Date(), 'yyyy-MM-dd'),
              description: '',
              donorName: ''
            })
            setShowModal(true)
          }}
          className="px-6 py-2 bg-deep-gold text-white rounded-lg hover:bg-amber-700"
        >
          {t('addTransaction')}
        </button>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('date')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('type')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('category')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('amount')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('description')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="text-deep-gold hover:underline mr-4"
                    >
                      {t('edit')}
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="text-liturgical-red hover:underline"
                    >
                      {t('delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-serif text-deep-gold mb-6">
              {editingTransaction ? t('editTransaction') : t('addTransaction')}
            </h2>

            {/* Magic Fill */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium mb-2">{t('magicFill')}</label>
              <textarea
                value={magicFillText}
                onChange={(e) => setMagicFillText(e.target.value)}
                placeholder={t('magicFillPlaceholder')}
                className="w-full px-4 py-2 border rounded-lg mb-2"
                rows="3"
              />
              <button
                onClick={handleMagicFill}
                disabled={magicFillLoading || !magicFillText}
                className="px-4 py-2 bg-deep-gold text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
              >
                {magicFillLoading ? t('loading') : t('parse')}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('transactionType')}</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="income">{t('income')}</option>
                  <option value="expense">{t('expense')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('category')}</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Select...</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('amount')}</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('date')}</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('description')}</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('donorName')}</label>
                <input
                  type="text"
                  name="donorName"
                  value={formData.donorName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-deep-gold text-white rounded-lg hover:bg-amber-700"
                >
                  {t('save')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingTransaction(null)
                  }}
                  className="flex-1 px-6 py-2 bg-gray-200 text-dark-brown rounded-lg hover:bg-gray-300"
                >
                  {t('cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transactions

