import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { dealService, contactService } from '@/services'; // Corrected import path
import Button from '@/components/atoms/Button';
import ContactForm from '@/components/organisms/ContactForm';
import DealForm from '@/components/organisms/DealForm';
import ReviewDealForm from '@/components/organisms/ReviewDealForm';

const steps = [
  {
    id: 1,
    title: 'Contact Information',
    description: 'Enter contact details',
    icon: 'User'
  },
  {
    id: 2,
    title: 'Deal Details',
    description: 'Set up the opportunity',
    icon: 'Target'
  },
  {
    id: 3,
    title: 'Review & Create',
    description: 'Confirm and submit',
    icon: 'CheckCircle'
  }
];

const MultiStepForm = () => {
  const [deals, setDeals] = useState([]); // Kept for data loading, though not displayed here
  const [contacts, setContacts] = useState([]); // Kept for data loading, though not displayed here
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    contactName: '',
    contactEmail: '',
    contactCompany: '',
    dealTitle: '',
    dealValue: '',
    dealStage: 'Lead'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // These are loaded but not currently used in the MainFeature component itself
      // They are likely mock data used elsewhere or for future features.
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.contactName && formData.contactEmail && formData.contactCompany;
      case 2:
        return formData.dealTitle && formData.dealValue;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => Math.min(prev + 1, 3));
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handlePrevStep = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2)) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
// Create contact first
      const contact = await contactService.create({
        name: formData.contactName,
        email: formData.contactEmail,
        phone: '',
        company: formData.contactCompany,
        position: '',
        tags: ['New Lead']
      });

      if (!contact) {
        throw new Error('Failed to create contact');
      }
      // Create deal with contact reference
      const deal = await dealService.create({
        title: formData.dealTitle,
        value: parseFloat(formData.dealValue),
        stage: formData.dealStage,
        probability: 25,
        expectedClose: '',
        contactId: contact.id,
        assignedTo: 'John Doe',
        notes: 'Created via Quick Deal Creator'
      });

      // Reset form
      setFormData({
        contactName: '',
        contactEmail: '',
        contactCompany: '',
        dealTitle: '',
        dealValue: '',
        dealStage: 'Lead'
      });
      setActiveStep(1);
      
      toast.success('Contact and deal created successfully!');
      
      // Refresh data
      loadData();
      
    } catch (err) {
      toast.error('Failed to create contact and deal');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-card">
        <div className="animate-pulse space-y-6">
          <div className="text-center">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto"></div>
          </div>
          
          <div className="flex justify-center space-x-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
            ))}
          </div>
          
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-card text-center">
        <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadData}
          className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg font-medium"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-card border border-gray-100 dark:border-gray-700"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <ApperIcon name="Zap" size={32} className="text-white" />
        </motion.div>
        <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
          Quick Deal Creator
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Streamline your workflow by creating contacts and deals in one simple process
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center items-center mb-8">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center"
          >
            <div className="flex flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                  activeStep >= step.id
                    ? 'bg-gradient-to-br from-primary to-secondary border-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400'
                }`}
              >
                <ApperIcon 
                  name={activeStep > step.id ? 'Check' : step.icon} 
                  size={20} 
                />
              </motion.div>
              <div className="text-center mt-2">
                <p className={`text-sm font-medium ${
                  activeStep >= step.id 
                    ? 'text-primary' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-400">{step.description}</p>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 transition-all ${
                activeStep > step.id 
                  ? 'bg-gradient-to-r from-primary to-secondary' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`} />
            )}
          </motion.div>
        ))}
      </div>

      {/* Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {activeStep === 1 && <ContactForm formData={formData} onInputChange={handleInputChange} />}
          {activeStep === 2 && <DealForm formData={formData} onInputChange={handleInputChange} />}
          {activeStep === 3 && <ReviewDealForm formData={formData} />}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevStep}
          disabled={activeStep === 1}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeStep === 1
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <ApperIcon name="ChevronLeft" size={16} className="inline mr-2" />
          Previous
        </Button>

        {activeStep < 3 ? (
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextStep}
            disabled={!validateStep(activeStep)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              validateStep(activeStep)
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next
            <ApperIcon name="ChevronRight" size={16} className="inline ml-2" />
          </Button>
        ) : (
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-accent to-emerald-600 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <ApperIcon name="Loader2" size={16} className="inline mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <ApperIcon name="Check" size={16} className="inline mr-2" />
                Create Contact & Deal
              </>
            )}
          </Button>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="mt-6">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: '33%' }}
            animate={{ width: `${(activeStep / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
          />
        </div>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
          Step {activeStep} of 3
        </p>
      </div>
    </motion.div>
  );
};

export default MultiStepForm;