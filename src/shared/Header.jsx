import React from "react";
import { useAuth } from "../contexts/AuthContext";

function Header() {
  // Read auth values directly from context instead of props!
  const { isAuthenticated, logout, email } = useAuth();

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem', 
      borderBottom: '1px solid #ccc' 
    }}>
      <h1>Todo List</h1>
      
      {/* If the user is logged in, show their email and the Log Out button directly */}
      {isAuthenticated && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Welcome, <strong>{email}</strong></span>
          <button onClick={logout} style={{ cursor: 'pointer', padding: '0.25rem 0.5rem' }}>
            Log Out
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;