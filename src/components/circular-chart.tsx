import { Loader2, Target } from "lucide-react";
import { useState } from "react";
import { BsPieChart } from "react-icons/bs";
import { TbRadar } from "react-icons/tb";
import { PiSealWarningLight } from "react-icons/pi";

import { PieVariant } from "@/components/pie-variant";
import { RadarVariant } from "@/components/radar-variant";
import { RadialVariant } from "@/components/radial-variant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Props = {
  data?: {
    name: string;
    value: number;
    color?: string | null;
  }[];
};

const EMPTY_DATA: NonNullable<Props["data"]> = [];

export const CircularChart = ({ data = EMPTY_DATA }: Props) => {
  const [chartType, setChartType] = useState("pie");

  const onTypeChange = (type: string) => {
    setChartType(type);
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0">
        <CardTitle className="font-manrope line-clamp-1 text-xl lg:text-2xl">Categories</CardTitle>
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
          <SelectContent className="border md:border-2">
            <SelectItem
              value="pie"
              className="cursor-pointer data-[highlighted]:bg-teal-100/75 data-[highlighted]:text-teal-600"
            >
              <div className="flex items-center">
                <BsPieChart className="mr-2 size-4 shrink-0" />
                <p className="line-clamp-1">Pie Chart</p>
              </div>
            </SelectItem>
            <SelectItem
              value="radar"
              className="cursor-pointer data-[highlighted]:bg-teal-100/75 data-[highlighted]:text-teal-600"
            >
              <div className="flex items-center">
                <TbRadar className="mr-2 size-4 shrink-0" />
                <p className="line-clamp-1">Radar Chart</p>
              </div>
            </SelectItem>
            <SelectItem
              value="radial"
              className="cursor-pointer data-[highlighted]:bg-teal-100/75 data-[highlighted]:text-teal-600"
            >
              <div className="flex items-center">
                <Target className="mr-2 size-4 shrink-0" />
                <p className="line-clamp-1">Radial Chart</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[350px] w-full flex-col items-center justify-center gap-y-4">
            <PiSealWarningLight className="size-12 text-slate-300" />
            <p className="text-sm text-slate-400">No data for this period.</p>
          </div>
        ) : (
          <>
            {chartType === "pie" && <PieVariant data={data} />}
            {chartType === "radar" && <RadarVariant data={data} />}
            {chartType === "radial" && <RadialVariant data={data} />}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export const CircularChartLoading = () => {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0">
        <Skeleton className="h-6 w-24 lg:h-7 lg:w-32" />
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
