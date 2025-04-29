import { BsTrash } from "react-icons/bs";

import { Button } from "@/components/ui/button";

/**
 * Fallback style classes used to paint the delete button frame if no override is supplied.
 */
const DEFAULT_DELETE_CLASSNAME =
  "transition-color w-full cursor-pointer border border-teal-500 text-teal-500 shadow-none duration-300 ease-in-out hover:bg-teal-50 hover:text-teal-600 md:border-2";

/**
 * Configuration properties for the `FormActions` component.
 */
type Props = {
  id?: string;
  label: string;
  onDelete?: () => void;
  disabled?: boolean;
  deleteClassName?: string;
};

/**
 * Renders submission and optional deletion buttons styled for modal or page input forms.
 */
export const FormActions = ({ id, label, onDelete, disabled, deleteClassName }: Props) => {
  return (
    <div className={id ? "grid grid-cols-2 gap-x-2" : ""}>
      {/* Primary submission trigger that alternates copy text based on entity creation state */}
      <Button
        className="transition-color w-full cursor-pointer bg-teal-500 shadow-none duration-300 ease-in-out hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-200/50"
        disabled={disabled}
      >
        {id ? "Save changes" : `Create ${label}`}
      </Button>

      {/* Renders a localized destruction trigger if editing an existing entity record */}
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
