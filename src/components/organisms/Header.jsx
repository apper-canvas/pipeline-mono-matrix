import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button'; // Using the new Button atom

const Header = ({ isSidebarOpen, toggleSidebar, isDarkMode, toggleDarkMode }) => {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 h-16 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Button
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ApperIcon name="Menu" size={20} />
        </Button>
        
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
          <Input
            type="text"
            placeholder="Search contacts, deals..."
            className="bg-transparent text-sm placeholder-gray-400 border-none outline-none flex-1"
          />
        </div>
        
        <Button
          onClick={toggleDarkMode}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ApperIcon name={isDarkMode ? 'Sun' : 'Moon'} size={20} className="text-gray-600 dark:text-gray-300" />
        </Button>

        <div className="w-8 h-8 bg-gradient-to-br from-accent to-emerald-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">JD</span>
        </div>
      </div>
    </header>
  );
};

export default Header;