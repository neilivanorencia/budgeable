"use client";

import { useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useMount } from "react-use";

import { Button } from "@/components/ui/button";
import { useCreateLinkToken } from "@/features/plaid/api/use-create-link-token";
import { useExchangePublicToken } from "@/features/plaid/api/use-exchange-public-token";

/**
 * Renders a button that initializes the Plaid Link onboarding flow.
 */
export const PlaidConnect = () => {
  // Holds the temporary initialization link token returned from the back-end API server.
  const [token, setToken] = useState<string | null>(null);

  // Instantiates the API mutation controllers for token acquisition and credential verification.
  const createLinkToken = useCreateLinkToken();
  const exchangePublicToken = useExchangePublicToken();

  // Requests a temporary link initialization token automatically when the component mounts.
  useMount(() => {
    createLinkToken.mutate(undefined, {
      onSuccess: ({ data }) => {
        setToken(data);
      },
    });
  });

  // Configures the core Plaid Link connection interface layer.
  const plaid = usePlaidLink({
    token: token,
    // Forwards the generated public token value to the server to securely complete the handshake sequence.
    onSuccess: (publicToken) => {
      exchangePublicToken.mutate({ publicToken });
    },
    env: "sandbox",
  });

  /**
   * Opens the full-screen interactive Plaid Link modal sheet interface.
   */
  const onClick = () => {
    plaid.open();
  };

  // Locks interactions if the Plaid frame is downloading or if the server token exchange is in flight.
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
