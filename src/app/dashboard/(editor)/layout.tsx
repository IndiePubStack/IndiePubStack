import Providers from "@/app/providers";
import React from "react";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'IndiePubStack | Dashboard',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <Providers>
          <div className={`antialiased  px-4 h-full flex flex-col`}>
              <div className={'flex-grow'}>
                  {children}
              </div>
          </div>
      </Providers>
  );
}
