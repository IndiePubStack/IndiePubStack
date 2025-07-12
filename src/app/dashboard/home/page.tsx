"use client"
import {NewPostButton} from "@/app/dashboard/posts/new-post-button";
import {PostDashboardListItem} from "@/app/dashboard/posts/post-list-item";
import {Post} from "@/app/dashboard/types";
import {useQuery} from "@tanstack/react-query";

export default function Page() {

    const { data: homeStats } = useQuery({
        queryKey: ['homeStats', 'posts', 'subscribers'],
        queryFn: async () => {
            return await fetch(`/api/home`)
                .then((res) =>
                    res.json(),
                )
        },
    });
    return (<>
        <div className={"flex justify-between items-center font-mono mt-10"}>
            <h1 className={"text-2xl font-bold"}>Home</h1>

            <NewPostButton/>
        </div>

        {homeStats && <div
            className={'rounded border border-gray-500 grid md:grid-cols-2 font-mono mt-10 divide-x-0 md:divide-x divide-y md:divide-y-0 divide-gray-500'}>
            <div className={'p-2.5'}>
                <h1 className={'mb-2.5'}>Published posts</h1>
                <p className={'font-bold text-xl'}>{homeStats.totalPosts}</p>
            </div>
            <div className={'p-2.5'}>
                <h1 className={'mb-2.5'}>Subscribers</h1>
                <p className={'font-bold text-xl'}>{homeStats.totalSubscribers}</p>
            </div>


        </div>}



        {homeStats && homeStats.recentDraftPosts && <>
            <h2 className={'mt-10 mb-2.5 font-bold font-mono'}>Recent drafts</h2>
            {homeStats.recentDraftPosts.map((post: Post) => (
                <PostDashboardListItem
                    key={post.id}
                    post={post}/>

            ))}
        </>}

        {homeStats && homeStats.recentPublishedPosts && <>
            <h2 className={'mt-10 mb-2.5 font-bold font-mono'}>Recent published posts</h2>
            {homeStats.recentPublishedPosts.map((post: Post) => (
                <PostDashboardListItem
                    key={post.id}
                    post={post}/>

            ))}
        </>}
    </>)
}