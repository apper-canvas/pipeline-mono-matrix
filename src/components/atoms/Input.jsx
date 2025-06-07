import React from 'react';

const Input = ({ id, type, value, onChange, placeholder, className, disabled }) => {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
    />
  );
};

export default Input;