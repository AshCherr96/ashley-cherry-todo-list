import React, { useEffect, useReducer } from 'react';
import { useSearchParams } from 'react-router-dom'; // React Router v7 hook
import { useAuth } from '../contexts/AuthContext'; 
import { todoReducer, initialTodoState, TODO_ACTIONS } from '../reducers/todoReducer';
import TodoForm from '../features/Todos/TodoForm';
import TodoList from '../features/Todos/TodoList/TodoList';
import SortBy from '../shared/SortBy';
import StatusFilter from '../shared/StatusFilter'; // URL status selector dropdown
import useDebounce from '../utils/useDebounce';
import FilterInput from '../shared/FilterInput';

function TodosPage() {
  const { token } = useAuth(); // Access auth token from context for API requests
  const [searchParams] = useSearchParams(); // Hook to listen to changes in query parameters

  // Single useReducer orchestrating consolidated app state
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);

  // Extract status filter string directly from URL string parameters, defaulting to 'all'
  const statusFilter = searchParams.get('status') || 'all';

  // Destructure internal parameters flatly to leave JSX markup fully operational
  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
  } = state;

  // useDebounce still tracking filterTerm changes seamlessly
  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  // Fetch database records on mount or query updates
  useEffect(() => {
    // If no token exists, immediately turn off the loading layout so forms can display
    if (!token) {
      dispatch({ type: TODO_ACTIONS.FETCH_SUCCESS, payload: { todos: [] } });
      return;
    }

    const fetchTodos = async () => {
      dispatch({ type: TODO_ACTIONS.FETCH_START });
      
      try {
        const paramsObject = { sortBy, sortDirection };
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

        const data = await response.json();
        dispatch({ type: TODO_ACTIONS.FETCH_SUCCESS, payload: { todos: data.tasks || [] } });
     } catch (err) {
        const isFilterMutation = !!(debouncedFilterTerm || sortBy !== 'creationDate' || sortDirection !== 'desc');
        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: {
            message: isFilterMutation ? `Error filtering/sorting todos: ${err.message}` : `Error fetching todos: ${err.message}`,
            isFilterError: isFilterMutation
          }
        });
      }
    };

    fetchTodos();
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  const handleFilterChange = (newTerm) => {
    dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: { filterTerm: newTerm } });
  };

  // OPTIMISTIC ADD ACTION
  const addTodo = async (todoTitle) => {
    const temporaryId = Date.now();
    const newTodoPlaceholder = {
      id: temporaryId,
      title: todoTitle,
      isCompleted: false,
    };

    dispatch({ type: TODO_ACTIONS.ADD_TODO_START, payload: { placeholder: newTodoPlaceholder } });

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
      dispatch({ type: TODO_ACTIONS.ADD_TODO_SUCCESS, payload: { temporaryId, savedTask } });
    } catch (err) {
      dispatch({ 
        type: TODO_ACTIONS.ADD_TODO_ERROR, 
        payload: { temporaryId, message: `Add Failed: ${err.message}` } 
      });
    }
  };

  // OPTIMISTIC TOGGLE ACTION 
  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);
    if (!originalTodo) return;

    dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_START, payload: { id } });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({ 
          title: originalTodo.title,
          isCompleted: !originalTodo.isCompleted,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        throw new Error(errorBody || 'Failed to update task status.');
      }
      dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS });
    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: { id, originalTodo, message: `Update Failed: ${err.message}` }
      });
    }
  };

  // OPTIMISTIC TITLE EDIT ACTION
  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    if (!originalTodo) return;

    dispatch({ type: TODO_ACTIONS.UPDATE_TODO_START, payload: { editedTodo } });

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
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        throw new Error(errorBody || 'Could not modify task details.');
      }
      dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS });
    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: { id: editedTodo.id, originalTodo, message: `Edit Failed: ${err.message}` }
      });
    }
  };

  // 🌟 NEW OPTIMISTIC DELETE ACTION
  const deleteTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);
    if (!originalTodo) return;

    // Use string type directly to avoid potential object mapping discrepancies
    dispatch({ type: 'DELETE_TODO_START', payload: { id } });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Could not delete task from server.');
      dispatch({ type: 'DELETE_TODO_SUCCESS' });
    } catch (err) {
      dispatch({
        type: 'DELETE_TODO_ERROR',
        payload: { id, originalTodo, message: `Delete Failed: ${err.message}` }
      });
    }
  };

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      {error && (
        <div style={{ backgroundColor: '#ffdddd', padding: '0.5rem', marginBottom: '1rem', borderLeft: '5px solid red' }}>
          <p style={{ display: 'inline-block', margin: 0, color: 'red' }}>{error}</p>
          <button 
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })} 
            style={{ float: 'right', cursor: 'pointer' }}
          >
            Clear Error
          </button>
          <div style={{ clear: 'both' }}></div>
        </div>
      )}

     {filterError && (
        <div style={{ backgroundColor: '#fff3cd', padding: '0.5rem', marginBottom: '1rem', borderLeft: '5px solid #ffc107' }}>
          <p style={{ margin: '0 0 0.5rem 0', color: '#856404' }}>{filterError}</p>
          
          <button 
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR, payload: { isFilterError: true } })} 
            style={{ marginRight: '0.5rem', cursor: 'pointer' }}
          >
            Clear Filter Error
          </button>
          
          <button 
            onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })} 
            style={{ cursor: 'pointer' }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {isTodoListLoading && <p style={{ fontStyle: 'italic', color: '#666' }}>Synchronizing cloud data records...</p>}

      <SortBy 
        sortBy={sortBy} 
        sortDirection={sortDirection} 
        onSortByChange={(newSortBy) => dispatch({ type: TODO_ACTIONS.SET_SORT, payload: { sortBy: newSortBy, sortDirection } })} 
        onSortDirectionChange={(newDir) => dispatch({ type: TODO_ACTIONS.SET_SORT, payload: { sortBy, sortDirection: newDir } })} 
      />

      <StatusFilter />

      <FilterInput 
        filterTerm={filterTerm} 
        onFilterChange={handleFilterChange} 
      />

      <TodoForm onAddTodo={addTodo} />
      
      {/* 🌟 PROPS FORWARDED TO LIST VIEW LINK UNBLOCKED BELOW */}
      <TodoList 
        todoList={todoList} 
        dataVersion={dataVersion}
        sortBy={sortBy}
        sortDirection={sortDirection}
        statusFilter={statusFilter}
        onCompleteTodo={completeTodo} 
        onUpdateTodo={updateTodo} 
        onDeleteTodo={deleteTodo} 
      />
    </main>
  );
}

export default TodosPage;