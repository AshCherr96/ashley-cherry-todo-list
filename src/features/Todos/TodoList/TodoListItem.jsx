import React, { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useEditableTitle } from '../../../hooks/useEditableTitle';
import TextInputWithLabel from '../../../shared/TextInputWithLabel';
import { isValidTodoTitle } from '../../../utils/todoValidation';
import styles from './TodoListItem.module.css';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo, onDeleteTodo }) {
  const [error, setError] = useState('');
  const { 
    isEditing, 
    workingTitle, 
    startEditing, 
    cancelEdit, 
    updateTitle, 
    finishEdit 
  } = useEditableTitle(todo.title);

  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select && inputRef.current.select();
    }
  }, [isEditing]);

  const handleUpdate = (event) => {
    event.preventDefault();
    if (!isEditing) return;
    setError('');

    // 1. INPUT VALIDATION
    if (!isValidTodoTitle(workingTitle)) {
      setError('Task title cannot be empty.');
      return;
    }

    // 2. SANITIZATION
    const sanitizedTitle = DOMPurify.sanitize(workingTitle.trim(), {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });

    if (!sanitizedTitle) {
      setError('Invalid input characters detected.');
      return;
    }

    // 3. EXECUTE UPDATE & CLOSE EDITOR
    // The update call is now inside this scope to trigger the network request
    onUpdateTodo({ 
      ...todo, 
      title: sanitizedTitle 
    });
    
    finishEdit(); 
  };

  const handleCancel = () => {
    setError('');
    cancelEdit();
  };

  return (
    <li className={styles.item}>
      <form onSubmit={handleUpdate} className={styles.todoForm}>
        {isEditing ? (
          <div className={styles.editLayout}>
            <div className={styles.inputWrapper}>
  <TextInputWithLabel 
    id={`edit-${todo.id}`}
    label="Edit Todo"
    value={workingTitle} 
    inputRef={inputRef}
    onChange={(e) => {
      updateTitle(e.target.value);
      if (error) setError('');
    }}
    error={error} 
    maxLength={120}
  />
</div>
            <div className={styles.actions}>
              <button 
                type="submit" 
                disabled={!isValidTodoTitle(workingTitle)}
                className={`${styles.btn} ${styles.saveBtn}`}
              >
                Update
              </button>
              <button 
                type="button" 
                onClick={handleCancel}
                className={`${styles.btn} ${styles.cancelBtn}`}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.displayLayout}>
            <div className={styles.todoContent}>
              <input 
                type="checkbox" 
                checked={todo.isCompleted} 
                onChange={() => onCompleteTodo(todo.id)} 
                className={styles.checkbox}
                id={`check-${todo.id}`}
              />
              <span className={`${styles.todoText} ${todo.isCompleted ? styles.completedText : ''}`}>
                {todo.title}
              </span>
            </div>
            
            <div className={styles.actions}>
              <button 
                type="button"
                onClick={() => startEditing(todo.title)} 
                className={styles.btn}
              >
                Edit
              </button>
              <button 
                type="button"
                onClick={() => onDeleteTodo && onDeleteTodo(todo.id)} 
                className={`${styles.btn} ${styles.deleteBtn}`}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;