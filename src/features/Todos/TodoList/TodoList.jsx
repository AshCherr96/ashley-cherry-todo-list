import { useMemo } from 'react';
import TodoListItem from './TodoListItem.jsx';
// Import your master container style module object
import styles from './TodoList.module.css';

function TodoList({
  todoList = [],
  onCompleteTodo,
  onUpdateTodo,
  onDeleteTodo, // 🌟 1. ACCEPT THE NEW PROP HANDLER HERE
  dataVersion,
  sortBy = 'creationDate',
  sortDirection = 'desc',
  statusFilter = 'all',
}) {
  const filteredTodoList = useMemo(() => {
    const getSortValue = (todo) => {
      if (sortBy === 'title') {
        return (todo.title || '').toString().toLowerCase();
      }

      const creationValue = todo.creationDate ?? todo.createdAt ?? todo.created_at ?? todo.created;
      if (!creationValue) {
        return 0;
      }

      if (typeof creationValue === 'number') {
        return creationValue;
      }

      const parsed = Date.parse(creationValue);
      return Number.isNaN(parsed) ? 0 : parsed;
    };

    let filteredTodos;
    switch (statusFilter) {
      case 'completed':
        filteredTodos = todoList.filter((todo) => todo.isCompleted);
        break;
      case 'active':
        filteredTodos = todoList.filter((todo) => !todo.isCompleted);
        break;
      case 'all':
      default:
        filteredTodos = todoList;
        break;
    }

    const sortedTodos = [...filteredTodos].sort((a, b) => {
      const aValue = getSortValue(a);
      const bValue = getSortValue(b);
      const direction = sortDirection === 'asc' ? 1 : -1;

      if (sortBy === 'title') {
        if (aValue < bValue) return -1 * direction;
        if (aValue > bValue) return 1 * direction;
        return 0;
      }

      return (aValue - bValue) * direction;
    });

    return {
      version: dataVersion,
      todos: sortedTodos,
    };
  }, [todoList, dataVersion, sortBy, sortDirection, statusFilter]);

  // Context-aware message when no tasks match the filter criteria
  const getEmptyMessage = () => {
    switch (statusFilter) {
      case 'completed':
        return 'No completed todos yet. Complete some tasks to see them here.';
      case 'active':
        return 'No active todos. Add a todo above to get started!';
      case 'all':
      default:
        return 'Your task list is empty. Add a todo above to get started!';
    }
  };

  // Styled Empty State Viewport Handler using the module styles
  if (filteredTodoList.todos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>{getEmptyMessage()}</p>
      </div>
    );
  }

  return (
    // Applied clean scannable list layout styles
    <ul className={styles.list}>
      {filteredTodoList.todos.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
          onDeleteTodo={onDeleteTodo} // 🌟 2. FORWARD IT DIRECTLY TO ROW ITEMS HERE
        />
      ))}
    </ul>
  );
}

export default TodoList;