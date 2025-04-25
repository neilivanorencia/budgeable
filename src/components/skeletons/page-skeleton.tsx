import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const DashboardSkeleton = () => {
  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <div className="mb-6 grid grid-cols-1 gap-4 pb-2 md:grid-cols-3 md:gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="h-[192px] border-none shadow-none">
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
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
        <div className="col-span-1 lg:col-span-3 xl:col-span-4">
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
        </div>

        <div className="col-span-1 lg:col-span-3 xl:col-span-2">
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
        </div>
      </div>
    </div>
  );
};
