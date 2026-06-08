import React from 'react';
import Header from './shared/Header';
import Logon from './features/Logon';
import TodosPage from './features/Todos/TodosPage';
import { useAuth } from "./contexts/AuthContext"; // Added context subscription

function App() {
  const { isAuthenticated } = useAuth(); 
  return (
    <div className="app-container">
      <Header />
      {isAuthenticated ? <TodosPage /> : <Logon />}
    </div>
  );
}

export default App;

