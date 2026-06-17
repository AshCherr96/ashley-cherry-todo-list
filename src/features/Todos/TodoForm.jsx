import React, { useState, useRef } from 'react';
import DOMPurify from 'dompurify';
import { isValidTodoTitle } from '../../utils/todoValidation';
import TextInputWithLabel from '../../shared/TextInputWithLabel';
import styles from './TodoForm.module.css';

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef();

  const handleAddTodo = (event) => {
    event.preventDefault();
    const trimmedTitle = workingTodoTitle.trim();

    if (!isValidTodoTitle(trimmedTitle)) {
      setError('Please type a todo before adding.');
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }

    const sanitizedTitle = DOMPurify.sanitize(trimmedTitle, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });

    if (sanitizedTitle.length > 0) {
      onAddTodo(sanitizedTitle);
      setWorkingTodoTitle('');
      setError('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleBlur = () => {
    if (!isValidTodoTitle(workingTodoTitle.trim())) {
      setError('Please type a todo before adding.');
    }
  };

  return (
    <form onSubmit={handleAddTodo} className={styles.form} noValidate>
      <div className={styles.inputGroup}>
        <TextInputWithLabel 
          id="todoTitle" 
          label="Todo"
          inputRef={inputRef}
          value={workingTodoTitle}
          onChange={(event) => {
            setWorkingTodoTitle(event.target.value);
            if (error) setError('');
          }}
          onBlur={handleBlur}
          error={error}
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