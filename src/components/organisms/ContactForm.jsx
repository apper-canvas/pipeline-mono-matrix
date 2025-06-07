import React from 'react';
import FormField from '@/components/molecules/FormField';

const ContactForm = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="contactName"
          label="Contact Name"
          type="text"
          value={formData.contactName}
          onChange={(e) => onInputChange('contactName', e.target.value)}
          required
        />
        <FormField
          id="contactEmail"
          label="Email Address"
          type="email"
          value={formData.contactEmail}
          onChange={(e) => onInputChange('contactEmail', e.target.value)}
          required
        />
      </div>
      <FormField
        id="contactCompany"
        label="Company Name"
        type="text"
        value={formData.contactCompany}
        onChange={(e) => onInputChange('contactCompany', e.target.value)}
        required
      />
    </div>
  );
};

export default ContactForm;