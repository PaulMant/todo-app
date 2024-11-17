"use client";

import { Task } from "./Task";

export interface TodoService {
  getTodos(): Promise<Task[]>;
  addTodo(task: string): Promise<Task>;
  deleteTodo(id: number): Promise<void>;
  deleteAllTodos(): Promise<void>;
  updateTodo(id: number, updates: Partial<Task>): Promise<Task>;
  subscribe(callback: (todos: Task[]) => void): () => void;
}
