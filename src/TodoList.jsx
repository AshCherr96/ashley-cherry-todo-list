import React from 'react';
import TodoListItem from './TodoListItem.jsx'; 


function TodoList({ todoList, onCompleteTodo }) {
  // Create a filtered list that only includes items where isCompleted is false
  const filteredTodoList = todoList.filter(todo => !todo.isCompleted);

  return (
    <>
      {/* filtered list length */}
      {filteredTodoList.length === 0 ? (
        <p>Add todo above to get started</p>
      ) : (
        <ul>
          {/* Map through filteredTodoList instead of todoList */}
          {filteredTodoList.map((todo) => (
            <TodoListItem 
              key={todo.id} 
              todo={todo} 
              onCompleteTodo={onCompleteTodo} 
            />
          ))}
        </ul>
      )}
    </>
  );
}

export default TodoList;