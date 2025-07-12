"use client"
import NewPostButton from "./new-post-button"
import {Post} from "@/app/dashboard/types";
import {PostDashboardListItem} from "@/app/dashboard/posts/post-list-item";


export default function Page() {

    const postsQuery = {data: []}

    return (<>
        <div className={"flex justify-between items-center font-mono mt-10"}>
            <h1 className={"text-2xl font-bold"}>Posts</h1>

            <NewPostButton/>
        </div>

        <section className={"pt-10"}></section>

        {postsQuery.data && postsQuery.data.map((post: Post) => (
            <PostDashboardListItem
                key={post.id}
                post={post}/>
        ))}
    </>)


}