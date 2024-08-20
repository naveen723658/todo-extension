import React, { useState, useEffect } from 'react';
import './App.css';

interface Todo {
  text: string;
}


export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const localTodos = JSON.parse(localStorage.getItem('todos') || '[]') as Todo[];
    setTodos(localTodos);

    window.addEventListener('message', (event) => {
      if (event.data.type === 'FROM_EXTENSION' && event.data.todos) {
        const formattedTodos = event.data.todos.map((todo: any) =>
          typeof todo === 'string' ? { text: todo } : todo
        );
        console.log('Received todos from extension:', formattedTodos);
        setTodos(formattedTodos);
        localStorage.setItem('todos', JSON.stringify(formattedTodos));
      }
    });

    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({ message: 'GET_TODOS' }, (response) => {
        if (response.todos) {
          const formattedTodos = response.todos.map((todo: any) =>
            typeof todo === 'string' ? { text: todo } : todo
          );
          setTodos(formattedTodos);
          localStorage.setItem('todos', JSON.stringify(formattedTodos));
        }
      });
    }
  }, []);


  const addTodo = (todoText: string) => {
    const newTodos = [...todos, { text: todoText }];
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));

    // Broadcast the change to the extension
    window.postMessage({ type: 'SYNC_TODOS', todos: newTodos }, '*');
  };

  const deleteTodo = (todoText: string) => {
    const newTodos = todos.filter(todo => todo.text !== todoText);
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));

    // Broadcast the change to the extension
    window.postMessage({ type: 'DELETE_TODO', todoText }, '*');
  };

  return (
    <div className="bg-black w-screen h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Todo List</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = (e.target as HTMLFormElement).elements.namedItem('todoInput') as HTMLInputElement;
            if (input.value.trim()) {
              addTodo(input.value.trim());
              input.value = '';
            }
          }}
        >
          <input
            type="text"
            name="todoInput"
            placeholder="Enter a todo"
            className="w-full p-2 mb-4 border rounded"
          />
          <button id='submit' type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Add Todo
          </button>
        </form>
        <ul className="mt-4">
          {todos.map((todo, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-2 border-b"
            >
              <span>{todo.text}</span>
              <button
                id='delete'
                onClick={(e) => (
                  e.preventDefault(),
                  deleteTodo(todo.text)
                )
                }
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
