"use client";

import { Todo } from "../models/types";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

const LOCAL_STORAGE_KEY = "todos";

type TodoContextType = {
  todos: Todo[];
  addTodo: (task: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  deleteAllTodos: () => void;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  useEffect(() => {
    const storedTodos = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (task: string) => {
    setTodos((prev) => [...prev, { id: Date.now(), task, completed: false }]);
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const deleteAllTodos = () => {
    setTodos([]);
  };

  return <TodoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo, deleteAllTodos }}>{children}</TodoContext.Provider>;
};

export const useTodoContext = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodoContext must be used within a TodoProvider");
  }
  return context;
};
