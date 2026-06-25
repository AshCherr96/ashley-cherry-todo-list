import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  const login = async (userEmail, password) => {
    try {
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password }),
        credentials: 'include',
      };
      
      const res = await fetch('/api/users/logon', options);
      const data = await res.json();
      
      if (res.status === 200 && data.csrfToken) {
        // Prefer explicit email from the server, fallback to the submitted email or name
        const resolvedEmail = data.email || userEmail || data.name || '';
        setEmail(resolvedEmail);
        setToken(data.csrfToken);
        return { success: true };
      } else {
        return {
          success: false,
          error: `Authentication failed: ${data?.message || 'Invalid credentials'}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Network error during login',
      };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        const response = await fetch('/api/users/logoff', {
          method: 'POST',
          headers: { 
            'X-CSRF-TOKEN': token 
          },
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Server logoff rejected.');
      }
    } catch (error) {
      console.error('Network error during API logoff:', error);
    } finally {
      // Local authentication values are ALWAYS scrubbed even if the network route drops
      setEmail('');
      setToken('');
      
      return { success: true };
    }
  };

  const value = {
    email,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}