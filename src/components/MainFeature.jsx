import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { dealService, contactService } from '../services'

const MainFeature = () => {
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeStep, setActiveStep] = useState(1)
  const [formData, setFormData] = useState({
    contactName: '',
    contactEmail: '',
    contactCompany: '',
    dealTitle: '',
    dealValue: '',
    dealStage: 'Lead'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.contactName && formData.contactEmail && formData.contactCompany
      case 2:
        return formData.dealTitle && formData.dealValue
      case 3:
        return true
      default:
        return false
    }
  }

  const handleNextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => Math.min(prev + 1, 3))
    } else {
      toast.error('Please fill in all required fields')
    }
  }

  const handlePrevStep = () => {
    setActiveStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2)) {
      toast.error('Please complete all required fields')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Create contact first
      const contact = await contactService.create({
        name: formData.contactName,
        email: formData.contactEmail,
        phone: '',
        company: formData.contactCompany,
        position: '',
        tags: ['New Lead']
      })

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
      })

      // Reset form
      setFormData({
        contactName: '',
        contactEmail: '',
        contactCompany: '',
        dealTitle: '',
        dealValue: '',
        dealStage: 'Lead'
      })
      setActiveStep(1)
      
      toast.success('Contact and deal created successfully!')
      
      // Refresh data
      loadData()
      
    } catch (err) {
      toast.error('Failed to create contact and deal')
    } finally {
      setIsSubmitting(false)
    }
  }

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
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-card text-center">
        <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Something went wrong
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
      </div>
    )
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
          {/* Step 1: Contact Information */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all peer placeholder-transparent"
                    placeholder="Contact Name"
                    id="contactName"
                  />
                  <label
                    htmlFor="contactName"
                    className="absolute left-4 -top-2.5 bg-gray-50 dark:bg-gray-700 px-2 text-sm text-gray-600 dark:text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary peer-focus:bg-gray-50 dark:peer-focus:bg-gray-700"
                  >
                    Contact Name *
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all peer placeholder-transparent"
                    placeholder="Email Address"
                    id="contactEmail"
                  />
                  <label
                    htmlFor="contactEmail"
                    className="absolute left-4 -top-2.5 bg-gray-50 dark:bg-gray-700 px-2 text-sm text-gray-600 dark:text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary peer-focus:bg-gray-50 dark:peer-focus:bg-gray-700"
                  >
                    Email Address *
                  </label>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={formData.contactCompany}
                  onChange={(e) => handleInputChange('contactCompany', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all peer placeholder-transparent"
                  placeholder="Company Name"
                  id="contactCompany"
                />
                <label
                  htmlFor="contactCompany"
                  className="absolute left-4 -top-2.5 bg-gray-50 dark:bg-gray-700 px-2 text-sm text-gray-600 dark:text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary peer-focus:bg-gray-50 dark:peer-focus:bg-gray-700"
                >
                  Company Name *
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Deal Details */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={formData.dealTitle}
                  onChange={(e) => handleInputChange('dealTitle', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all peer placeholder-transparent"
                  placeholder="Deal Title"
                  id="dealTitle"
                />
                <label
                  htmlFor="dealTitle"
                  className="absolute left-4 -top-2.5 bg-gray-50 dark:bg-gray-700 px-2 text-sm text-gray-600 dark:text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary peer-focus:bg-gray-50 dark:peer-focus:bg-gray-700"
                >
                  Deal Title *
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="number"
                    value={formData.dealValue}
                    onChange={(e) => handleInputChange('dealValue', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all peer placeholder-transparent"
                    placeholder="Deal Value"
                    id="dealValue"
                  />
                  <label
                    htmlFor="dealValue"
                    className="absolute left-4 -top-2.5 bg-gray-50 dark:bg-gray-700 px-2 text-sm text-gray-600 dark:text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary peer-focus:bg-gray-50 dark:peer-focus:bg-gray-700"
                  >
                    Deal Value ($) *
                  </label>
                </div>

                <div className="relative">
                  <select
                    value={formData.dealStage}
                    onChange={(e) => handleInputChange('dealStage', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  >
                    <option value="Lead">Lead</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                  </select>
                  <label className="absolute left-4 -top-2.5 bg-gray-50 dark:bg-gray-700 px-2 text-sm text-gray-600 dark:text-gray-400">
                    Initial Stage
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {activeStep === 3 && (
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
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <motion.button
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
        </motion.button>

        {activeStep < 3 ? (
          <motion.button
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
          </motion.button>
        ) : (
          <motion.button
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
          </motion.button>
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
  )
}

export default MainFeature