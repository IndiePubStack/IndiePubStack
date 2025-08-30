import Nav from "@/app/dashboard/(dashboard)/nav";
import Providers from "@/app/providers";
import React from "react";
import {Metadata} from "next";
import {ThemeProvider} from "@/components/theme-provider";
import {DashboardFooter} from "@/app/footer";

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
          <div className={`antialiased max-w-4xl mx-auto px-4 h-full flex flex-col`}>
              <Nav></Nav>
              <div className={'flex-grow'}>
                  <ThemeProvider attribute="class" forcedTheme="light" disableTransitionOnChange>
                      {children}
                  </ThemeProvider>
              </div>
              <DashboardFooter/>
          </div>
      </Providers>
  );
}
