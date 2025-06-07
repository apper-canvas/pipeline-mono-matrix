import { toast } from 'react-toastify';

const activityService = {
  async getAll(filters = {}) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ['Name', 'type', 'contact_id', 'deal_id', 'description', 'date', 'duration', 'CreatedOn', 'ModifiedOn'],
        ...filters
      };

      const response = await apperClient.fetchRecords('Activity1', params);
      
      if (!response?.success) {
        console.error(response?.message || 'Failed to fetch activities');
        toast.error(response?.message || 'Failed to fetch activities');
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activities');
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
        fields: ['Name', 'type', 'contact_id', 'deal_id', 'description', 'date', 'duration', 'CreatedOn', 'ModifiedOn']
      };

      const response = await apperClient.getRecordById('Activity1', id, params);
      
      if (!response?.success) {
        console.error(response?.message || 'Activity not found');
        toast.error(response?.message || 'Activity not found');
        return null;
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching activity:', error);
      toast.error('Failed to load activity');
      return null;
    }
  },

  async create(activityData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: activityData.description || `${activityData.type} activity`,
          type: activityData.type || 'call',
          contact_id: activityData.contactId || activityData.contact_id || null,
          deal_id: activityData.dealId || activityData.deal_id || null,
          description: activityData.description || '',
          date: activityData.date || new Date().toISOString().split('T')[0],
          duration: parseInt(activityData.duration || 0)
        }]
      };

      const response = await apperClient.createRecord('Activity1', params);
      
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
          toast.success('Activity created successfully!');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error creating activity:', error);
      toast.error('Failed to create activity');
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
      if (updateData.type !== undefined) updateRecord.type = updateData.type;
      if (updateData.contact_id !== undefined) updateRecord.contact_id = updateData.contact_id;
      if (updateData.deal_id !== undefined) updateRecord.deal_id = updateData.deal_id;
      if (updateData.description !== undefined) {
        updateRecord.description = updateData.description;
        updateRecord.Name = updateData.description || `${updateData.type || 'activity'}`;
      }
      if (updateData.date !== undefined) updateRecord.date = updateData.date;
      if (updateData.duration !== undefined) updateRecord.duration = parseInt(updateData.duration);

      const params = { records: [updateRecord] };
      const response = await apperClient.updateRecord('Activity1', params);
      
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
          toast.success('Activity updated successfully!');
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error updating activity:', error);
      toast.error('Failed to update activity');
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
      const response = await apperClient.deleteRecord('Activity1', params);
      
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
          toast.success('Activity deleted successfully!');
        }
        
        return failedDeletions.length === 0;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Failed to delete activity');
      return false;
    }
  }
};

export default activityService;