import { cva, VariantProps } from "class-variance-authority";
import { IconType } from "react-icons";

import { CountUp } from "@/components/count-up";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

interface DataCardProps extends BoxVariants, IconVariants {
  icon: IconType;
  title: string;
  value?: number;
  dateRange: string;
  percentageChange?: number;
}

export const DataCard = ({
  icon: Icon,
  title,
  value = 0,
  variant,
  dateRange,
  percentageChange = 0,
}: DataCardProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className="cursor-pointer border-none shadow-none"
            aria-label={`${title} data card showing ${formatCurrency(value)}`}
          >
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
            <CardContent>
              <h1 className="font-manrope mb-2 line-clamp-1 text-xl font-semibold break-all lg:text-2xl">
                <CountUp
                  preserveValue
                  start={0}
                  end={value}
                  decimals={2}
                  decimalPlaces={2}
                  formattingFn={formatCurrency}
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
        <TooltipContent>
          <p>
            Details for {title}: {formatCurrency(value)}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

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
