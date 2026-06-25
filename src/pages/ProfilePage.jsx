import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function ProfilePage() {
  const { firstName, lastName, email, token } = useAuth();

  // Component state management variables
  const [todoStats, setTodoStats] = useState({ total: 0, completed: 0, active: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Key data fetching logic to retrieve stats from the proxy API
  useEffect(() => {
    async function fetchTodoStats() {
      if (!token) return;

      try {
        setLoading(true);
        setError('');

        const options = {
          method: 'GET',
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        };

        const response = await fetch('/api/tasks', options);

        if (response.status === 401) {
          throw new Error('Unauthorized');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }

        const responseData = await response.json();
        const todos = Array.isArray(responseData)
          ? responseData
          : responseData?.tasks || [];

        // Calculate stats based on the retrieved todo list data
        const total = todos.length;
        const completed = todos.filter((todo) => todo.isCompleted).length;
        const active = total - completed;

        setTodoStats({ total, completed, active });
      } catch (err) {
        setError(`Error loading statistics: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchTodoStats();
  }, [token]);

  // Dynamically calculate the completion rate percentage if there are tasks present
  const completionPercentage = todoStats.total > 0 
    ? Math.round((todoStats.completed / todoStats.total) * 100) 
    : 0;

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <h2>User Profile</h2>
      
      {/* User Account Information Section */}
      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h3>Account Details</h3>
        {/* Display the user's first and last name, or email as fallback */}
        <p><strong>Name:</strong> {firstName && lastName ? `${firstName} ${lastName}` : email}</p>
        <p><strong>Status:</strong> Active Account</p>
      </section>

      {/* Todo Statistics Dashboard Section */}
      <section>
        <h3>Your Todo Statistics</h3>
        
        {/* Conditional Rendering UI Blocks based on Fetch State */}
        {loading && (
          <p style={{ fontStyle: 'italic', color: '#666' }}>
            Loading your profile metrics...
          </p>
        )}

        {error && (
          <div style={{ backgroundColor: '#ffdddd', padding: '0.5rem', marginBottom: '1rem', borderLeft: '5px solid red', color: 'red' }}>
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Total Tasks:</strong> {todoStats.total}
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Active Tasks:</strong> {todoStats.active}
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Completed Tasks:</strong> {todoStats.completed}
              </li>
              {todoStats.total > 0 && (
                <li style={{ marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px dashed #ccc' }}>
                  <strong>Completion Rate:</strong> {completionPercentage}%
                </li>
              )}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
}

export default ProfilePage;