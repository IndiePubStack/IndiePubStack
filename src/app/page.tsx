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
            className="group block rounded-md border border-border  backdrop-blur p-5 sm:p-6 mb-4 transition-colors duration-200"
        >
            <div className="sm:flex sm:justify-between sm:gap-4 lg:gap-6">
                <div className="mt-1.5 sm:mt-0">
                    <h3 className="text-lg font-semibold text-pretty text-foreground tracking-tight group-hover:text-primary">
                        {post.title}
                    </h3>

                    {post.subTitle && (
                        <p className="mt-3 line-clamp-2 text-sm text-pretty text-muted-foreground">
                            {post.subTitle}
                        </p>
                    )}
                </div>
            </div>

            <div className="text-sm text-muted-foreground mt-5 flex gap-4 lg:gap-6">
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
              <section className={"pt-6 sm:pt-8 flex-grow max-w-4xl mx-auto"}>
                  {posts.map((post) => {
                      return <PostListItem key={post.id} post={post}/>;
                  })}
              </section>
          </div>
      </div>
  );
}
