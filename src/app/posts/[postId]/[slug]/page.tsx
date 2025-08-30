// import Nav from "@/app/nav";
import React, {cache} from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {formatDate} from "@/lib/utils";
import {postsTable} from "@/lib/schema";
import { getDb } from "@/lib/db";
import {eq} from "drizzle-orm";
import {FooterPublic} from "@/app/footer";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {getSettings} from "@/lib/settings";
import {md} from "@/lib/markdown";
import TableOfContent from "@/app/posts/toc";
import {ThemeProvider} from "@/components/theme-provider";
import {ModeToggle} from "@/app/posts/[postId]/toggle";
import { notFound } from 'next/navigation'

function SubscribeForm() {
    return (<div className={'not-prose border rounded mt-5 py-5 px-5'}>
        <p className={'text-center'}>Like what you’re reading? Don’t miss out — hit subscribe and stay in the loop!</p>
        <div className="not-prose flex justify-center mt-5">
            <Button size={'lg'}>
                <Link href={'/subscribe'} className={'no-underline'}>Subscribe</Link>
            </Button>
        </div>
    </div>)
}

const getPostById = cache(async (postId: string) => {
    const [post] = await getDb().select().from(postsTable).where(eq(postsTable.id, parseInt(postId)));
    return post;
})

export async function generateMetadata({params}: {
    params: Promise<{ postId: string; slug: string }>;
}) {
    const {postId} = await params;
    const post = await getPostById(postId)
    return {
        title: `${post.title} | ${getSettings().publicationName}`,
        description: post.subTitle || post.content?.slice(0, 200) || ''
    }
}

export default async function Page({params}: {
    params: Promise<{ postId: string; slug: string }>;
}) {
    const {isAuthenticated} = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();

    const {postId} = await params;
    const post = await getPostById(postId)

    if (post?.status != 'published' && !isUserAuthenticated) {
        notFound()
    }

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className={'antialiased max-w-4xl mx-auto px-4 h-full flex flex-col'}>

                <TableOfContent/>
                <div className={'flex-grow'}>
                    <div className={"max-w-xl mt-4 container md:mx-auto flex-grow "}>

                        <div className={'w-full'}>
                            <div className={'prose prose-stone dark:prose-invert prose-inline-code:bg-gray-100 dark:prose-inline-code:bg-stone-600 prose-inline-code:rounded-sm prose-inline-code:font-normal prose-inline-code:px-1 prose-inline-code:py-0.5'}>
                                <h1 className="mb-6 text-2xl">{post.title}</h1>
                                {post.subTitle && (
                                    <div dangerouslySetInnerHTML={{__html: md.render(post.subTitle!)}}/>
                                )}
                                <div className={'flex justify-between items-center border-t-1 border-b-1'}>
                                    <p className=" mb-3 text-sm">
                                        {formatDate(post.publishedAt || post.createdAt)}
                                    </p>
                                    <ModeToggle/>
                                </div>
                                {!isUserAuthenticated && <SubscribeForm/>}
                                <article id="blog-content" className="mt-5 mb-5">
                                    <div dangerouslySetInnerHTML={{__html: md.render(post.content!)}}/>
                                </article>
                                {!isUserAuthenticated && <SubscribeForm/>}
                            </div>
                            <FooterPublic/>
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    )
}