import './App.css';
import React, { useState } from 'react'; // Import useState
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';


const todos = [
  { id: 1, title: 'Complete assignment' },
  { id: 2, title: 'Check class notes' },
  { id: 3, title: 'Submit PR' },
];

function App() {
  const [todoList, setTodoList] = useState(todos);

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm />
      <TodoList todoList={todoList} />
    </div>
  );
}

export default App;

