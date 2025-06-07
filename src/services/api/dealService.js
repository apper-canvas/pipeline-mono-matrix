import { toast } from 'react-toastify';

const dealService = {
  async getAll(filters = {}) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ['Name', 'title', 'value', 'stage', 'probability', 'expected_close', 'assigned_to', 'notes', 'contact_id', 'CreatedOn', 'ModifiedOn'],
        ...filters
      };

      const response = await apperClient.fetchRecords('deal', params);
      
      if (!response?.success) {
        console.error(response?.message || 'Failed to fetch deals');
        toast.error(response?.message || 'Failed to fetch deals');
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching deals:', error);
      toast.error('Failed to load deals');
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
        fields: ['Name', 'title', 'value', 'stage', 'probability', 'expected_close', 'assigned_to', 'notes', 'contact_id', 'CreatedOn', 'ModifiedOn']
      };

      const response = await apperClient.getRecordById('deal', id, params);
      
      if (!response?.success) {
        console.error(response?.message || 'Deal not found');
        toast.error(response?.message || 'Deal not found');
        return null;
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching deal:', error);
      toast.error('Failed to load deal');
      return null;
    }
  },

  async create(dealData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: dealData.title || dealData.Name,
          title: dealData.title,
          value: parseFloat(dealData.value || 0),
          stage: dealData.stage || 'Lead',
          probability: parseInt(dealData.probability || 25),
          expected_close: dealData.expectedClose || dealData.expected_close || '',
          assigned_to: dealData.assignedTo || dealData.assigned_to || '',
          notes: dealData.notes || '',
          contact_id: dealData.contactId || dealData.contact_id || null
        }]
      };

      const response = await apperClient.createRecord('deal', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Deal created successfully!');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error creating deal:', error);
      toast.error('Failed to create deal');
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
      if (updateData.title !== undefined) {
        updateRecord.Name = updateData.title;
        updateRecord.title = updateData.title;
      }
      if (updateData.value !== undefined) updateRecord.value = parseFloat(updateData.value);
      if (updateData.stage !== undefined) updateRecord.stage = updateData.stage;
      if (updateData.probability !== undefined) updateRecord.probability = parseInt(updateData.probability);
      if (updateData.expected_close !== undefined) updateRecord.expected_close = updateData.expected_close;
      if (updateData.assigned_to !== undefined) updateRecord.assigned_to = updateData.assigned_to;
      if (updateData.notes !== undefined) updateRecord.notes = updateData.notes;
      if (updateData.contact_id !== undefined) updateRecord.contact_id = updateData.contact_id;

      const params = { records: [updateRecord] };
      const response = await apperClient.updateRecord('deal', params);
      
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
          toast.success('Deal updated successfully!');
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error updating deal:', error);
      toast.error('Failed to update deal');
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
      const response = await apperClient.deleteRecord('deal', params);
      
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
          toast.success('Deal deleted successfully!');
        }
        
        return failedDeletions.length === 0;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting deal:', error);
      toast.error('Failed to delete deal');
      return false;
    }
  }
};

export default dealService;