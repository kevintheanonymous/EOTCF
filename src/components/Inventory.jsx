import React, { useState, useEffect } from 'react'
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext' // <--- 1. Import Auth
import { getTranslation } from '../utils/translations'

const Inventory = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price: '',
    quantity: '',
    imageUrl: '',
    description: ''
  })
  
  const { language } = useLanguage()
  const { userRole } = useAuth() // <--- 2. Get User Role
  const t = (key) => getTranslation(language, key)

  // Define who can edit (Admin & Treasurer only)
  const canEdit = ['admin', 'treasurer'].includes(userRole)

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    const itemsRef = collection(db, 'inventory')
    const q = query(itemsRef, orderBy('name'))
    const snapshot = await getDocs(q)
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setItems(data)
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const itemData = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity)
    }

    try {
      if (editingItem) {
        await updateDoc(doc(db, 'inventory', editingItem.id), itemData)
      } else {
        await addDoc(collection(db, 'inventory'), itemData)
      }
      setShowModal(false)
      setEditingItem(null)
      setFormData({
        name: '',
        type: '',
        price: '',
        quantity: '',
        imageUrl: '',
        description: ''
      })
      loadItems()
    } catch (error) {
      alert('Error saving item')
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name || '',
      type: item.type || '',
      price: item.price?.toString() || '',
      quantity: item.quantity?.toString() || '',
      imageUrl: item.imageUrl || '',
      description: item.description || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this item?')) {
      await deleteDoc(doc(db, 'inventory', id))
      loadItems()
    }
  }

  const updateQuantity = async (id, change) => {
    const item = items.find(i => i.id === id)
    if (!item) return
    
    const newQuantity = Math.max(0, (item.quantity || 0) + change)
    await updateDoc(doc(db, 'inventory', id), { quantity: newQuantity })
    loadItems()
  }

  const itemTypes = Object.values(t('itemTypes'))

  if (loading) {
    return <div className="text-center py-12">{t('loading')}</div>
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-serif text-deep-gold">{t('inventory')}</h1>
        
        {/* Only show Add button if user has permission */}
        {canEdit && (
          <button
            onClick={() => {
              setEditingItem(null)
              setFormData({
                name: '',
                type: '',
                price: '',
                quantity: '',
                imageUrl: '',
                description: ''
              })
              setShowModal(true)
            }}
            className="px-6 py-2 bg-deep-gold text-white rounded-lg hover:bg-amber-700"
          >
            {t('addItem')}
          </button>
        )}
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            {t('noItems')}
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-dark-brown">{item.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    (item.quantity || 0) > 0 
                      ? 'bg-emerald-green/20 text-emerald-green' 
                      : 'bg-liturgical-red/20 text-liturgical-red'
                  }`}>
                    {(item.quantity || 0) > 0 ? t('inStock') : t('outOfStock')}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{item.type}</p>
                <p className="text-lg font-bold text-deep-gold mb-4">
                  {item.price?.toFixed(2)} €
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">{t('quantity')}: {item.quantity || 0}</span>
                  
                  {/* Only show Quantity controls if user has permission */}
                  {canEdit && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 bg-liturgical-red text-white rounded hover:bg-red-700"
                      >
                        -
                      </button>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 bg-emerald-green text-white rounded hover:bg-green-700"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                )}
                
                {/* Only show Edit/Delete buttons if user has permission */}
                {canEdit && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 px-4 py-2 bg-deep-gold text-white rounded-lg hover:bg-amber-700"
                    >
                      {t('edit')}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 px-4 py-2 bg-liturgical-red text-white rounded-lg hover:bg-red-700"
                    >
                      {t('delete')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-serif text-deep-gold mb-6">
              {editingItem ? t('editItem') : t('addItem')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('itemName')}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('itemType')}</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Select...</option>
                  {itemTypes.map((type, idx) => (
                    <option key={idx} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('price')}</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('quantity')}</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('imageUrl')}</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
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
                    setEditingItem(null)
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

export default Inventory
