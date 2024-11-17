"use client";

import { ConfirmDeleteDialog } from "../../../app/dialogs/ConfirmDelete";
import { useTodoService } from "../../context/TodoContext";
import { Button } from "../ui/button";

interface DeleteAllButtonProps {
  onDeleteAll: () => void;
}

const DeleteAllButton: React.FC<DeleteAllButtonProps> = ({ onDeleteAll }) => {
  const todoService = useTodoService();

  const handleDeleteAll = async () => {
    await todoService.deleteAllTodos();
    onDeleteAll();
  };

  return (
    <ConfirmDeleteDialog
      buttonText={
        <Button variant="outline" className="border-destructive hover:scale-110 transition-transform">
          <span className="text-destructive">Delete all</span>
        </Button>
      }
      onDelete={handleDeleteAll}
      title="Delete all tasks?"
      description="This action will permanently delete all your tasks."
    />
  );
};

export default DeleteAllButton;
