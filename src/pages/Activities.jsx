import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { activityService, contactService, dealService } from '../services'

const Activities = () => {
  const [activities, setActivities] = useState([])
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterType, setFilterType] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newActivity, setNewActivity] = useState({
    type: 'call',
    contactId: '',
    dealId: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    duration: 30
  })

  const activityTypes = [
    { id: 'all', label: 'All Activities', icon: 'Activity' },
    { id: 'call', label: 'Calls', icon: 'Phone' },
    { id: 'email', label: 'Emails', icon: 'Mail' },
    { id: 'meeting', label: 'Meetings', icon: 'Calendar' },
    { id: 'note', label: 'Notes', icon: 'FileText' }
  ]

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [activitiesData, contactsData, dealsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ])
      setActivities(activitiesData)
      setContacts(contactsData)
      setDeals(dealsData)
    } catch (err) {
      setError(err.message || 'Failed to load activities')
      toast.error('Failed to load activities')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAddActivity = async (e) => {
    e.preventDefault()
    
    try {
      const activity = await activityService.create({
        ...newActivity,
        duration: parseInt(newActivity.duration)
      })
      setActivities([activity, ...activities])
      setNewActivity({
        type: 'call',
        contactId: '',
        dealId: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        duration: 30
      })
      setShowAddModal(false)
      toast.success('Activity added successfully!')
    } catch (err) {
      toast.error('Failed to add activity')
    }
  }

  const handleDeleteActivity = async (id) => {
    try {
      await activityService.delete(id)
      setActivities(activities.filter(a => a.id !== id))
      toast.success('Activity deleted successfully!')
    } catch (err) {
      toast.error('Failed to delete activity')
    }
  }

  const filteredActivities = activities.filter(activity => 
    filterType === 'all' || activity.type === filterType
  ).sort((a, b) => new Date(b.date) - new Date(a.date))

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
          </div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>

        {/* Filter skeleton */}
        <div className="flex gap-2 overflow-x-auto">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-24"></div>
          ))}
        </div>

        {/* Timeline skeleton */}
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card"
            >
              <div className="animate-pulse flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
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
            Failed to load activities
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadData}
            className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg font-medium"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    )
  }

  const getActivityIcon = (type) => {
    const iconMap = {
      call: 'Phone',
      email: 'Mail',
      meeting: 'Calendar',
      note: 'FileText'
    }
    return iconMap[type] || 'Activity'
  }

  const getActivityColor = (type) => {
    const colorMap = {
      call: 'bg-blue-100 text-blue-600 border-blue-200',
      email: 'bg-green-100 text-green-600 border-green-200',
      meeting: 'bg-purple-100 text-purple-600 border-purple-200',
      note: 'bg-yellow-100 text-yellow-600 border-yellow-200'
    }
    return colorMap[type] || 'bg-gray-100 text-gray-600 border-gray-200'
  }

  const ActivityCard = ({ activity, index }) => {
    const contact = contacts.find(c => c.id === activity.contactId)
    const deal = deals.find(d => d.id === activity.dealId)
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card hover:shadow-soft transition-all duration-200 group"
      >
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${getActivityColor(activity.type)}`}>
            <ApperIcon name={getActivityIcon(activity.type)} size={20} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {activity.description}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Calendar" size={14} />
                    <span>{new Date(activity.date).toLocaleDateString()}</span>
                  </div>
                  {activity.duration && (
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Clock" size={14} />
                      <span>{activity.duration} min</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDeleteActivity(activity.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <ApperIcon name="Trash2" size={16} />
                </motion.button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {contact && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                  <ApperIcon name="User" size={12} />
                  <span>{contact.name}</span>
                </div>
              )}
              {deal && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs">
                  <ApperIcon name="Target" size={12} />
                  <span>{deal.title}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

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
            Activities ({filteredActivities.length})
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track all interactions with contacts and deals in one timeline.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
        >
          <ApperIcon name="Plus" size={16} className="inline mr-2" />
          Add Activity
        </motion.button>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {activityTypes.map((type, index) => (
          <motion.button
            key={type.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterType(type.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              filterType === type.id
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
            }`}
          >
            <ApperIcon name={type.icon} size={16} />
            <span>{type.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Timeline */}
      {filteredActivities.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Activity" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No activities found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {filterType === 'all' 
              ? 'Start tracking your interactions by adding your first activity' 
              : `No ${filterType} activities found. Try a different filter or add a new activity.`
            }
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg font-medium"
          >
            Add First Activity
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((activity, index) => (
            <ActivityCard key={activity.id} activity={activity} index={index} />
          ))}
        </div>
      )}

      {/* Add Activity Modal */}
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
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                    Add New Activity
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>

                <form onSubmit={handleAddActivity} className="space-y-4">
                  <div>
                    <select
                      value={newActivity.type}
                      onChange={(e) => setNewActivity({...newActivity, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="call">Phone Call</option>
                      <option value="email">Email</option>
                      <option value="meeting">Meeting</option>
                      <option value="note">Note</option>
                    </select>
                  </div>

                  <div>
                    <textarea
                      placeholder="Activity description..."
                      value={newActivity.description}
                      onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      required
                    />
                  </div>

                  <div>
                    <select
                      value={newActivity.contactId}
                      onChange={(e) => setNewActivity({...newActivity, contactId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Contact (Optional)</option>
                      {contacts.map(contact => (
                        <option key={contact.id} value={contact.id}>
                          {contact.name} - {contact.company}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <select
                      value={newActivity.dealId}
                      onChange={(e) => setNewActivity({...newActivity, dealId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Deal (Optional)</option>
                      {deals.map(deal => (
                        <option key={deal.id} value={deal.id}>
                          {deal.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <input
                      type="date"
                      value={newActivity.date}
                      onChange={(e) => setNewActivity({...newActivity, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <input
                      type="number"
                      placeholder="Duration (minutes)"
                      value={newActivity.duration}
                      onChange={(e) => setNewActivity({...newActivity, duration: e.target.value})}
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
                      Add Activity
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

export default Activities