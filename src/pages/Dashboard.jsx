import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { contactService, dealService, activityService } from '../services'

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalContacts: 0,
    activeDeals: 0,
    monthlyRevenue: 0,
    conversionRate: 0
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [upcomingTasks, setUpcomingTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadDashboardData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [contacts, deals, activities] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll()
      ])

      // Calculate metrics
      const activeDeals = deals.filter(deal => deal.stage !== 'Closed Lost' && deal.stage !== 'Closed Won')
      const wonDeals = deals.filter(deal => deal.stage === 'Closed Won')
      const monthlyRevenue = wonDeals.reduce((sum, deal) => sum + deal.value, 0)
      const conversionRate = deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0

      setMetrics({
        totalContacts: contacts.length,
        activeDeals: activeDeals.length,
        monthlyRevenue,
        conversionRate
      })

      // Recent activities (last 5)
      const sortedActivities = activities
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
      setRecentActivities(sortedActivities)

      // Mock upcoming tasks
      setUpcomingTasks([
        { id: 1, title: 'Follow up with Sarah Johnson', due: 'Today', priority: 'high' },
        { id: 2, title: 'Send proposal to TechCorp', due: 'Tomorrow', priority: 'medium' },
        { id: 3, title: 'Schedule demo call', due: 'Friday', priority: 'low' }
      ])
      
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Skeleton for metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card"
            >
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Skeleton for content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
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
            Something went wrong
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadDashboardData}
            className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg font-medium"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    )
  }

  const MetricCard = ({ title, value, icon, change, color = "primary" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card hover:shadow-soft transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
          color === 'primary' ? 'from-primary to-secondary' :
          color === 'success' ? 'from-accent to-emerald-600' :
          color === 'warning' ? 'from-yellow-400 to-orange-500' :
          'from-blue-500 to-purple-600'
        } flex items-center justify-center`}>
          <ApperIcon name={icon} size={24} className="text-white" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm ${
            change > 0 ? 'text-accent' : 'text-red-500'
          }`}>
            <ApperIcon name={change > 0 ? 'TrendingUp' : 'TrendingDown'} size={16} />
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {typeof value === 'number' && title.includes('Revenue') 
          ? `$${value.toLocaleString()}` 
          : value}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
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
            Welcome back, John! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your sales pipeline today.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all self-start sm:self-auto"
        >
          <ApperIcon name="Plus" size={16} className="inline mr-2" />
          Quick Add
        </motion.button>
      </motion.div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Contacts"
          value={metrics.totalContacts}
          icon="Users"
          change={12}
          color="primary"
        />
        <MetricCard
          title="Active Deals"
          value={metrics.activeDeals}
          icon="Target"
          change={8}
          color="success"
        />
        <MetricCard
          title="Monthly Revenue"
          value={metrics.monthlyRevenue}
          icon="DollarSign"
          change={-3}
          color="warning"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          icon="TrendingUp"
          change={5}
          color="info"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
              Recent Activities
            </h2>
            <ApperIcon name="Activity" size={20} className="text-gray-400" />
          </div>
          
          {recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Clock" size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No recent activities</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'call' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'email' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    <ApperIcon 
                      name={activity.type === 'call' ? 'Phone' : activity.type === 'email' ? 'Mail' : 'Calendar'} 
                      size={16} 
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {activity.description}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
              Upcoming Tasks
            </h2>
            <ApperIcon name="CheckSquare" size={20} className="text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {upcomingTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Due: {task.due}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === 'high' ? 'bg-red-100 text-red-700' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard