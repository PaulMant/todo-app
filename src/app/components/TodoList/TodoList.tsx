"use client";

import { ConfirmDeleteDialog } from "@/dialogs/ConfirmDelete";
import { useState } from "react";
import { useTodoContext } from "../../context/TodoContext";
import { Button } from "../ui/button";
import DeleteAllButton from "./DeleteAllButton";
import TodoItem from "./TodoItem";

interface TodoListProps {
  search: string;
}

const TodoList: React.FC<TodoListProps> = ({ search }) => {
  const { todos, toggleTodo, deleteTodo } = useTodoContext();
  const [selectedTodos, setSelectedTodos] = useState<Set<number>>(new Set());
  const [animatingTodos, setAnimatingTodos] = useState<{ [id: number]: boolean }>({});

  const filteredTodos = todos.filter((todo) => todo.task.toLowerCase().includes(search.toLowerCase()));

  const displayedTodos = [...filteredTodos].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  const handleToggle = (id: number) => {
    setAnimatingTodos((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      toggleTodo(id);
      setAnimatingTodos((prev) => ({ ...prev, [id]: false }));
    }, 300);
  };

  const handleSelect = (id: number, checked: boolean) => {
    setSelectedTodos((prev) => {
      const updated = new Set(prev);
      if (checked) {
        updated.add(id);
      } else {
        updated.delete(id);
      }
      return updated;
    });
  };

  const handleBatchDelete = () => {
    selectedTodos.forEach((id) => deleteTodo(id));
    setSelectedTodos(new Set());
  };

  if (todos.length === 0) {
    return (
      <div>
        <p className="text-center text-lg text-gray-500">You have no tasks yet. Start adding tasks using the input above!</p>
      </div>
    );
  }

  if (filteredTodos.length === 0) {
    return (
      <div>
        <p className="text-center text-lg text-gray-500">No tasks match your current filter.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        {selectedTodos.size > 0 && (
          <ConfirmDeleteDialog
            buttonText={
              <Button variant="outline" className="border-destructive hover:scale-110 transition-transform" title="Delete task">
                <span className="text-destructive">Deleted Selected</span>
              </Button>
            }
            title="Are you 100% sure?"
            description={`This action will permanently delete ${selectedTodos.size} task(s).`}
            onDelete={handleBatchDelete}
          />
        )}
        <DeleteAllButton />
      </div>

      <ul className="space-y-4 w-full max-h-[45vh] overflow-y-auto">
        {displayedTodos.map((todo) => (
          <div key={todo.id} className="flex items-center">
            <input
              type="checkbox"
              checked={selectedTodos.has(todo.id)}
              onChange={(e) => handleSelect(todo.id, e.target.checked)}
              className="mr-4"
            />
            <li
              key={todo.id}
              className={`flex w-full h-14 justify-between rounded-lg items-center px-4 border transition-all ${
                todo.completed ? "text-gray-500" : ""
              } ${animatingTodos[todo.id] ? "translate-y-4 opacity-50 duration-300" : "hover:shadow-lg"}`}>
              <TodoItem todo={todo} onToggle={() => handleToggle(todo.id)} />
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
