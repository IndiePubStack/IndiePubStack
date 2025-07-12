"use client"; // Mark this as a Client Component

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

export default function Providers({ children }: {children: React.ReactNode}) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/*<ReactQueryDevtools initialIsOpen={false} />*/}
    </QueryClientProvider>
);
}