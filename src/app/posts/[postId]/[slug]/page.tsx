import Nav from "@/app/nav";
import React, {cache} from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Shiki from "@shikijs/markdown-it";
import MarkdownIt from "markdown-it";
import {formatDate} from "@/lib/utils";
import {db, postsTable} from "@/lib/drizzle";
import {eq} from "drizzle-orm";
import {Footer} from "@/app/footer";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

const md = MarkdownIt();

md.use(
    await Shiki({
        themes: {
            light: "one-light",
            dark: "solarized-dark",
        },
    }),
);

function SubscribeForm() {
    return (<div className={'border border-gray-300 rounded mt-5 py-5 p-2.5 font-mono '}>
        <p className={'text-center'}>Like what you’re reading? Don’t miss out — hit subscribe and stay in the loop!</p>

        <div className="flex justify-center mt-2.5">
            <Button asChild>
                <Link href={'/subscribe'}>Subscribe</Link>
            </Button>
        </div>
    </div>)
}

const getPostById = cache(async (postId: string) => {
    const [post] = await db.select().from(postsTable).where(eq(postsTable.id, parseInt(postId)));
    return post;
})

export async function generateMetadata({
                                           params,
                                       }: {
    params: { postId: string }
}) {
    const post = await getPostById(params.postId)
    return {
        title: `IndiePubStack | ${post.title}`,
        description: post.subTitle || post.content?.slice(0, 200) || ''
    }
}

export default async function Page({
                                 params,
                             }: {
    params: Promise<{ postId: string, slug: string }>
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