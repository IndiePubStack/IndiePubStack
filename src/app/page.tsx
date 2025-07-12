export const dynamic = 'force-dynamic';

import React from "react";
import Nav from "@/app/nav";
import {Post, postsTable} from "@/lib/schema";
import { getDb } from "@/lib/db";
import {eq} from "drizzle-orm";
import {formatDate} from "@/lib/utils";
import {Metadata} from "next";
import {getSettings} from "@/lib/settings";

export const metadata: Metadata = {
    title: `${getSettings().publicationName} | Home`,
}

function PostListItem({post}: {post: Post}) {
    return (
        <a
            href={`/posts/${post.id}/${post.slug}`}
            className="block rounded-md border border-gray-300 p-4 shadow-sm sm:p-6 mb-4"
        >
            <div className="sm:flex sm:justify-between sm:gap-4 lg:gap-6">
                <div className="mt-4 sm:mt-0">
                    <h3 className="text-lg font-medium text-pretty text-gray-900">
                        {post.title}
                    </h3>

                    {post.subTitle && (<p className="mt-4 line-clamp-2 text-sm text-pretty text-gray-700">
                        {post.subTitle}
                    </p>)}
                </div>
            </div>

            <div className="text-sm text-gray-500 mt-6 flex gap-4 lg:gap-6">
                {post.publishedAt && (
                    <div>
                        {formatDate(post.publishedAt)}
                    </div>
                )}
            </div>
        </a>
    );
}

export default async function Home() {
    const posts = await getDb().select()
        .from(postsTable).where(eq(postsTable.status, "published"));

  return (
      <div className={'antialiased max-w-4xl mx-auto px-4 h-full flex flex-col'}>
        <Nav></Nav>
          <div className={'flex-grow'}>

              <section className={"pt-5 flex-grow max-w-4xl mx-auto"}>
                  {posts.map((post) => {
                      return <PostListItem key={post.id} post={post}/>;
                  })}
              </section>
          </div>
      </div>
  );
}
