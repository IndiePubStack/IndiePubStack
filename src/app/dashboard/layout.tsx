import Nav from "@/app/dashboard/nav";
import Providers from "@/app/providers";
import React from "react";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'IndiePubStack | Dashboard',
}

function Footer() {
    return (
        <nav className="flex justify-center container mx-auto px-10 py-5 items-center border-t border-gray-300  font-mono mt-10 text-sm text-muted-foreground">
            <p className={"block font-mono text-center"}>
                © 2025 <a className={'underline '}
                          href={"https://indiepubstack.com"}>IndiePubStack</a>. Built with ❤️ by developers.</p>
        </nav>
    );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <Providers>
          <div className={'antialiased max-w-4xl mx-auto px-4 h-full flex flex-col'}>
              <Nav></Nav>
              <div className={'flex-grow'}>
                  {children}
              </div>
              <Footer/>
          </div>
      </Providers>
  );
}
