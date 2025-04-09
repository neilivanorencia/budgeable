"use client";

import { LuPlus } from "react-icons/lu";

import { columns } from "@/app/(dashboard)/accounts/columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { Loader2 } from "lucide-react";

const AccountsPage = () => {
  const newAccount = useNewAccount();
  const accountsQuery = useGetAccounts();
  const accounts = accountsQuery.data || [];

  if (accountsQuery.isLoading) {
    return (
      <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
        <Card className="border-none shadow-none drop-shadow-none">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="flex w-full items-center justify-center">
              <Loader2 className="size-8 animate-spin text-slate-200" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <Card className="border-none shadow-none drop-shadow-none">
        <CardHeader className="flex flex-col items-center gap-y-2 md:flex-row md:items-center md:justify-between">
          <CardTitle className="font-manrope line-clamp-1 text-lg font-semibold text-slate-800 md:text-xl">
            Accounts Page
          </CardTitle>
          <Button
            className="transition-color w-full cursor-pointer bg-teal-500 shadow-none duration-300 ease-in-out hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-200/50 md:w-auto"
            onClick={newAccount.onOpen}
          >
            <LuPlus className="size-4" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={accounts} filterKey="name" onDelete={() => {}} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsPage;
