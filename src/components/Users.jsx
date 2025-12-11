import React, { useState, useEffect } from 'react'
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useLanguage } from '../context/LanguageContext'
import { getTranslation } from '../utils/translations'

const Users = () => {
  const [pendingUsers, setPendingUsers] = useState([])
  const [activeUsers, setActiveUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    // Load pending users
    const pendingQuery = query(collection(db, 'users'), where('role', '==', 'pending'))
    const pendingSnap = await getDocs(pendingQuery)
    const pendingData = pendingSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setPendingUsers(pendingData)

    // Load active users
    const activeQuery = query(collection(db, 'users'), where('role', '!=', 'pending'))
    const activeSnap = await getDocs(activeQuery)
    const activeData = activeSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setActiveUsers(activeData)
    
    setLoading(false)
  }

  const handleApprove = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: 'member' })
      loadUsers()
    } catch (error) {
      alert('Error approving user')
    }
  }

  const handleDeny = async (userId) => {
    if (window.confirm('Deny this user access?')) {
      try {
        await deleteDoc(doc(db, 'users', userId))
        loadUsers()
      } catch (error) {
        alert('Error denying user')
      }
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole })
      loadUsers()
    } catch (error) {
      alert('Error updating role')
    }
  }

  if (loading) {
    return <div className="text-center py-12">{t('loading')}</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-serif text-deep-gold mb-6">{t('users')}</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-2 font-medium ${
            activeTab === 'pending'
              ? 'border-b-2 border-deep-gold text-deep-gold'
              : 'text-gray-600'
          }`}
        >
          {t('accessRequests')} ({pendingUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-6 py-2 font-medium ${
            activeTab === 'active'
              ? 'border-b-2 border-deep-gold text-deep-gold'
              : 'text-gray-600'
          }`}
        >
          {t('activeUsers')} ({activeUsers.length})
        </button>
      </div>

      {/* Pending Users Tab */}
      {activeTab === 'pending' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('firstName')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('lastName')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('email')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('phoneNumber')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      {t('noPendingUsers')}
                    </td>
                  </tr>
                ) : (
                  pendingUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{user.firstName || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.lastName || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.phoneNumber || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleApprove(user.id)}
                          className="px-4 py-2 bg-emerald-green text-white rounded-lg hover:bg-green-700 mr-2"
                        >
                          {t('approve')}
                        </button>
                        <button
                          onClick={() => handleDeny(user.id)}
                          className="px-4 py-2 bg-liturgical-red text-white rounded-lg hover:bg-red-700"
                        >
                          {t('deny')}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Active Users Tab */}
      {activeTab === 'active' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('firstName')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('lastName')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('email')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('role')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('changeRole')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activeUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      {t('noActiveUsers')}
                    </td>
                  </tr>
                ) : (
                  activeUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{user.firstName || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.lastName || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded bg-deep-gold/20 text-deep-gold">
                          {t(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="px-3 py-1 border rounded-lg"
                        >
                          <option value="member">{t('member')}</option>
                          <option value="treasurer">{t('treasurer')}</option>
                          <option value="admin">{t('admin')}</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users

