import React, { useState, useRef } from 'react'; // Import useState

function TodoForm({ onAddTodo }) {
  // Create the state variable.
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');
  const inputRef = useRef();

  const handleAddTodo = (event) => {
    event.preventDefault();
    
    // Use the state variable.
    if (workingTodoTitle.trim()) {
      onAddTodo(workingTodoTitle);
      setWorkingTodoTitle(''); 
      inputRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input 
        ref={inputRef}
        type="text" 
        id="todoTitle" 
        name="todoTitle" 
        placeholder="Todo text"
        // Connect input to state (The "Control" part) 
        value={workingTodoTitle} 
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
        required 
      />
      <button 
  type="submit" 
  disabled={!workingTodoTitle.trim()} // grey out the button if empty
>
  Add Todo
</button>
    </form>
  );
}

export default TodoForm;