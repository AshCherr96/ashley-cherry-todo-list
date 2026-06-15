import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Navigation from './Navigation';
import Logoff from '../features/Logoff'; 

function Header() {
  const { isAuthenticated, email } = useAuth();

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem', 
      borderBottom: '1px solid #ccc' 
    }}>
      <h1>Todo List</h1>
      
      {/* 1. Integrated the Navigation menu between the title and auth actions */}
      <Navigation />
      
      {/* 2. Simplified the auth display to use the managed Logoff component */}
      {isAuthenticated && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Welcome, <strong>{email}</strong></span>
          <Logoff />
        </div>
      )}
    </header>
  );
}

export default Header;