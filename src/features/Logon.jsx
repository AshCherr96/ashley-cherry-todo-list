import React, { useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel'; 

// Removed the default '= () => {}' placeholders to match provided props exactly
function Logon({ onSetEmail, onSetToken }) {
  // Controlled form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Status and feedback states
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAuthError('');
    setIsLoggingOn(true);

    try {
      const response = await fetch('/api/users/logon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let errorMessage = 'Invalid email or password';
        try {
          const errorData = await response.json();
          if (errorData?.message) errorMessage = errorData.message;
        } catch (_) {
          errorMessage = response.statusText || errorMessage;
        }
        
        setAuthError(`Authentication failed: ${errorMessage}`);
        return; 
      }

      const data = await response.json();

      if (data.name && data.csrfToken) {
        onSetEmail(data.name);
        onSetToken(data.csrfToken);
      } else {
        setAuthError('Authentication failed: Missing token or user details from server.');
      }

    } catch (error) {
      setAuthError(`Error: ${error.name} | ${error.message}`);
    } finally {
      setIsLoggingOn(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h2>Log On</h2>
      
      {authError && (
        <p style={{ color: 'red', fontWeight: 'bold', marginBottom: '1rem' }}>
          {authError}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <TextInputWithLabel 
          id="loginEmail"
          label="Email Address:"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoggingOn}
        />

        <TextInputWithLabel 
          id="loginPassword"
          label="Password:"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoggingOn}
        />

        <button 
          type="submit" 
          disabled={isLoggingOn || !email || !password}
          style={{ width: '100%', padding: '0.75rem', cursor: 'pointer', marginTop: '1rem' }}
        >
          {isLoggingOn ? 'Logging in...' : 'Log On'}
        </button>
      </form>
    </div>
  );
}

export default Logon;