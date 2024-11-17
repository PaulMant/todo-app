"use client";

import { TodoService } from "../models/TodoService";
import { Task } from "../models/Task";

export class LocalStorageTodoService implements TodoService {
  private STORAGE_KEY = "todos";
  private subscribers: ((todos: Task[]) => void)[] = [];

  constructor() {
    // Bind all methods to preserve 'this' context
    this.getTodos = this.getTodos.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.deleteAllTodos = this.deleteAllTodos.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }

  private notifySubscribers = async () => {
    const todos = await this.getTodos();
    this.subscribers.forEach((callback) => callback(todos));
  };

  subscribe(callback: (todos: Task[]) => void): () => void {
    this.subscribers.push(callback);
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  async getTodos(): Promise<Task[]> {
    const todos = localStorage.getItem(this.STORAGE_KEY);

    return todos ? JSON.parse(todos) : [];
  }

  async addTodo(task: string): Promise<Task> {
    const todos = await this.getTodos();

    const newTodo: Task = { id: Date.now(), task, completed: false };
    todos.unshift(newTodo);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    await this.notifySubscribers();

    return newTodo;
  }

  async deleteTodo(id: number): Promise<void> {
    const todos = await this.getTodos();
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedTodos));
    await this.notifySubscribers();
  }

  async deleteAllTodos(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
    await this.notifySubscribers();
  }

  async updateTodo(id: number, updates: Partial<Task>): Promise<Task> {
    const todos = await this.getTodos();
    const updatedTodos = todos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedTodos));
    await this.notifySubscribers();
    return updatedTodos.find((todo) => todo.id === id)!;
  }
}
