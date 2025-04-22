"use client";

import { useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useMount } from "react-use";

import { Button } from "@/components/ui/button";
import { useCreateLinkToken } from "@/features/plaid/api/use-create-link-token";
import { useExchangePublicToken } from "@/features/plaid/api/use-exchange-public-token";

export const PlaidConnect = () => {
  const [token, setToken] = useState<string | null>(null);

  const createLinkToken = useCreateLinkToken();
  const exchangePublicToken = useExchangePublicToken();

  useMount(() => {
    createLinkToken.mutate(undefined, {
      onSuccess: ({ data }) => {
        setToken(data);
      },
    });
  });

  const plaid = usePlaidLink({
    token: token,
    onSuccess: (publicToken) => {
      exchangePublicToken.mutate({ publicToken });
    },
    env: "sandbox",
  });

  const onClick = () => {
    plaid.open();
  };

  const isDisabled = !plaid.ready || exchangePublicToken.isPending;

  return (
    <Button
      disabled={isDisabled}
      onClick={onClick}
      className="transition-color w-full cursor-pointer bg-teal-500 text-white duration-300 ease-in-out hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-200/50 md:mt-0 md:w-auto"
    >
      Connect Bank
    </Button>
  );
};
