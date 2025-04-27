import { BsTrash } from "react-icons/bs";

import { Button } from "@/components/ui/button";

const DEFAULT_DELETE_CLASSNAME =
  "transition-color w-full cursor-pointer border border-teal-500 text-teal-500 shadow-none duration-300 ease-in-out hover:bg-teal-50 hover:text-teal-600 md:border-2";

type Props = {
  id?: string;
  label: string;
  onDelete?: () => void;
  disabled?: boolean;
  deleteClassName?: string;
};

export const FormActions = ({ id, label, onDelete, disabled, deleteClassName }: Props) => {
  return (
    <div className={id ? "grid grid-cols-2 gap-x-2" : ""}>
      <Button
        className="transition-color w-full cursor-pointer bg-teal-500 shadow-none duration-300 ease-in-out hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-200/50"
        disabled={disabled}
      >
        {id ? "Save changes" : `Create ${label}`}
      </Button>

      {!!id && (
        <Button
          type="button"
          disabled={disabled}
          onClick={onDelete}
          variant="outline"
          className={deleteClassName ?? DEFAULT_DELETE_CLASSNAME}
        >
          <BsTrash className="size-4" />
          Delete {label}
        </Button>
      )}
    </div>
  );
};
