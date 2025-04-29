import { cva, VariantProps } from "class-variance-authority";
import { IconType } from "react-icons";

import { CountUp } from "@/components/count-up";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/features/settings/hooks/use-currency";
import { cn, formatPercentage } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Styling configurations defining structural backgrounds for category icon wrapper frames.
 */
const boxVariants = cva("rounded-lg p-3 md:rounded-xl", {
  variants: {
    variant: {
      default: "bg-teal-500/20",
      success: "bg-emerald-500/20",
      warning: "bg-rose-500/20",
      danger: "bg-indigo-500/20",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/**
 * Styling configurations determining vector fill fills for custom layout metrics.
 */
const iconVariants = cva("size-6", {
  variants: {
    variant: {
      default: "fill-teal-500",
      success: "fill-emerald-500",
      warning: "fill-rose-500",
      danger: "fill-indigo-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type BoxVariants = VariantProps<typeof boxVariants>;
type IconVariants = VariantProps<typeof iconVariants>;

/**
 * Properties required to configure data points and color states inside metrics cards.
 */
interface DataCardProps extends BoxVariants, IconVariants {
  icon: IconType;
  title: string;
  value?: number;
  dateRange: string;
  percentageChange?: number;
}

/**
 * A summary component displaying numeric metrics alongside localized percent trends and descriptive tags.
 */
export const DataCard = ({
  icon: Icon,
  title,
  value = 0,
  variant,
  dateRange,
  percentageChange = 0,
}: DataCardProps) => {
  // Extracts currency formatting handlers tailored to match active user localization options.
  const { format } = useCurrency();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className="cursor-pointer border-none shadow-none"
            aria-label={`${title} data card showing ${format(value)}`}
          >
            {/* Header section presenting card title structures alongside context metadata ranges */}
            <CardHeader className="flex flex-row items-center justify-between gap-x-4">
              <div className="space-y-2">
                <CardTitle className="font-manrope line-clamp-1 text-xl lg:text-2xl">
                  {title}
                </CardTitle>
                <CardDescription className="line-clamp-1 text-xs sm:text-sm">
                  {dateRange}
                </CardDescription>
              </div>
              <div className={cn("shrink-0", boxVariants({ variant }))}>
                <Icon className={cn(iconVariants({ variant }))} />
              </div>
            </CardHeader>

            {/* Inner frame containing dynamically mounting counter values and percent vector tags */}
            <CardContent>
              <h1 className="font-manrope mb-2 line-clamp-1 text-xl font-semibold break-all lg:text-2xl">
                <CountUp
                  preserveValue
                  start={0}
                  end={value}
                  decimals={2}
                  decimalPlaces={2}
                  formattingFn={format}
                />
              </h1>
              <p
                className={cn(
                  "text-muted-foreground line-clamp-1 text-xs sm:text-sm",
                  percentageChange > 0 && "text-emerald-500",
                  percentageChange < 0 && "text-rose-500"
                )}
              >
                {percentageChange > 0 ? "↑ " : percentageChange < 0 ? "↓ " : ""}
                {formatPercentage(percentageChange)} from last period
              </p>
            </CardContent>
          </Card>
        </TooltipTrigger>

        {/* Hover overlay explaining detailed textual evaluations to support visibility requirements */}
        <TooltipContent>
          <p>
            Details for {title}: {format(value)}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

/**
 * Renders a fallback skeleton framework component used during async metric computation phases.
 */
export const DataCardLoading = () => {
  return (
    <Card className="h-[192px] border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24 lg:h-7 lg:w-28" />
          <Skeleton className="h-4 w-40 sm:h-[14px]" />
        </div>
        <div className="shrink-0 rounded-xl bg-slate-100 p-3">
          <Skeleton className="size-6" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-2 h-6 w-24 shrink-0 lg:h-7 lg:w-28" />
        <Skeleton className="h-4 w-40 shrink-0 sm:h-[14px]" />
      </CardContent>
    </Card>
  );
};
