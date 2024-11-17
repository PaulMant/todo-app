import { ConfirmDeleteDialog } from "../../dialogs/ConfirmDelete";
import { Button } from "../ui/button";
import DeleteAllButton from "./DeleteAllButton";

interface BatchActionsProps {
  selectedTodosCount: number;
  onBatchDelete: () => void;
}

const BatchActions: React.FC<BatchActionsProps> = ({ selectedTodosCount, onBatchDelete }) => {
  return (
    <div className="flex justify-end gap-2 mb-4">
      {selectedTodosCount > 0 && (
        <ConfirmDeleteDialog
          buttonText={
            <Button variant="outline" className="border-destructive hover:scale-110 transition-transform" title="Delete task">
              <span className="text-destructive">Delete Selected</span>
            </Button>
          }
          title="Are you 100% sure?"
          description={`This action will permanently delete ${selectedTodosCount} task(s).`}
          onDelete={onBatchDelete}
        />
      )}
      <DeleteAllButton />
    </div>
  );
};

export default BatchActions;
