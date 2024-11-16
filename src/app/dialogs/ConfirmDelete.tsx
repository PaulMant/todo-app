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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={onDelete} type="submit" variant="destructive">
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
