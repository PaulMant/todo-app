## Overview

This application is a task management tool built with a modern web stack, enabling users to manage their tasks efficiently. The app includes features like adding tasks, validating inputs, and persisting data using a custom context-based service. It leverages best practices in React development, including modular components, context management, and advanced form handling.

## Tech Stack

Frontend Framework: React with TypeScript

State Management: React Context API

Forms: React Hook Form with Shadcn for form styling

Styling: Tailwind CSS

Validation: Zod schema for runtime validation

## Key Features

Task Management: Add and persist tasks in local storage.
Form Validation: Input validation powered by React Hook Form and Zod.
Responsive Design: Fully responsive interface styled with Tailwind CSS.
Decoupled Persistence Layer: Use of TodoService interface for data operations, enabling easy extension or replacement of the data source.
Context-Based Architecture: Centralized state management using TodoServiceContext.
Error-Free TypeScript Implementation: Fully typed components and services for maintainable and bug-free development.
Application Structure

### Core Modules

Interface: TodoService

`export interface TodoService {
addTodo(task: string): Promise<void>;
getTodos(): Promise<Todo[]>;
deleteTodo(id: string): Promise<void>;
}`

Implementation: LocalStorageTodoService

`export class LocalStorageTodoService implements TodoService {
  addTodo(task: string): Promise<void> { ... }
  getTodos(): Promise<Todo[]> { ... }
  deleteTodo(id: string): Promise<void> { ... }
}`

Context
TodoServiceContext provides the TodoService implementation to the app.
Example usage:
`const { addTodo } = useTodoService();`

Forms
Built with React Hook Form and integrated with Shadcn components for enhanced styling and functionality.
Example schema:

````import * as z from "zod";

export const taskSchema = z.object({
  task: z.string().min(1, "Task cannot be empty"),
});```

Components
Form: Modular form structure with reusable components like Input, Button, and icons.
Task List: Displays tasks fetched from the service and handles user interactions.

### Customization

To replace the storage system:

Due to Dependency Injection, implementing the TodoService interface with the new storage system is very easy.
Update the TodoServiceProvider in TodoContext.tsx:

`const [todoService] = useState<TodoService>(new NewStorageTodoService());`
````
