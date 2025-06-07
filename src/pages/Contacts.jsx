import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { contactService } from '../services'

const Contacts = () => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    tags: []
  })

  const loadContacts = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await contactService.getAll()
      setContacts(result)
    } catch (err) {
      setError(err.message || 'Failed to load contacts')
      toast.error('Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [])

  const handleAddContact = async (e) => {
    e.preventDefault()
    
    try {
      const contact = await contactService.create(newContact)
      setContacts([...contacts, contact])
      setNewContact({ name: '', email: '', phone: '', company: '', position: '', tags: [] })
      setShowAddModal(false)
      toast.success('Contact added successfully!')
    } catch (err) {
      toast.error('Failed to add contact')
    }
  }

  const handleDeleteContact = async (id) => {
    try {
      await contactService.delete(id)
      setContacts(contacts.filter(c => c.id !== id))
      toast.success('Contact deleted successfully!')
    } catch (err) {
      toast.error('Failed to delete contact')
    }
  }

const filteredContacts = contacts.filter(contact =>
    (contact?.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact?.company ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact?.email ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
        </div>

        {/* Search skeleton */}
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
{/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`skeleton-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card"
            >
              <div className="animate-pulse space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
</motion.div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Failed to load contacts
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadContacts}
            className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg font-medium"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    )
}

// ContactCard component moved outside for better performance
const ContactCard = ({ contact, index, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card hover:shadow-soft transition-all duration-200 group"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
          <span className="text-white font-medium text-lg">
            {(contact?.name ?? 'Unknown').split(' ').map(n => n?.[0] ?? '').join('').slice(0, 2)}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {contact?.name ?? 'Unknown Contact'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {contact?.position ?? 'No position'} at {contact?.company ?? 'No company'}
          </p>
        </div>
      </div>
      
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(contact.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <ApperIcon name="Trash2" size={16} />
        </motion.button>
      </div>
    </div>

    <div className="space-y-2 mb-4">
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <ApperIcon name="Mail" size={14} />
        <span className="truncate">{contact?.email ?? 'No email'}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <ApperIcon name="Phone" size={14} />
        <span>{contact?.phone ?? 'No phone'}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <ApperIcon name="Clock" size={14} />
        <span>Last contact: {contact?.lastContact ? new Date(contact.lastContact).toLocaleDateString() : 'Never'}</span>
      </div>
    </div>

    {contact?.tags && Array.isArray(contact.tags) && contact.tags.length > 0 && (
      <div className="flex flex-wrap gap-1 mb-4">
        {contact.tags.map((tag, i) => (
          <span
            key={`tag-${i}-${tag}`}
            className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
          >
            {tag ?? ''}
          </span>
        ))}
      </div>
    )}

    <div className="flex gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <ApperIcon name="Phone" size={14} className="inline mr-1" />
        Call
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex-1 bg-gradient-to-r from-primary to-secondary text-white px-3 py-2 rounded-lg text-sm font-medium"
      >
        <ApperIcon name="Mail" size={14} className="inline mr-1" />
        Email
      </motion.button>
    </div>
  </motion.div>
)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
            Contacts ({filteredContacts.length})
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your customer relationships and contact information.
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
          >
            <ApperIcon name="Plus" size={16} className="inline mr-2" />
            Add Contact
          </motion.button>
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-gray-600 text-primary shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <ApperIcon name="Grid3x3" size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white dark:bg-gray-600 text-primary shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <ApperIcon name="List" size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <ApperIcon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
        <input
          type="text"
          placeholder="Search contacts by name, company, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
        />
      </motion.div>

      {/* Content */}
      {filteredContacts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Users" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm ? 'No contacts found' : 'No contacts yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : 'Get started by adding your first contact'
            }
          </p>
          {!searchTerm && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg font-medium"
            >
              Add First Contact
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
{filteredContacts.map((contact, index) => (
            <ContactCard 
              key={contact.id} 
              contact={contact} 
              index={index} 
              onDelete={handleDeleteContact}
            />
          ))}
        </div>
      )}

      {/* Add Contact Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                    Add New Contact
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>

                <form onSubmit={handleAddContact} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newContact.name}
                      onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={newContact.email}
                      onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Company"
                      value={newContact.company}
                      onChange={(e) => setNewContact({...newContact, company: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Position"
                      value={newContact.position}
                      onChange={(e) => setNewContact({...newContact, position: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg font-medium"
                    >
                      Add Contact
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Contacts