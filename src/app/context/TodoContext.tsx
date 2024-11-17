"use client";

import { createContext, useContext, useState } from "react";
import { TodoService } from "../models/TodoService";
import { LocalStorageTodoService } from "../services/LocalStorageTodoService";

const TodoServiceContext = createContext<TodoService | undefined>(undefined);

export const TodoServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todoService] = useState<TodoService>(new LocalStorageTodoService());

  return <TodoServiceContext.Provider value={todoService}>{children}</TodoServiceContext.Provider>;
};

export const useTodoService = (): TodoService => {
  const context = useContext(TodoServiceContext);
  if (!context) {
    throw new Error("useTodoService must be used within a TodoServiceProvider");
  }
  return context;
};
