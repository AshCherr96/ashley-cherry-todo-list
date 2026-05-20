import React, { useState, useRef } from 'react';
import { isValidTodoTitle } from '../../utils/todoValidation';
import TextInputWithLabel from '../../shared/TextInputWithLabel';

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');
  const inputRef = useRef();

  const handleAddTodo = (event) => {
    event.preventDefault();
    
    if (workingTodoTitle.trim()) {
      onAddTodo(workingTodoTitle);
      setWorkingTodoTitle(''); 
      inputRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleAddTodo}>
      {/* Updated elementId to id, and labelText to label */}
      <TextInputWithLabel 
        id="todoTitle" 
        label="Todo"
        inputRef={inputRef}
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
      />

      <button 
        type="submit" 
        disabled={!isValidTodoTitle(workingTodoTitle)} 
      >
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;