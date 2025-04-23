import { Skeleton } from "@/components/ui/skeleton";

export const HeaderSkeleton = () => {
  return (
    <header className="bg-teal-600 bg-[url('/topography.svg')] bg-repeat px-6 py-8 pb-36 bg-blend-soft-light lg:px-14">
      <div className="mx-auto max-w-screen-2xl">
        <div className="mb-14 flex w-full items-center justify-between">
          <div className="flex items-center gap-x-4 lg:hidden">
            <Skeleton className="h-8 w-8 rounded bg-teal-500" />
          </div>

          <div className="hidden lg:block">
            <Skeleton className="h-8 w-32 rounded bg-teal-500" />
          </div>

          <div className="hidden flex-1 justify-center lg:flex">
            <div className="flex items-center gap-x-6">
              <Skeleton className="h-6 w-20 rounded bg-teal-500" />
              <Skeleton className="h-6 w-24 rounded bg-teal-500" />
              <Skeleton className="h-6 w-20 rounded bg-teal-500" />
              <Skeleton className="h-6 w-24 rounded bg-teal-500" />
              <Skeleton className="h-6 w-18 rounded bg-teal-500" />
            </div>
          </div>

          <div className="flex items-center gap-x-4">
            <Skeleton className="hidden h-6 w-32 rounded bg-teal-500 md:block" />
            <Skeleton className="h-8 w-8 rounded-full bg-teal-500" />
          </div>
        </div>

        <div className="mb-6 space-y-2">
          <Skeleton className="h-8 w-64 rounded bg-teal-500" />
          <Skeleton className="h-5 w-48 rounded bg-teal-500" />
        </div>

        <div className="flex flex-col gap-y-2 lg:flex-row lg:items-center lg:gap-x-4">
          <Skeleton className="h-10 w-full rounded bg-teal-500 lg:w-48" />
          <Skeleton className="h-10 w-full rounded bg-teal-500 lg:w-48" />
          <Skeleton className="h-10 w-full rounded bg-teal-500 lg:w-32" />
        </div>
      </div>
    </header>
  );
};
