import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { routes, routeArray } from '@/config/routes';
import Header from '@/components/organisms/Header';
import Sidebar from '@/components/organisms/Sidebar';
import Dashboard from '@/pages/Dashboard'; // Existing pages
import Contacts from '@/pages/Contacts';   // Existing pages
import Deals from '@/pages/Deals';         // Existing pages
import Activities from '@/pages/Activities'; // Existing pages

// Although MultiStepForm (the new MainFeature) is an organism,
// it is imported directly here to mimic the original `Home.jsx`
// structure where `MainFeature` was directly rendered.
// In a larger app, this might be decided by a route or a more complex page organism.
import MultiStepForm from '@/components/organisms/MultiStepForm'; 

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Adjust route component mapping based on original Home.jsx
  // It dynamically renders components based on `activeTab`
  const getComponent = (id) => {
    switch (id) {
      case 'dashboard':
        return Dashboard;
      case 'contacts':
        return Contacts;
      case 'deals':
        return Deals;
      case 'activities':
        return Activities;
      case 'quick-deal': // This was the "MainFeature" originally, now MultiStepForm
        return MultiStepForm;
      default:
        return Dashboard;
    }
  };

  const CurrentComponent = getComponent(activeTab);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      <div className="flex">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          closeSidebar={() => setIsSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          routeArray={routeArray}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 p-4 lg:p-6"> {/* Added padding to main content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <CurrentComponent />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default HomePage;