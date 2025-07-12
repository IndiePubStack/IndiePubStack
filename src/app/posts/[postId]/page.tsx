import Nav from "@/app/nav";
import React from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Shiki from "@shikijs/markdown-it";
import MarkdownIt from "markdown-it";

const md = MarkdownIt();

md.use(
    await Shiki({
        themes: {
            light: "one-light",
            dark: "solarized-dark",
        },
    }),
);

const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
};

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


export default function Page() {

    const post = {title: 'Hello, World!', subTitle: 'This is a subtitle', content: '## kekus', publishedAt: new Date(), createdAt: new Date()}


    return (<div className={'antialiased max-w-4xl mx-auto px-4 h-full flex flex-col'}>
        <Nav></Nav>
            <div className={'flex-grow'}>
                <div className={"max-w-xl mx-4 mt-4 container md:mx-auto flex-grow "}>

                    <div>

                        <a href={'/'}
                           className="relative group inline-flex h-12 items-center justify-center overflow-hidden rounded border border-neutral-200 bg-transparent px-4 text-neutral-950"><span
                            className="relative inline-flex overflow-hidden"><div
                            className="absolute origin-bottom transition duration-500 [transform:translateX(-150%)_skewX(33deg)] group-hover:[transform:translateX(0)_skewX(0deg)]">back</div><div
                            className="transition duration-500 [transform:translateX(0%)_skewX(0deg)] group-hover:[transform:translateX(150%)_skewX(33deg)]">back</div></span></a>

                    </div>

                    <div className={'w-full'}>
                        <article className={"prose"}>
                            <h1 className="mb-6 text-3xl">{post.title}</h1>
                            {post.subTitle && (
                                <p>{post.subTitle}</p>
                            )}

                            <p className="text-gray-500 mb-3 text-sm">
                                {formatDate(post.publishedAt || post.createdAt)}
                            </p>
                        </article>


                        {/*{!currentUser && <SubscribeForm/>}*/}
                        <SubscribeForm/>

                        <article className="prose mt-5 mb-5 prose-pre:border prose-pre:border-gray-300 mx-auto">
                            <div dangerouslySetInnerHTML={{__html: md.render(post.content!)}}/>
                        </article>

                        {/*{!currentUser && <SubscribeForm/>}*/}
                    </div>
                </div>
            </div>
            {/*<Footer/>*/}
        </div>
    )
}