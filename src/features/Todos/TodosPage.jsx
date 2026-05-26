import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList/TodoList';
import SortBy from '../../shared/SortBy';
import useDebounce from '../utils/useDebounce';
import FilterInput from '../shared/FilterInput';

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);
  const [sortBy, setSortBy] = useState('creationDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterTerm, setFilterTerm] = useState('');
  const debouncedFilterTerm = useDebounce(filterTerm, 300);
  const [dataVersion, setDataVersion] = useState(0);
  const [filterError, setFilterError] = useState('');
  const invalidateCache = useCallback(() => {
    console.log("Invalidating memo cache after todo mutation");
    setDataVersion(prev => prev + 1);
  }, []);

  // Fetch database records on mount
  useEffect(() => {
    if (!token) return;

    const fetchTodos = async () => {
      setIsTodoListLoading(true);
      setError('');
      
      // Build query parameters for sorting
      try {
        const paramsObject = {
          sortBy,
          sortDirection,
        };

        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm;
        }

        const params = new URLSearchParams(paramsObject);

        const response = await fetch(`/api/tasks?${params}`, {
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

        // If the response is successful, clear any previous filter errors and update the todo list state
        const data = await response.json();
        setTodoList(data.tasks || []);
        setFilterError('');
     } catch (err) {
        if (debouncedFilterTerm || sortBy !== 'creationDate' || sortDirection !== 'desc') {
          setFilterError(`Error filtering/sorting todos: ${err.message}`);
        } else {
          setError(`Error fetching todos: ${err.message}`);
        }
      } finally {
        setIsTodoListLoading(false);
      }
    };

    fetchTodos();
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  const handleFilterChange = (newTerm) => {
    setFilterTerm(newTerm);
  };

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
      invalidateCache();
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
      invalidateCache();
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
      invalidateCache();
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

     {filterError && (
        <div style={{ backgroundColor: '#fff3cd', padding: '0.5rem', marginBottom: '1rem', borderLeft: '5px solid #ffc107' }}>
          <p style={{ margin: '0 0 0.5rem 0', color: '#856404' }}>{filterError}</p>
          
          <button 
            onClick={() => setFilterError('')} 
            style={{ marginRight: '0.5rem', cursor: 'pointer' }}
          >
            Clear Filter Error
          </button>
          
          <button 
            onClick={() => {
              setFilterTerm('');
              setSortBy('creationDate');
              setSortDirection('desc');
              setFilterError('');
            }} 
            style={{ cursor: 'pointer' }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {isTodoListLoading && <p style={{ fontStyle: 'italic', color: '#666' }}>Synchronizing cloud data records...</p>}

      {/* Added SortBy component with necessary props for sorting functionality */}
      <SortBy 
        sortBy={sortBy} 
        sortDirection={sortDirection} 
        onSortByChange={setSortBy} 
        onSortDirectionChange={setSortDirection} 
      />

      {/* Added FilterInput component with props for managing filter term state */}
      <FilterInput 
        filterTerm={filterTerm} 
        onFilterChange={handleFilterChange} 
      />

      <TodoForm onAddTodo={addTodo} />
      {/* Passed dataVersion as a prop to TodoList to trigger re-memoization when it changes */}
      <TodoList 
        todoList={todoList} 
        dataVersion={dataVersion}
        onCompleteTodo={completeTodo} 
        onUpdateTodo={updateTodo} 
      />
    </main>
  );
}

export default TodosPage;