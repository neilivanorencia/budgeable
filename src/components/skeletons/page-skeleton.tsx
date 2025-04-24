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

export const TransactionsSkeleton = () => {
  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <Card className="border-none shadow-none drop-shadow-none">
        <CardHeader className="flex flex-col items-center gap-y-2 md:flex-row md:items-center md:justify-between">
          <Skeleton className="h-6 w-48 lg:h-7 lg:w-56" />
          <div className="flex w-full items-center justify-end gap-x-2 md:w-auto">
            <Skeleton className="h-10 w-[calc(50%-0.25rem)] rounded-[0.475rem] md:w-24" />
            <Skeleton className="h-10 w-[calc(50%-0.25rem)] rounded-[0.475rem] md:w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-y-2 py-4 sm:flex-row sm:items-center">
            <Skeleton className="h-10 w-full rounded-[0.475rem] sm:max-w-sm" />
          </div>

          <div className="rounded-md border"></div>

          <div className="flex flex-col-reverse gap-y-2 py-4 sm:flex-row sm:items-center sm:justify-end sm:space-x-2">
            <Skeleton className="mt-4 h-4 w-48 sm:mt-0" />
            <div className="grid w-full grid-cols-2 gap-x-2 sm:flex sm:w-auto sm:justify-end">
              <Skeleton className="h-8 w-full rounded-[0.475rem] sm:w-20" />
              <Skeleton className="h-8 w-full rounded-[0.475rem] sm:w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const AccountsSkeleton = () => {
  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <Card className="border-none shadow-none drop-shadow-none">
        <CardHeader className="flex flex-col items-center gap-y-2 md:flex-row md:items-center md:justify-between">
          <Skeleton className="h-6 w-32 lg:h-7 lg:w-36" />
          <Skeleton className="h-10 w-full rounded-[0.475rem] md:w-24" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-y-2 py-4 sm:flex-row sm:items-center">
            <Skeleton className="h-10 w-full rounded-[0.475rem] sm:max-w-sm" />
          </div>

          <div className="rounded-md border"></div>

          <div className="flex flex-col-reverse gap-y-2 py-4 sm:flex-row sm:items-center sm:justify-end sm:space-x-2">
            <Skeleton className="mt-4 h-4 w-48 sm:mt-0" />
            <div className="grid w-full grid-cols-2 gap-x-2 sm:flex sm:w-auto sm:justify-end">
              <Skeleton className="h-8 w-full rounded-[0.475rem] sm:w-20" />
              <Skeleton className="h-8 w-full rounded-[0.475rem] sm:w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const CategoriesSkeleton = () => {
  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <Card className="border-none shadow-none drop-shadow-none">
        <CardHeader className="flex flex-col items-center gap-y-2 md:flex-row md:items-center md:justify-between">
          <Skeleton className="h-6 w-36 lg:h-7 lg:w-40" />
          <Skeleton className="h-10 w-full rounded-[0.475rem] md:w-24" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-y-2 py-4 sm:flex-row sm:items-center">
            <Skeleton className="h-10 w-full rounded-[0.475rem] sm:max-w-sm" />
          </div>

          <div className="rounded-md border"></div>

          <div className="flex flex-col-reverse gap-y-2 py-4 sm:flex-row sm:items-center sm:justify-end sm:space-x-2">
            <Skeleton className="mt-4 h-4 w-48 sm:mt-0" />
            <div className="grid w-full grid-cols-2 gap-x-2 sm:flex sm:w-auto sm:justify-end">
              <Skeleton className="h-8 w-full rounded-[0.475rem] sm:w-20" />
              <Skeleton className="h-8 w-full rounded-[0.475rem] sm:w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const SettingsSkeleton = () => {
  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <Card className="border-none shadow-none">
        <CardHeader>
          <Skeleton className="h-6 w-24 lg:h-7 lg:w-28" />
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
          <div className="mb-4 border-t border-gray-200"></div>
          <div className="space-y-4">
            <div className="flex flex-col gap-y-2 rounded-md p-3 md:flex-row md:items-center md:justify-between md:gap-x-4 md:p-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-10 w-full rounded-[0.475rem] md:w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
