import { toast } from 'react-toastify';

const contactService = {
  async getAll(filters = {}) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ['Name', 'email', 'phone', 'company', 'position', 'last_contact', 'tags', 'CreatedOn', 'ModifiedOn'],
        ...filters
      };

      const response = await apperClient.fetchRecords('contact', params);
      
      if (!response?.success) {
        console.error(response?.message || 'Failed to fetch contacts');
        toast.error(response?.message || 'Failed to fetch contacts');
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ['Name', 'email', 'phone', 'company', 'position', 'last_contact', 'tags', 'CreatedOn', 'ModifiedOn']
      };

      const response = await apperClient.getRecordById('contact', id, params);
      
      if (!response?.success) {
        console.error(response?.message || 'Contact not found');
        toast.error(response?.message || 'Contact not found');
        return null;
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching contact:', error);
      toast.error('Failed to load contact');
      return null;
    }
  },

  async create(contactData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: contactData.name || contactData.Name,
          email: contactData.email,
          phone: contactData.phone || '',
          company: contactData.company || '',
          position: contactData.position || '',
          last_contact: new Date().toISOString().split('T')[0],
          tags: Array.isArray(contactData.tags) ? contactData.tags.join(',') : (contactData.tags || '')
        }]
      };

      const response = await apperClient.createRecord('contact', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:`, failedRecords);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Contact created successfully!');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error creating contact:', error);
      toast.error('Failed to create contact');
      return null;
    }
  },

  async update(id, updateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateRecord = { Id: id };
      
      // Only include Updateable fields that are provided
      if (updateData.name !== undefined) updateRecord.Name = updateData.name;
      if (updateData.email !== undefined) updateRecord.email = updateData.email;
      if (updateData.phone !== undefined) updateRecord.phone = updateData.phone;
      if (updateData.company !== undefined) updateRecord.company = updateData.company;
      if (updateData.position !== undefined) updateRecord.position = updateData.position;
      if (updateData.last_contact !== undefined) updateRecord.last_contact = updateData.last_contact;
      if (updateData.tags !== undefined) {
        updateRecord.tags = Array.isArray(updateData.tags) ? updateData.tags.join(',') : updateData.tags;
      }

      const params = { records: [updateRecord] };
      const response = await apperClient.updateRecord('contact', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:`, failedUpdates);
          failedUpdates.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('Contact updated successfully!');
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error updating contact:', error);
      toast.error('Failed to update contact');
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { RecordIds: [id] };
      const response = await apperClient.deleteRecord('contact', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:`, failedDeletions);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        } else {
          toast.success('Contact deleted successfully!');
        }
        
        return failedDeletions.length === 0;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
      return false;
    }
  }
};

export default contactService;