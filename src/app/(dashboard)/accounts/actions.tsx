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
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useConfirm } from "@/hooks/use-confirm";

type Props = {
  id: string;
};

export const Actions = ({ id }: Props) => {
  const { onOpen } = useOpenAccount();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "Deleting this account cannot be undone."
  );

  const deleteMutation = useDeleteAccount(id);
  const handleDelete = async () => {
    const confirmed = await confirm();

    if (confirmed) {
      deleteMutation.mutate();
    }
  };

  return (
    <div>
      <>
        <ConfirmDialog />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled={deleteMutation.isPending} onClick={() => onOpen(id)}>
              <SlPencil className="text-slate-800" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem disabled={deleteMutation.isPending} onClick={handleDelete}>
              <BsTrash className="text-slate-800" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    </div>
  );
};
