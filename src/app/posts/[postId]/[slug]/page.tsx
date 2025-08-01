import Nav from "@/app/nav";
import React, {cache} from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {formatDate} from "@/lib/utils";
import {postsTable} from "@/lib/schema";
import { getDb } from "@/lib/db";
import {eq} from "drizzle-orm";
import {Footer} from "@/app/footer";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {getSettings} from "@/lib/settings";
import {md} from "@/lib/markdown";

function SubscribeForm() {
    return (<div className={'border border-gray-300 rounded mt-5 py-5 p-2.5 font-mono transition duration-300 ease-in-out transform hover:scale-105'}>
        <p className={'text-center'}>Like what you’re reading? Don’t miss out — hit subscribe and stay in the loop!</p>

        <div className="flex justify-center mt-5">
            <Button asChild size={'lg'}>
                <Link href={'/subscribe'}>Subscribe</Link>
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

    return (<div className={'antialiased max-w-4xl mx-auto px-4 h-full flex flex-col'}>
            <Nav></Nav>
            <div className={'flex-grow'}>
                <div className={"max-w-xl mx-4 mt-4 container md:mx-auto flex-grow "}>

                    <div className={'w-full'}>
                        <div className={'prose'}>
                            <h1 className="mb-6 text-3xl prose">{post.title}</h1>
                        </div>

                        <article className={"prose"}>
                            {/*<h1 className="mb-6 text-3xl">{post.title}</h1>*/}
                            {post.subTitle && (
                                <p>{post.subTitle}</p>
                            )}
                            <div className={'flex justify-between items-center'}>
                                <p className="text-gray-500 mb-3 text-sm">
                                    {formatDate(post.publishedAt || post.createdAt)}
                                </p>
                            </div>
                        </article>

                        {!isUserAuthenticated && <SubscribeForm/>}

                        <article className="prose mt-5 mb-5 prose-pre:border prose-pre:border-gray-300 mx-auto">
                            <div dangerouslySetInnerHTML={{__html: md.render(post.content!)}}/>
                        </article>

                        {!isUserAuthenticated && <SubscribeForm/>}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}