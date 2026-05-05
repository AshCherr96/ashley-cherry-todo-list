import React from 'react';


function TodoListItem({ todo, onCompleteTodo }) {
  return (
    <li>
      <input 
        type="checkbox" 
        checked={todo.isCompleted} 
        onChange={() => onCompleteTodo(todo.id)} 
      />
      {todo.title}
    </li>
  );
} // Add a checkbox to mark the todo as completed.
  
  

export default TodoListItem;