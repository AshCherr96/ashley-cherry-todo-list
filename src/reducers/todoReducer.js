export const TODO_ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  
  ADD_TODO_START: 'ADD_TODO_START',
  ADD_TODO_SUCCESS: 'ADD_TODO_SUCCESS',
  ADD_TODO_ERROR: 'ADD_TODO_ERROR',

  COMPLETE_TODO_START: 'COMPLETE_TODO_START',
  COMPLETE_TODO_SUCCESS: 'COMPLETE_TODO_SUCCESS',
  COMPLETE_TODO_ERROR: 'COMPLETE_TODO_ERROR',

  UPDATE_TODO_START: 'UPDATE_TODO_START',
  UPDATE_TODO_SUCCESS: 'UPDATE_TODO_SUCCESS',
  UPDATE_TODO_ERROR: 'UPDATE_TODO_ERROR',

  // 🌟 NEW DELETE ACTION TYPE KEYS MAPPED SECURELY BELOW
  DELETE_TODO_START: 'DELETE_TODO_START',
  DELETE_TODO_SUCCESS: 'DELETE_TODO_SUCCESS',
  DELETE_TODO_ERROR: 'DELETE_TODO_ERROR',

  SET_SORT: 'SET_SORT',
  SET_FILTER: 'SET_FILTER',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_FILTERS: 'RESET_FILTERS'
};

export const initialTodoState = {
  todoList: [],
  error: '',
  filterError: '',
  isTodoListLoading: true, 
  sortBy: 'creationDate',
  sortDirection: 'desc',
  filterTerm: '',
  dataVersion: 0,
};

export function todoReducer(state, action) {
  switch (action.type) {
    case TODO_ACTIONS.FETCH_START:
      return {
        ...state,
        isTodoListLoading: true,
        error: '',
        filterError: '',
      };
    case TODO_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        isTodoListLoading: false,
        todoList: action.payload.todos || [],
        filterError: '',
      };
    case TODO_ACTIONS.FETCH_ERROR:
      return {
        ...state,
        isTodoListLoading: false,
        error: !action.payload.isFilterError ? (action.payload.message || action.payload) : state.error,
        filterError: action.payload.isFilterError ? (action.payload.message || action.payload) : state.filterError,
      };

    case TODO_ACTIONS.ADD_TODO_START:
      return {
        ...state,
        todoList: [action.payload.placeholder, ...state.todoList],
      };
    case TODO_ACTIONS.ADD_TODO_SUCCESS:
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.payload.temporaryId ? action.payload.savedTask : todo
        ),
        dataVersion: state.dataVersion + 1,
      };
    case TODO_ACTIONS.ADD_TODO_ERROR:
      return {
        ...state,
        error: action.payload.message,
        todoList: state.todoList.filter((todo) => todo.id !== action.payload.temporaryId),
      };

    case TODO_ACTIONS.COMPLETE_TODO_START:
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.payload.id ? { ...todo, isCompleted: !todo.isCompleted } : todo
        ),
      };
    case TODO_ACTIONS.COMPLETE_TODO_SUCCESS:
      return {
        ...state,
        dataVersion: state.dataVersion + 1,
      };
    case TODO_ACTIONS.COMPLETE_TODO_ERROR:
      return {
        ...state,
        error: action.payload.message,
        todoList: state.todoList.map((todo) =>
          todo.id === action.payload.id ? action.payload.originalTodo : todo
        ),
      };

    case TODO_ACTIONS.UPDATE_TODO_START:
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.payload.editedTodo.id ? { ...todo, title: action.payload.editedTodo.title } : todo
        ),
      };
    case TODO_ACTIONS.UPDATE_TODO_SUCCESS:
      return {
        ...state,
        dataVersion: state.dataVersion + 1,
      };
    case TODO_ACTIONS.UPDATE_TODO_ERROR:
      return {
        ...state,
        error: action.payload.message,
        todoList: state.todoList.map((todo) =>
          todo.id === action.payload.id ? action.payload.originalTodo : todo
        ),
      };

    // 🌟 NEW OPTIMISTIC DELETE IMPLEMENTATION BLOCKS
    case TODO_ACTIONS.DELETE_TODO_START:
      return {
        ...state,
        // Immediately drop the item from local list tracking for instant UI confirmation
        todoList: state.todoList.filter((todo) => todo.id !== action.payload.id),
      };
    case TODO_ACTIONS.DELETE_TODO_SUCCESS:
      return {
        ...state,
        // Increment the cache key rendering version safely
        dataVersion: state.dataVersion + 1,
      };
    case TODO_ACTIONS.DELETE_TODO_ERROR:
      return {
        ...state,
        error: action.payload.message,
        // Gracefully restore the entire original object item if the cloud sync fails
        todoList: [action.payload.originalTodo, ...state.todoList],
      };

    case TODO_ACTIONS.SET_SORT:
      return {
        ...state,
        ...action.payload,
      };
    case TODO_ACTIONS.SET_FILTER:
      return {
        ...state,
        filterTerm: action.payload.filterTerm,
      };

    case TODO_ACTIONS.CLEAR_ERROR:
      if (action.payload?.isFilterError) {
        return { ...state, filterError: '' };
      }
      return { ...state, error: '', filterError: '' };

    case TODO_ACTIONS.RESET_FILTERS:
      return {
        ...state,
        filterTerm: '',
        sortBy: 'creationDate',
        sortDirection: 'desc',
        filterError: '',
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}