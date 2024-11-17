# Access the Application

this application is accessible online, hosted by vercel:
https://swift-tasks-manager-e0mdqhlx3-paulmants-projects.vercel.app/

If you prefer a local testing:

`git clone git@github.com:PaulMant/todo-app.git`

`cd todo-app`

`npm ci`

`npm run dev`

## Overview

This application is a task management application built with a modern web tools. The app includes features like adding tasks, validating inputs, and persisting data using a custom context-based service. It leverages best practices in React development, including modular components, context management, and form handling.

## Tech Stack

Frontend Framework: React with TypeScript
State Management: React Context API
Forms: React Hook Form with Shadcn for form styling
Styling: Tailwind CSS and Shadcn/ui, Lucide for icons
Validation: Zod schema for runtime validation

## Key Features

- Task Management: Add and persist tasks in local storage.
- Form Validation: Input validation powered by React Hook Form and Zod.
- Responsive Design: Fully responsive interface styled with Tailwind CSS.
- Decoupled Persistence Layer: Use of TodoService interface for data operations, enabling easy extension or replacement of the data source.
- Context-Based Architecture: Centralized state management using TodoServiceContext.
- Error-Free TypeScript Implementation: Fully typed components and services.
-

## Application Structure

Interface: TodoService

```
    export interface TodoService {
        addTodo(task: string): Promise<void>;
        getTodos(): Promise<Todo[]>;
        deleteTodo(id: string): Promise<void>;
    }
```

Implementation: LocalStorageTodoService

```
export class LocalStorageTodoService implements TodoService {
  addTodo(task: string): Promise<void> { ... }
  getTodos(): Promise<Todo[]> { ... }
  deleteTodo(id: string): Promise<void> { ... }
}
```

Context
TodoServiceContext provides the TodoService implementation to the app.
Example usage:
`const { addTodo } = useTodoService();`

### Customization

To seamlessly replace the storage system:

Due to Dependency Injection, implementing the TodoService interface with a new storage system is very easy.
Update the TodoServiceProvider in TodoContext.tsx:

`const [todoService] = useState<TodoService>(new NewStorageTodoService());`
