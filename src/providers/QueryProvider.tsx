"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// TODO: React Query Provider is creating a wrapper around our application
// we then import this into the layout it wraps our whole application

export default function QueryProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
