"use client";

import { AlignJustify, CircleCheckBig, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { ConfirmDeleteDialog } from "../../../app/dialogs/ConfirmDelete";
import { useTodoContext } from "../../context/TodoContext";
import { Task } from "../../models/Task";
import { Button } from "../ui/button";

interface TodoItemProps {
  todo: Task;
  onToggle: () => void;
}

export default function TodoItem({ todo, onToggle }: TodoItemProps) {
  const { deleteTodo } = useTodoContext();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      deleteTodo(todo.id);
      toast.success("Task deleted successfully!", {
        position: "bottom-right",
        autoClose: 2800,
      });
    }, 700);
  };

  return (
    <div className={`flex w-full items-center justify-between transition-all duration-700 ${isDeleting ? "scale-75 opacity-0" : ""}`}>
      <div className="flex items-center gap-2">
        <AlignJustify className="size-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
        <span title={todo.task} className={`flex flex-start truncate max-w-[300px] ${todo.completed ? "line-through" : ""}`}>
          {todo.task}
        </span>
      </div>
      <div className="flex" onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()}>
        <Button
          onClick={onToggle}
          variant={todo.completed ? "outline" : "ghost"}
          className="hover:scale-110 transition-transform bg-transparent border-none"
          title={todo.completed ? "Mark as incomplete" : "Mark as complete"}>
          {todo.completed ? (
            <RotateCcw className="size-4 bg-transparent text-seedext" />
          ) : (
            <CircleCheckBig className="size-4 text-seedext" />
          )}
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
