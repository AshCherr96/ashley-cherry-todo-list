import { useEditableTitle } from '../../hooks/useEditableTitle';
import TextInputWithLabel from '../../shared/TextInputWithLabel';
import { isValidTodoTitle } from '../../utils/todoValidation';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  // Replace multiple useStates with custom hook
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

    // Use logic provided by the hook to get the final title
    const finalTitle = finishEdit();
    onUpdateTodo({ ...todo, title: finalTitle });
  };

  return (
    <li>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel 
              value={workingTitle} 
              onChange={(e) => updateTitle(e.target.value)} 
              elementId={`edit-${todo.id}`}
              labelText="Edit Todo"
            />
            <button type="submit" disabled={!isValidTodoTitle(workingTitle)}>
              Update
            </button>
            <button type="button" onClick={cancelEdit}>
              Cancel
            </button>
          </>
        ) : (
          <span onClick={startEditing} style={{ cursor: 'pointer' }}>
            {todo.title}
          </span>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;