import React, { useState } from 'react';
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

  const handleUpdate = (event) => {
    event.preventDefault();
    if (!isEditing) return;
    setError('');

    // 1. INPUT VALIDATION RUNS FIRST
    if (!isValidTodoTitle(workingTitle)) {
      setError('Task title cannot be empty.');
      return;
    }

    // 2. SANITIZATION WITH DOMPURIFY
    const sanitizedTitle = DOMPurify.sanitize(workingTitle.trim(), {
      ALLOWED_TAGS: [], // Remove all HTML tags completely
      ALLOWED_ATTR: []  // Remove all attributes completely
    });

    // 3. SECURE ERROR MESSAGING
    if (!sanitizedTitle) {
      setError('Invalid input characters detected.');
      return;
    }

    const finalTitle = finishEdit();
    onUpdateTodo({ ...todo, title: sanitizedTitle });
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
                onChange={(e) => {
                  updateTitle(e.target.value);
                  if (error) setError('');
                }}
                maxLength={120} // 4. MAXIMUM LENGTH LIMIT
              />
              {error && <p className={styles.errorMessage} style={{ color: 'var(--error, #ef4444)', fontSize: '0.825rem', marginTop: '0.25rem' }}>{error}</p>}
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
              <span 
                onClick={startEditing}
                className={`${styles.todoText} ${todo.isCompleted ? styles.completedText : ''}`}
                style={{ cursor: 'pointer' }}
              >
                {todo.title}
              </span>
            </div>
            
            <div className={styles.actions}>
              <button 
                type="button"
                onClick={startEditing} 
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