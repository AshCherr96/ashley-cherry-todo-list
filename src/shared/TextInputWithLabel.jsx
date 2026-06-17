import React from 'react';

function TextInputWithLabel({ id, label, value, onChange, inputRef, error, ...props }) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input 
        id={id} 
        type="text" 
        value={value} 
        onChange={onChange} 
        ref={inputRef} 
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={errorId}
        {...props} 
        // Visual indicator: red border when error exists
        style={error ? { borderColor: '#ef4444' } : {}}
      />
      {/* Renders the message ONLY when error has a value */}
      {error && (
        <p id={errorId} className="error-message" style={{ color: '#ef4444', fontSize: '0.825rem', marginTop: '0.25rem' }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default TextInputWithLabel;