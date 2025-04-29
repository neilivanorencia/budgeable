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

/**
 * Configuration properties for the `RowActions` component.
 */
type Props = {
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
  confirmTitle: string;
  confirmMessage: string;
  triggerClassName?: string;
};

/**
 * A table row action dropdown menu providing standard edit and delete triggers.
 */
export const RowActions = ({
  onEdit,
  onDelete,
  disabled,
  confirmTitle,
  confirmMessage,
  triggerClassName = "size-8 p-0",
}: Props) => {
  // Instantiates safety modal alert configurations before running deletion callbacks.
  const [ConfirmDialog, confirm] = useConfirm(confirmTitle, confirmMessage);

  /**
   * Prompts the confirmation modal dialog before executing destructive record mutations.
   */
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

        {/* Dropdown overlay menu component framing inline row configuration targets */}
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
