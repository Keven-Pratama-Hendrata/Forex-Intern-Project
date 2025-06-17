import React from 'react';

const FormField = ({ 
  label, 
  type, 
  name, 
  placeholder, 
  value, 
  onChange, 
  autoComplete, 
  required = false,
  className = ''
}) => (
  <div className={`form-control w-full mb-6 space-y-1 ${className}`}>
    <label className="label">
      <span className="label-text font-medium">{label}</span>
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className="input input-bordered w-full rounded-full"
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      required={required}
    />
  </div>
);

export default FormField; 