import React, { useMemo } from 'react';
import TodoListItem from './TodoListItem';

function TodoList({ todoList, dataVersion, onCompleteTodo, onUpdateTodo }) {
  
  // Memoized filtered list per performance optimization requirements
  const filteredTodoList = useMemo(() => {
    return {
      version: dataVersion,
      // Filter out completed tasks so only active todos show up
      todos: todoList.filter(todo => !todo.isCompleted)
    };
  }, [todoList, dataVersion]); // Triggers calculation only when data or version updates

  return (
    <ul>
      {filteredTodoList.todos.map((todo) => (
        <TodoListItem 
          key={todo.id} 
          todo={todo} 
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;