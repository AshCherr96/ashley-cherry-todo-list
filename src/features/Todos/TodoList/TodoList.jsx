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
  statusFilter = 'all',
}) {
  const filteredTodoList = useMemo(() => {
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

    return {
      version: dataVersion,
      todos: filteredTodos,
    };
  }, [todoList, dataVersion, statusFilter]);

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