import React from 'react';
import { Routes, Route } from 'react-router';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import TodosPage from './pages/TodosPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Component & Layout Imports
import RequireAuth from './components/RequireAuth';
import Header from './shared/Header';

// CSS Module Import for Portfolio Layout Polish
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.appContainer}>
      {/* Persistent App Header Layout */}
      <Header />
      
      {/* Card Wrapper encompassing page transitions */}
      <div className={styles.card}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes wrapped with RequireAuth */}
          <Route
            path="/todos"
            element={
              <RequireAuth>
                <TodosPage />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
          
          {/* Catch-all Fallback (404 Page) */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;