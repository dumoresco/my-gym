"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ReactNode } from "react";

interface ReactQueryProviderProps {
  children: ReactNode;
}

export const ReactQueryProvider: React.FC<ReactQueryProviderProps> = ({
  children,
}) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
