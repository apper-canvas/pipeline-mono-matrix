import React from 'react';
import FormField from '@/components/molecules/FormField';

const DealForm = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-4">
      <FormField
        id="dealTitle"
        label="Deal Title"
        type="text"
        value={formData.dealTitle}
        onChange={(e) => onInputChange('dealTitle', e.target.value)}
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="dealValue"
          label="Deal Value ($)"
          type="number"
          value={formData.dealValue}
          onChange={(e) => onInputChange('dealValue', e.target.value)}
          required
        />
        <FormField
          id="dealStage"
          label="Initial Stage"
          type="select"
          value={formData.dealStage}
          onChange={(e) => onInputChange('dealStage', e.target.value)}
        >
          <option value="Lead">Lead</option>
          <option value="Qualified">Qualified</option>
          <option value="Proposal">Proposal</option>
          <option value="Negotiation">Negotiation</option>
        </FormField>
      </div>
    </div>
  );
};

export default DealForm;