import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList/TodoList';

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  // Fetch database records on mount
  useEffect(() => {
    if (!token) return;

    const fetchTodos = async () => {
      setIsTodoListLoading(true);
      setError('');
      
      try {
        const response = await fetch('/api/tasks', {
          method: 'GET',
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        });

        if (response.status === 401) {
          throw new Error('Unauthorized access. Please log back in.');
        }
        if (!response.ok) {
          throw new Error('Failed to retrieve task records from server.');
        }

        const data = await response.json();
        setTodoList(data.tasks || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsTodoListLoading(false);
      }
    };

    fetchTodos();
  }, [token]);

  const clearError = () => setError('');

  // OPTIMISTIC ADD ACTION
  const addTodo = async (todoTitle) => {
    const temporaryId = Date.now();
    const newTodoPlaceholder = {
      id: temporaryId,
      title: todoTitle,
      isCompleted: false,
    };

    setTodoList((prevList) => [newTodoPlaceholder, ...prevList]);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({ title: todoTitle, isCompleted: false }),
      });

      if (!response.ok) throw new Error('Could not sync new todo to server.');

      const savedTask = await response.json();
      
      setTodoList((prevList) =>
        prevList.map((todo) => (todo.id === temporaryId ? savedTask : todo))
      );
    } catch (err) {
      setError(`Add Failed: ${err.message}`);
      setTodoList((prevList) => prevList.filter((todo) => todo.id !== temporaryId));
    }
  };

  // OPTIMISTIC TOGGLE ACTION
  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);
    if (!originalTodo) return;

    setTodoList((prevList) =>
      prevList.map((todo) => (todo.id === id ? { ...todo, isCompleted: true } : todo))
    );

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({ 
          isCompleted: true,
          createdAt: originalTodo.createdAt 
        }),
      });

      if (!response.ok) throw new Error('Failed to update task status.');
    } catch (err) {
      setError(`Update Failed: ${err.message}`);
      setTodoList((prevList) =>
        prevList.map((todo) => (todo.id === id ? originalTodo : todo))
      );
    }
  };

  // OPTIMISTIC TITLE EDIT ACTION
  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    if (!originalTodo) return;

    setTodoList((prevList) =>
      prevList.map((todo) => (todo.id === editedTodo.id ? { ...todo, title: editedTodo.title } : todo))
    );

    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({ 
          title: editedTodo.title, 
          isCompleted: editedTodo.isCompleted,
          createdAt: originalTodo.createdAt
        }),
      });

      if (!response.ok) throw new Error('Could not modify task details.');
    } catch (err) {
      setError(`Edit Failed: ${err.message}`);
      setTodoList((prevList) =>
        prevList.map((todo) => (todo.id === editedTodo.id ? originalTodo : todo))
      );
    }
  };

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      {error && (
        <div style={{ backgroundColor: '#ffdddd', padding: '0.5rem', marginBottom: '1rem', borderLeft: '5px solid red' }}>
          <p style={{ display: 'inline-block', margin: 0, color: 'red' }}>{error}</p>
          <button onClick={clearError} style={{ float: 'right', cursor: 'pointer' }}>Clear Error</button>
          <div style={{ clear: 'both' }}></div>
        </div>
      )}

      {isTodoListLoading && <p style={{ fontStyle: 'italic', color: '#666' }}>Synchronizing cloud data records...</p>}

      <TodoForm onAddTodo={addTodo} />
      <TodoList 
        todoList={todoList} 
        onCompleteTodo={completeTodo} 
        onUpdateTodo={updateTodo} 
      />
    </main>
  );
}

export default TodosPage;