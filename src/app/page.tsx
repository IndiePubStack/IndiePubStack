import React from "react";
import Nav from "@/app/nav";

export default function Home() {
  return (
      <div className={'antialiased max-w-4xl mx-auto px-4 h-full flex flex-col'}>
        <Nav></Nav>
        <div className={'flex-grow'}>
          <div>kek</div>
        </div>
        {/*<Footer/>*/}
      </div>
  );
}
