import React, { useState, useRef } from 'react';
import DOMPurify from 'dompurify';
import { isValidTodoTitle } from '../../utils/todoValidation';
import TextInputWithLabel from '../../shared/TextInputWithLabel';
import styles from './TodoForm.module.css';

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');
  const inputRef = useRef();

  const handleAddTodo = (event) => {
    event.preventDefault();
    
    // Run client-side validation FIRST before any sanitization step
    if (!isValidTodoTitle(workingTodoTitle)) return;

    // Sanitize user input using DOMPurify to strip out malicious XSS scripts/HTML tags
    const sanitizedTitle = DOMPurify.sanitize(workingTodoTitle.trim(), {
      ALLOWED_TAGS: [], // Remove all HTML tags completely
      ALLOWED_ATTR: []  // Remove all attributes completely
    });

    // Forward the sanitized string if it contains valid characters
    if (sanitizedTitle.length > 0) {
      onAddTodo(sanitizedTitle);
      setWorkingTodoTitle(''); 
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <form onSubmit={handleAddTodo} className={styles.form}>
      <div className={styles.inputGroup}>
        <TextInputWithLabel 
          id="todoTitle" 
          label="Todo"
          inputRef={inputRef}
          value={workingTodoTitle}
          onChange={(event) => setWorkingTodoTitle(event.target.value)}
          className={styles.input}
          maxLength={120} // 3. Maximum length limit constraint to prevent layout distortion
          placeholder="What needs to be done?"
        />
      </div>

      <button 
        type="submit" 
        disabled={!isValidTodoTitle(workingTodoTitle)} 
        className={styles.submitBtn}
      >
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;