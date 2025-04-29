import { clsx, type ClassValue } from "clsx";
import { format, eachDayOfInterval, isSameDay, subDays } from "date-fns";
import { twMerge } from "tailwind-merge";

/**
 * Combines variant class names using clsx and safely merges conflicting Tailwind CSS utilities.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes an integer-based milliunit financial value back into a standard standard float decimal.
 */
export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000;
}

/**
 * Converts a standard decimal currency float into an integer-based milliunit representation.
 */
export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000);
}

export const DEFAULT_CURRENCY = "USD";

/**
 * Formats a raw numeric balance string into a localized currency format matching the selected ISO code.
 */
export function formatCurrency(value: number, currency: string = DEFAULT_CURRENCY) {
  return Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(value);
}

/**
 * Isolates and extracts the distinct currency symbol literal configured for a specified ISO currency code string.
 */
export function getCurrencySymbol(currency: string = DEFAULT_CURRENCY) {
  return (
    Intl.NumberFormat(undefined, { style: "currency", currency })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value ?? currency
  );
}

/**
 * Discovers the standard fractional decimal digit layout specifications mapped to a given ISO currency system.
 */
export function getCurrencyFractionDigits(currency: string = DEFAULT_CURRENCY) {
  return Intl.NumberFormat(undefined, { style: "currency", currency }).resolvedOptions()
    .maximumFractionDigits;
}

/**
 * Computes the relative percentage rate change delta occurring across two historical financial variables.
 */
export function calculatePercentageChange(currentValue: number, previousValue: number) {
  if (previousValue === 0) {
    return previousValue === currentValue ? 0 : 100;
  }

  return ((currentValue - previousValue) / previousValue) * 100;
}

/**
 * Generates sequential empty calendar objects for calendar timeline slots that lack ledger transaction events.
 */
export function fillMissingDays(
  activeDays: { date: Date; income: number; expenses: number }[],
  startDate: Date,
  endDate: Date
) {
  if (activeDays.length === 0) {
    return [];
  }

  // Generates an array of every discrete 24-hour calendar timestamp boundary inside the range
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const filledDays = days.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day));

    if (found) {
      return found;
    } else {
      // Injects a localized fallback placeholder row when zero transaction matches exist for the specific date
      return { date: day, income: 0, expenses: 0 };
    }
  });
  return filledDays;
}

type Period = {
  from: string | Date | undefined;
  to: string | Date | undefined;
};

/**
 * Parses user filter inputs into readable date range indicator labels.
 */
export function formatDateRange(period: Period) {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  // Layout default if a valid starting date marker is missing
  if (!period.from) {
    return `${format(defaultFrom, "LLL dd")} - ${format(defaultTo, "LLL dd, y")}`;
  }

  // Layout presentation string variant combining two confirmed date parameters
  if (period.to) {
    return `${format(period.from, "LLL dd")} - ${format(period.to, "LLL dd, y")}`;
  }

  return format(period.from, "LLL dd, y");
}

// Global integer-level percent layout string formatting rules
const percentFormatter = new Intl.NumberFormat("en-PH", {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Formats a decimal multiplier into a standardized percent label string.
 */
export function formatPercentage(
  value: number,
  options: { addPrefix?: boolean } = {
    addPrefix: false,
  }
) {
  const result = percentFormatter.format(value / 100);

  if (options.addPrefix && value > 0) {
    return `+${result}`;
  }

  return result;
}
