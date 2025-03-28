"use client";

import { SessionProvider } from "next-auth/react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { QueryClient, QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ProgressBar
          height="4px"
          color="#1e40af"
          options={{ showSpinner: false }}
          shallowRouting
        />
        {/* <ReactQueryDevtools /> */}
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Providers;
