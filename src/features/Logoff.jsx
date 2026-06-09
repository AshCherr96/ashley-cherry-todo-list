import { useState } from 'react';
import { useNavigate } from 'react-router';  // Added Router v7 Import
import { useAuth } from '../contexts/AuthContext';

function Logoff() {
  const { logout } = useAuth();
  const navigate = useNavigate();  // Instantiated the programmatic hook
  const [isLoggingOff, setIsLoggingOff] = useState(false);
  const [error, setError] = useState('');
  
  async function handleLogoff() {
    setIsLoggingOff(true);
    setError('');

    const result = await logout();

    if (result.success) {
      navigate('/login');  // Redirects directly to logon after cleaning state
    } else {
      setError(result.error || 'Failed to log off');
      setIsLoggingOff(false);
    }
  }
  
  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleLogoff} disabled={isLoggingOff}>
        {isLoggingOff ? 'Logging out...' : 'Log Out'}
      </button>
    </div>
  );
}

export default Logoff;