import { FileSearch, Loader2 } from "lucide-react";
import { useState } from "react";
import { HiMiniChartBar } from "react-icons/hi2";
import { PiChartLineUpBold } from "react-icons/pi";
import { TbChartAreaLineFilled } from "react-icons/tb";

import { AreaVariant } from "@/components/area-variant";
import { BarVariant } from "@/components/bar-variant";
import { LineVariant } from "@/components/line-variant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  data?: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

export const Chart = ({ data = [] }: Props) => {
  const [chartType, setChartType] = useState("area");

  const onTypeChange = (type: string) => {
    setChartType(type);
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0">
        <CardTitle className="font-manrope line-clamp-1 text-xl lg:text-2xl">
          Transactions
        </CardTitle>
        <Select defaultValue={chartType} onValueChange={onTypeChange}>
          <SelectTrigger
            className={cn(
              "h-10 cursor-pointer rounded-lg border-2 border-slate-200 bg-transparent text-sm transition duration-300 ease-in-out",
              "hover:border-teal-500",
              "focus:border-teal-500 focus:ring-0 focus:outline-none",
              "lg:w-auto"
            )}
          >
            <SelectValue placeholder="Chart Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              value="area"
              className="cursor-pointer data-[highlighted]:bg-teal-50 data-[highlighted]:text-teal-600"
            >
              <div className="flex items-center">
                <TbChartAreaLineFilled className="mr-2 size-4 shrink-0" />
                <p className="line-clamp-1">Area Chart</p>
              </div>
            </SelectItem>
            <SelectItem
              value="bar"
              className="cursor-pointer data-[highlighted]:bg-teal-50 data-[highlighted]:text-teal-600"
            >
              <div className="flex items-center">
                <HiMiniChartBar className="mr-2 size-4 shrink-0" />
                <p className="line-clamp-1">Bar Chart</p>
              </div>
            </SelectItem>
            <SelectItem
              value="line"
              className="cursor-pointer data-[highlighted]:bg-teal-50 data-[highlighted]:text-teal-600"
            >
              <div className="flex items-center">
                <PiChartLineUpBold className="mr-2 size-4 shrink-0" />
                <p className="line-clamp-1">Line Chart</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[350px] w-full flex-col items-center justify-center gap-y-4">
            <FileSearch className="text-muted-foreground size-6" />
            <p className="text-muted-foreground text-sm">No data for this period</p>
          </div>
        ) : (
          <>
            {chartType === "area" && <AreaVariant data={data} />}
            {chartType === "bar" && <BarVariant data={data} />}
            {chartType === "line" && <LineVariant data={data} />}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export const ChartLoading = () => {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0">
        <Skeleton className="h-6 w-32 lg:h-7 lg:w-40" />
        <Skeleton className="h-10 w-full rounded-[0.475rem] lg:w-[120px]" />
      </CardHeader>
      <CardContent>
        <div className="flex h-[350px] w-full items-center justify-center">
          <Loader2 className="size-6 animate-spin text-slate-300" />
        </div>
      </CardContent>
    </Card>
  );
};
