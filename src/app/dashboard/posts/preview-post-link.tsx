"use client"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {MoveUpRight} from "lucide-react";
import {Post} from "@/app/dashboard/types";

export function PreviewPostLink({post}: {post: Post}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="secondary" className={'font-mono'} asChild>
                    <a href={`/posts/${post.id}/${post.slug}`} target="_blank">
                        <span>Preview post</span>
                        <MoveUpRight/>
                    </a>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Preview post</p>
            </TooltipContent>
        </Tooltip>
    )
}

export function PreviewPostLinkIcon({post}: {post: Post}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="secondary" size={'icon'} asChild>
                    <a href={`/posts/${post.id}/${post.slug}`}><MoveUpRight/></a>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Preview post</p>
            </TooltipContent>
        </Tooltip>
    )
}