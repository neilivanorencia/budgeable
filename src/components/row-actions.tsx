"use client";

import { MoreHorizontal } from "lucide-react";
import { BsTrash } from "react-icons/bs";
import { SlPencil } from "react-icons/sl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
  confirmTitle: string;
  confirmMessage: string;
  triggerClassName?: string;
};

export const RowActions = ({
  onEdit,
  onDelete,
  disabled,
  confirmTitle,
  confirmMessage,
  triggerClassName = "size-8 p-0",
}: Props) => {
  const [ConfirmDialog, confirm] = useConfirm(confirmTitle, confirmMessage);

  const handleDelete = async () => {
    const confirmed = await confirm();

    if (confirmed) {
      onDelete();
    }
  };

  return (
    <div>
      <>
        <ConfirmDialog />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={triggerClassName}>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled={disabled} onClick={onEdit}>
              <SlPencil className="text-slate-800" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem disabled={disabled} onClick={handleDelete}>
              <BsTrash className="text-slate-800" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    </div>
  );
};
