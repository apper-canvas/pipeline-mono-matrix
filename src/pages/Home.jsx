import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import { routes, routeArray } from '../config/routes'
import Dashboard from './Dashboard'
import Contacts from './Contacts'
import Deals from './Deals'
import Activities from './Activities'

const Home = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const currentRoute = routes[activeTab]

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 h-16 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ApperIcon name="Menu" size={20} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Target" size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
              Pipeline Pro
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 max-w-sm">
            <ApperIcon name="Search" size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts, deals..."
              className="bg-transparent text-sm placeholder-gray-400 border-none outline-none flex-1"
            />
          </div>
          
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ApperIcon name={isDarkMode ? 'Sun' : 'Moon'} size={20} className="text-gray-600 dark:text-gray-300" />
          </button>

          <div className="w-8 h-8 bg-gradient-to-br from-accent to-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">JD</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {(isSidebarOpen || window.innerWidth >= 1024) && (
            <>
              {/* Mobile overlay */}
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden fixed inset-0 bg-black/50 z-30"
                />
              )}
              
              {/* Sidebar */}
              <motion.aside
                initial={{ x: -240 }}
                animate={{ x: 0 }}
                exit={{ x: -240 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed lg:relative lg:translate-x-0 inset-y-0 left-0 z-40 w-60 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 mt-16 lg:mt-0"
              >
                <nav className="p-4 space-y-2">
                  {routeArray.map((route) => (
                    <motion.button
                      key={route.id}
                      onClick={() => {
                        setActiveTab(route.id)
                        setIsSidebarOpen(false)
                      }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                        activeTab === route.id
                          ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-l-4 border-primary'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <ApperIcon 
                        name={route.icon} 
                        size={20} 
                        className={activeTab === route.id ? 'text-primary' : 'text-gray-400'} 
                      />
                      <span className="font-medium">{route.label}</span>
                    </motion.button>
                  ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <ApperIcon name="Zap" size={16} className="text-primary" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pro Tip</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Use keyboard shortcuts to navigate quickly between sections.
                  </p>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <currentRoute.component />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default Home