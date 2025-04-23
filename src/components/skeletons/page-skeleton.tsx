import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const DashboardSkeleton = () => {
  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <div className="mb-8 grid grid-cols-1 gap-4 pb-2 md:grid-cols-3 md:gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="h-[192px] border-none shadow-none">
            <CardHeader className="flex flex-row items-center justify-between gap-x-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="size-12 rounded-md" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 h-10 w-24 shrink-0" />
              <Skeleton className="h-4 w-40 shrink-0" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
        <div className="col-span-1 lg:col-span-3 xl:col-span-4">
          <Card className="border-none shadow-none">
            <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-8 w-full lg:w-[120px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[350px] w-full rounded-md" />
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1 lg:col-span-3 xl:col-span-2">
          <Card className="border-none shadow-none">
            <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-full lg:w-[120px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[350px] w-full rounded-md" />
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
          <Skeleton className="h-8 w-48" />
          <div className="flex w-full items-center justify-end gap-x-2 md:w-auto">
            <Skeleton className="h-10 w-[calc(50%-0.25rem)] md:w-24" />
            <Skeleton className="h-10 w-[calc(50%-0.25rem)] md:w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-y-2 py-4 sm:flex-row sm:items-center">
            <Skeleton className="h-10 w-full sm:max-w-sm" />
          </div>

          <div className="rounded-md border">
            <div className="border-b p-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="hidden h-4 w-24 sm:block" />
                <Skeleton className="hidden h-4 w-20 md:block" />
                <Skeleton className="hidden h-4 w-16 lg:block" />
                <Skeleton className="hidden h-4 w-20 xl:block" />
              </div>
            </div>

            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border-b p-4 last:border-b-0">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="hidden h-4 w-24 sm:block" />
                  <Skeleton className="hidden h-4 w-20 md:block" />
                  <Skeleton className="hidden h-4 w-16 lg:block" />
                  <Skeleton className="hidden h-4 w-20 xl:block" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col-reverse gap-y-2 py-4 sm:flex-row sm:items-center sm:justify-end sm:space-x-2">
            <Skeleton className="mt-4 h-4 w-48 sm:mt-0" />
            <div className="grid w-full grid-cols-2 gap-x-2 sm:flex sm:w-auto sm:justify-end">
              <Skeleton className="h-8 w-full sm:w-20" />
              <Skeleton className="h-8 w-full sm:w-16" />
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
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-full md:w-24" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-y-2 py-4 sm:flex-row sm:items-center">
            <Skeleton className="h-10 w-full sm:max-w-sm" />
          </div>

          <div className="rounded-md border">
            <div className="border-b p-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="hidden h-4 w-20 sm:block" />
              </div>
            </div>

            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border-b p-4 last:border-b-0">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="hidden h-4 w-20 sm:block" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col-reverse gap-y-2 py-4 sm:flex-row sm:items-center sm:justify-end sm:space-x-2">
            <Skeleton className="mt-4 h-4 w-48 sm:mt-0" />
            <div className="grid w-full grid-cols-2 gap-x-2 sm:flex sm:w-auto sm:justify-end">
              <Skeleton className="h-8 w-full sm:w-20" />
              <Skeleton className="h-8 w-full sm:w-16" />
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
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-10 w-full md:w-24" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-y-2 py-4 sm:flex-row sm:items-center">
            <Skeleton className="h-10 w-full sm:max-w-sm" />
          </div>

          <div className="rounded-md border">
            <div className="border-b p-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="hidden h-4 w-20 sm:block" />
              </div>
            </div>

            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border-b p-4 last:border-b-0">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="hidden h-4 w-20 sm:block" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col-reverse gap-y-2 py-4 sm:flex-row sm:items-center sm:justify-end sm:space-x-2">
            <Skeleton className="mt-4 h-4 w-48 sm:mt-0" />
            <div className="grid w-full grid-cols-2 gap-x-2 sm:flex sm:w-auto sm:justify-end">
              <Skeleton className="h-8 w-full sm:w-20" />
              <Skeleton className="h-8 w-full sm:w-16" />
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
          <Skeleton className="h-8 w-24" />
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
          <div className="mb-4 border-t border-gray-200"></div>
          <div className="space-y-4">
            <div className="flex flex-col gap-y-2 rounded-md p-3 md:flex-row md:items-center md:justify-between md:gap-x-4 md:p-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-10 w-full md:w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
