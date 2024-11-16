"use client";

import { ConfirmDeleteDialog } from "../../../app/dialogs/ConfirmDelete";
import { useTodoContext } from "../../context/TodoContext";
import { Button } from "../ui/button";

const DeleteAllButton: React.FC = () => {
  const { deleteAllTodos } = useTodoContext();

  return (
    <ConfirmDeleteDialog
      buttonText={
        <Button variant="outline" className="border-destructive hover:scale-110 transition-transform">
          <span className="text-destructive">Delete all</span>
        </Button>
      }
      onDelete={deleteAllTodos}
      title="Delete all tasks?"
      description="This action will permanently delete all your tasks."
    />
  );
};

export default DeleteAllButton;
