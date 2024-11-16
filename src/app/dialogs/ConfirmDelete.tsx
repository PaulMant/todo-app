import { Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

interface ConfirmDeleteDialogProps {
  onDelete: () => void;
  title?: string;
  description?: string;
  buttonText?: React.ReactNode;
}

export function ConfirmDeleteDialog({
  onDelete,
  buttonText = <Trash2 className="size-4 text-destructive" />,
  title = "Are you 100% sure ?",
  description = `This action will permanently delete this object.`,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{buttonText}</DialogTrigger>
      <DialogContent className="w-[90vw] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={onDelete} type="submit" variant="destructive" className="w-full sm:w-auto">
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
