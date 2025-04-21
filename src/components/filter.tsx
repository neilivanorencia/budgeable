import { AccountFilter } from "@/components/account-filter";
import { DateFilter } from "@/components/date-filter";

export const Filter = () => {
  return (
    <div className="flex flex-col items-center gap-y-2 md:flex-row md:gap-x-2 md:gap-y-0">
      <AccountFilter />
      <DateFilter />
    </div>
  );
};
