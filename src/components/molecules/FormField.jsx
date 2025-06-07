import React from 'react';
import Input from '@/components/atoms/Input';

const FormField = ({ id, label, type = 'text', value, onChange, placeholder = '', className = '', required = false, children }) => {
  const inputProps = {
    id,
    type,
    value,
    onChange,
    placeholder,
    className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all peer placeholder-transparent",
  };

  const labelClasses = "absolute left-4 -top-2.5 bg-gray-50 dark:bg-gray-700 px-2 text-sm text-gray-600 dark:text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary peer-focus:bg-gray-50 dark:peer-focus:bg-gray-700";

  return (
    <div className={`relative ${className}`}>
      {type === 'select' ? (
        <>
          <select
            id={id}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            required={required}
          >
            {children}
          </select>
          <label htmlFor={id} className="absolute left-4 -top-2.5 bg-gray-50 dark:bg-gray-700 px-2 text-sm text-gray-600 dark:text-gray-400">
            {label}{required && ' *'}
          </label>
        </>
      ) : (
        <>
          <Input {...inputProps} required={required} />
          <label htmlFor={id} className={labelClasses}>
            {label}{required && ' *'}
          </label>
        </>
      )}
    </div>
  );
};

export default FormField;