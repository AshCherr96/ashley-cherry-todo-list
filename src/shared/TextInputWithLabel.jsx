import React from 'react';

function TextInputWithLabel({ id, label, value, onChange, inputRef, error, ...props }) {
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
        // Visual indicator: red border when error exists
        style={error ? { borderColor: '#ef4444' } : {}}
      />
      {/* Renders the message ONLY when error has a value */}
      {error && (
        <p className="error-message" style={{ color: '#ef4444', fontSize: '0.825rem', marginTop: '0.25rem' }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default TextInputWithLabel;