"use client";

import { CircleCheckBig, RotateCcw, Trash2 } from "lucide-react";
import { ConfirmDeleteDialog } from "../../../app/dialogs/ConfirmDelete";
import { Todo } from "../../models/types";
import { Button } from "../ui/button";
import { useState } from "react";
import { useTodoContext } from "../../context/TodoContext";

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
}

export default function TodoItem({ todo, onToggle }: TodoItemProps) {
  const { deleteTodo } = useTodoContext();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      deleteTodo(todo.id);
    }, 700);
  };

  return (
    <div className={`flex w-full items-center justify-between transition-all duration-700 ${isDeleting ? "scale-75 opacity-0" : ""}`}>
      <span className={`flex truncate max-w-[300px] ${todo.completed ? "line-through" : ""}`}>{todo.task}</span>
      <div className="flex gap-2">
        <Button
          onClick={onToggle}
          variant={todo.completed ? "outline" : "ghost"}
          className="hover:scale-110 transition-transform bg-transparent border-none"
          title={todo.completed ? "Mark as incomplete" : "Mark as complete"}>
          {todo.completed ? <RotateCcw className="size-4 bg-transparent" /> : <CircleCheckBig className="size-4 text-green-600" />}
        </Button>
        <ConfirmDeleteDialog
          buttonText={
            <Button variant="ghost" className="hover:scale-110 transition-transform" title="Delete task">
              <Trash2 className="size-4 text-destructive" />
            </Button>
          }
          title="Are you 100% sure?"
          description={`This action will permanently delete ${todo.task}.`}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
