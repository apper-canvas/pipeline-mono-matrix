import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ReviewDealForm = ({ formData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 border border-primary/20">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Review Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Contact</h4>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p><span className="font-medium">Name:</span> {formData.contactName}</p>
              <p><span className="font-medium">Email:</span> {formData.contactEmail}</p>
              <p><span className="font-medium">Company:</span> {formData.contactCompany}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Deal</h4>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p><span className="font-medium">Title:</span> {formData.dealTitle}</p>
              <p><span className="font-medium">Value:</span> ${parseFloat(formData.dealValue || 0).toLocaleString()}</p>
              <p><span className="font-medium">Stage:</span> {formData.dealStage}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-16 h-16 bg-gradient-to-br from-accent to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <ApperIcon name="Rocket" size={32} className="text-white" />
        </motion.div>
        <p className="text-gray-600 dark:text-gray-400">
          Ready to create your contact and deal? This will add them to your pipeline immediately.
        </p>
      </div>
    </div>
  );
};

export default ReviewDealForm;