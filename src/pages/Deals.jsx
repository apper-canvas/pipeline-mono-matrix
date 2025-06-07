import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { dealService, contactService } from '../services'

const Deals = () => {
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [draggedDeal, setDraggedDeal] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newDeal, setNewDeal] = useState({
    title: '',
    value: '',
    stage: 'Lead',
    probability: 25,
    expectedClose: '',
    contactId: '',
    assignedTo: 'John Doe',
    notes: ''
  })

  const stages = [
    { id: 'Lead', label: 'Lead', color: 'bg-gray-100 text-gray-700', count: 0 },
    { id: 'Qualified', label: 'Qualified', color: 'bg-blue-100 text-blue-700', count: 0 },
    { id: 'Proposal', label: 'Proposal', color: 'bg-yellow-100 text-yellow-700', count: 0 },
    { id: 'Negotiation', label: 'Negotiation', color: 'bg-orange-100 text-orange-700', count: 0 },
    { id: 'Closed Won', label: 'Closed Won', color: 'bg-green-100 text-green-700', count: 0 },
    { id: 'Closed Lost', label: 'Closed Lost', color: 'bg-red-100 text-red-700', count: 0 }
  ]

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ])
      setDeals(dealsData)
      setContacts(contactsData)
    } catch (err) {
      setError(err.message || 'Failed to load deals')
      toast.error('Failed to load deals')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAddDeal = async (e) => {
    e.preventDefault()
    
    try {
      const deal = await dealService.create({
        ...newDeal,
        value: parseFloat(newDeal.value)
      })
      setDeals([...deals, deal])
      setNewDeal({
        title: '',
        value: '',
        stage: 'Lead',
        probability: 25,
        expectedClose: '',
        contactId: '',
        assignedTo: 'John Doe',
        notes: ''
      })
      setShowAddModal(false)
      toast.success('Deal added successfully!')
    } catch (err) {
      toast.error('Failed to add deal')
    }
  }

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, newStage) => {
    e.preventDefault()
    
    if (draggedDeal && draggedDeal.stage !== newStage) {
      try {
        const updatedDeal = await dealService.update(draggedDeal.id, { stage: newStage })
        setDeals(deals.map(deal => 
          deal.id === draggedDeal.id ? { ...deal, stage: newStage } : deal
        ))
        toast.success(`Deal moved to ${newStage}`)
      } catch (err) {
        toast.error('Failed to update deal')
      }
    }
    
    setDraggedDeal(null)
  }

  const handleDeleteDeal = async (id) => {
    try {
      await dealService.delete(id)
      setDeals(deals.filter(d => d.id !== id))
      toast.success('Deal deleted successfully!')
    } catch (err) {
      toast.error('Failed to delete deal')
    }
  }

  // Count deals by stage
  const stagesWithCounts = stages.map(stage => ({
    ...stage,
    count: deals.filter(deal => deal.stage === stage.id).length
  }))

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

        {/* Pipeline skeleton */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={`deal-pipeline-skeleton-${i}`} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-card">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(2)].map((_, j) => (
                    <div key={`deal-card-skeleton-${i}-${j}`} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
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
            Failed to load deals
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

  const DealCard = ({ deal, index }) => {
    const contact = contacts.find(c => c.id === deal.contactId)
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        draggable
        onDragStart={(e) => handleDragStart(e, deal)}
        whileHover={{ scale: 1.02 }}
        whileDrag={{ scale: 0.98, rotate: 5 }}
        className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-move border-l-4 border-primary group"
      >
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">
            {deal.title}
          </h4>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDeleteDeal(deal.id)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <ApperIcon name="Trash2" size={14} />
            </motion.button>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${deal.value?.toLocaleString() || '0'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {deal.probability}% chance
            </span>
          </div>
          
          {contact && (
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <ApperIcon name="User" size={12} />
              <span>{contact.name}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <ApperIcon name="Calendar" size={12} />
            <span>
              {deal.expectedClose ? new Date(deal.expectedClose).toLocaleDateString() : 'No date set'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="w-6 h-6 bg-gradient-to-br from-accent to-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {deal.assignedTo?.split(' ').map(n => n[0]).join('') || 'JD'}
            </span>
          </div>
          <div className="w-full mx-2 bg-gray-200 dark:bg-gray-600 rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-1 rounded-full transition-all"
              style={{ width: `${deal.probability}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {deal.probability}%
          </span>
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
            Sales Pipeline ({deals.length} deals)
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your deals through the sales process. Drag cards to move between stages.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
        >
          <ApperIcon name="Plus" size={16} className="inline mr-2" />
          Add Deal
        </motion.button>
      </motion.div>

      {/* Pipeline Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-card"
      >
<div className="flex items-center gap-2 mb-3">
          <ApperIcon name="BarChart3" size={20} className="text-primary" />
          <h2 className="font-semibold text-gray-900 dark:text-white">Pipeline Overview</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stagesWithCounts.map((stage, index) => (
            <motion.div
              key={`pipeline-overview-${stage.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="text-center"
            >
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stage.color} mb-1`}>
                {stage.count}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{stage.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 min-h-[600px]">
        {stagesWithCounts.map((stage, stageIndex) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: stageIndex * 0.1 }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 min-h-[500px]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {stage.label}
              </h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stage.color}`}>
                {stage.count}
              </span>
            </div>

            <div className="space-y-3">
              {deals
                .filter(deal => deal.stage === stage.id)
                .map((deal, index) => (
                  <DealCard key={deal.id} deal={deal} index={index} />
                ))}
              
              {deals.filter(deal => deal.stage === stage.id).length === 0 && (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <ApperIcon name="Target" size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No deals in this stage
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Deal Modal */}
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
                    Add New Deal
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>

                <form onSubmit={handleAddDeal} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Deal Title"
                      value={newDeal.title}
                      onChange={(e) => setNewDeal({...newDeal, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <input
                      type="number"
                      placeholder="Deal Value ($)"
                      value={newDeal.value}
                      onChange={(e) => setNewDeal({...newDeal, value: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <select
                      value={newDeal.contactId}
                      onChange={(e) => setNewDeal({...newDeal, contactId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
>
                      <option value="">Select Contact</option>
                      {contacts.map(contact => (
                        <option key={`deal-contact-${contact.id}`} value={contact.id}>
                          {contact.name} - {contact.company}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <input
                      type="date"
                      placeholder="Expected Close Date"
                      value={newDeal.expectedClose}
                      onChange={(e) => setNewDeal({...newDeal, expectedClose: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Probability: {newDeal.probability}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={newDeal.probability}
                      onChange={(e) => setNewDeal({...newDeal, probability: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <textarea
                      placeholder="Notes (optional)"
                      value={newDeal.notes}
                      onChange={(e) => setNewDeal({...newDeal, notes: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
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
                      Add Deal
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

export default Deals