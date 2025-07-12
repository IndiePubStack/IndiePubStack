"use client"
import {Badge} from "@/components/ui/badge";
import {AlarmClock, CircleCheck, EyeOff, LoaderCircle} from "lucide-react";
import {Post} from "@/app/dashboard/types";

export default function PostStatus({post}: {post: Post}) {
    switch (post.status) {
        case "draft":
            return <PostStatusDraft/>
        case "published":
            return <PostStatusPublished/>
        case "unpublished":
            return <PostStatusUnpublished/>
        case "scheduled":
            return <PostStatusScheduled/>
    }
}

const PostStatusUnpublished = () => {
    return (<Badge variant="secondary"
                   className="bg-pink-400 text-white">
        <EyeOff/>
        Unpublished
    </Badge>)
}

const PostStatusScheduled = () => {
    return (<Badge variant="secondary"
                   className="bg-orange-400 text-white">
        <AlarmClock />
        {/*TODO: add tooltip to show when post is scheduled*/}
        Scheduled
    </Badge>)
}

const PostStatusPublished = () => {
    return (<Badge variant="secondary"
                   className="bg-emerald-600 text-white font-mono">
        <CircleCheck/>
        Published
    </Badge>)
}

const PostStatusDraft = () => {
    return (<Badge variant="secondary"
                   className="bg-zinc-200  font-mono">
        <LoaderCircle/>
        Draft
    </Badge>)
}
