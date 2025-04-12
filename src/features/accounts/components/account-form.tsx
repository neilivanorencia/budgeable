import { useForm } from "react-hook-form";
import { BsTrash } from "react-icons/bs";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { accountsInsertSchema } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = accountsInsertSchema.pick({
  name: true,
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export const AccountForm = ({ id, defaultValues, onSubmit, onDelete, disabled }: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input
                  className="text-sm"
                  disabled={disabled}
                  placeholder="Enter account type name (e.g., Cash, Bank)"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className={id ? "grid grid-cols-2 gap-x-2" : ""}>
          <Button
            className="transition-color w-full cursor-pointer bg-teal-500 shadow-none duration-300 ease-in-out hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-200/50"
            disabled={disabled}
          >
            {id ? "Save changes" : "Create account"}
          </Button>

          {!!id && (
            <Button
              type="button"
              disabled={disabled}
              onClick={handleDelete}
              variant="outline"
              className="transition-color w-full cursor-pointer border-2 border-teal-500 text-teal-500 shadow-none duration-300 ease-in-out hover:bg-teal-50 hover:text-teal-600"
            >
              <BsTrash className="size-4" />
              Delete account
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
