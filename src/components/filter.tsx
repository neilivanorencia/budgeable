import { AccountFilter } from "@/components/account-filter";
import { DateFilter } from "@/components/date-filter";

/**
 * Layout wrapper that groups ledger filtering components into a responsive configuration.
 */
export const Filter = () => {
  return (
    <div className="flex flex-col items-center gap-y-2 md:flex-row md:gap-x-2 md:gap-y-0">
      {/* Target input dropdown that handles financial account parameters */}
      <AccountFilter />

      {/* Calendar layout popover that updates time horizon query metrics */}
      <DateFilter />
    </div>
  );
};
