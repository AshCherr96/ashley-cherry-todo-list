import React, { useMemo } from 'react'; 
import TodoItem from './TodoItem'; 

function TodoList({ todoList, dataVersion, onCompleteTodo, onUpdateTodo }) {
  
  const filteredTodoList = useMemo(() => {
    console.log(`Recalculating filtered todos (v${dataVersion})`);
    
    return {
      version: dataVersion,
      // Filter out completed tasks so only active todos show up
      todos: todoList.filter(todo => !todo.isCompleted)
    };
  }, [todoList, dataVersion]); // Triggers calculation only when data or version updates

  return (
    <ul>
      {filteredTodoList.todos.map((todo) => (
        <TodoItem 
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