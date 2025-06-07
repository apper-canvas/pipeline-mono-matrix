import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Sidebar = ({ isSidebarOpen, closeSidebar, activeTab, onTabChange, routeArray }) => {
  return (
    <AnimatePresence>
      {(isSidebarOpen || window.innerWidth >= 1024) && ( // Ensure sidebar is open on large screens
        <>
          {/* Mobile overlay */}
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
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
                <Button
                  key={route.id}
                  onClick={() => {
                    onTabChange(route.id);
                    closeSidebar();
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
                </Button>
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
  );
};

export default Sidebar;