import React, { useState } from 'react';
import { useAuth } from "../contexts/AuthContext"; // Added import

function Logon() {
  const { login } = useAuth(); // Pull function from context
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    const result = await login(emailInput, passwordInput);
    if (!result.success) {
      setLoginError(result.error);
    }
  };

  return (
    <main style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h2>Log On</h2>
      {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email Address:</label>
          <input 
            type="email" 
            value={emailInput} 
            onChange={(e) => setEmailInput(e.target.value)} 
            required 
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
          <input 
            type="password" 
            value={passwordInput} 
            onChange={(e) => setPasswordInput(e.target.value)} 
            required 
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Log On</button>
      </form>
    </main>
  );
}

export default Logon;