"use client";

import { AlignJustify } from "lucide-react";
import { Task } from "../../models/Task";

interface TodoItemProps {
  todo: Task;
}

export default function TodoItem({ todo }: TodoItemProps) {
  return (
    <div className="flex w-full items-center justify-between transition-all duration-700">
      <div className="flex items-center gap-2">
        <AlignJustify className="size-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
        <span title={todo.task} className={`flex flex-start truncate max-w-[300px] ${todo.completed ? "line-through" : ""}`}>
          {todo.task}
        </span>
      </div>
    </div>
  );
}
