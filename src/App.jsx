import React, { useState } from 'react';
import Header from './shared/Header';
import TodosPage from './features/Todos/TodosPage';
import Logon from './features/Logon'; // Make sure this is imported

function App() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  return (
    <div>
      {/* Header stays at the top, passing auth props down */}
      <Header token={token} onSetToken={setToken} onSetEmail={setEmail} />
      
      {/* CONDITIONAL RENDERING: Only show todos if we have a token */}
      {token ? (
        <TodosPage token={token} />
      ) : (
        <Logon onSetEmail={setEmail} onSetToken={setToken} />
      )}
    </div>
  );
}

export default App;

