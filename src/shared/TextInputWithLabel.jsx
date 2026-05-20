import React from 'react';

function TextInputWithLabel({ id, label, value, onChange, inputRef, ...props }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        ref={inputRef} 
        {...props}
      />
    </div>
  );
}

export default TextInputWithLabel;