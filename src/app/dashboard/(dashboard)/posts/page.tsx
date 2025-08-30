"use client"
import {Post} from "@/app/dashboard/(dashboard)/types";
import {PostDashboardListItem} from "@/app/dashboard/(dashboard)/posts/post-list-item";
import {useQuery} from "@tanstack/react-query";
import {NewPostButton} from "@/app/dashboard/(dashboard)/posts/new-post-button";


export default function Page() {

    const {isPending, data: posts} = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            return await fetch('/api/posts', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
                .then((res) =>
                    res.json(),
                )
        },
    })

    if (isPending) return;

    return (<>
        <div className={"flex justify-between items-center font-mono mt-10"}>
            <h1 className={"text-2xl font-bold"}>Posts</h1>
            <NewPostButton/>
        </div>

        <section className={"pt-10"}></section>

        {posts.map((post: Post) => (
            <PostDashboardListItem
                key={post.id}
                post={post}/>
        ))}
    </>)


}