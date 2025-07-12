"use client"
import {Badge} from "@/components/ui/badge";
import {Post} from "@/app/dashboard/types";
import Link from "next/link";
import {PublishDialog} from "@/app/dashboard/posts/publish-dialog";
import {PreviewPostLinkIcon} from "@/app/dashboard/posts/preview-post-link";
import PostActionsDropdown from "@/app/dashboard/posts/post-actions-dropdown";
import PostStatus from "@/app/dashboard/posts/post-status";

export function PostDashboardListItem({post}: {post: Post}) {
    return (
        <div
            className="rounded-md border border-gray-300 p-4 shadow-sm sm:p-6 mb-4 flex justify-between items-center"
        >
            <div className="sm:flex sm:justify-between sm:gap-4 lg:gap-6">
                <div className="mt-4 sm:mt-0">
                    {post.status == 'draft' ?
                        <Link className="text-lg font-medium text-pretty text-gray-900 mb-2.5 hover:underline"
                              href={`/dashboard/post/${post.id}`}>
                            {post.title || 'Untitled'}
                        </Link>
                        :<a className="text-lg font-medium text-pretty text-gray-900 mb-2.5 hover:underline"
                            href={post.slug ? `/posts/${post.id}/${post.slug}` : `/posts/${post.id}`}>
                            {post.title || 'Untitled'}
                        </a>
                    }

                    {post.subTitle && <p className="mt-4 line-clamp-2 text-sm text-pretty text-gray-700">
                        {post.subTitle}
                    </p>}

                    <div className="flex items-center text-sm gap-2 mt-4">
                        <PostStatus post={post}/>

                        <Badge variant="outline"
                               className=" font-mono text-gray-500"
                        >
                            {/*{format(new Date(post.createdAt!), "d MMM, yyyy")}*/}
                        </Badge>
                    </div>


                </div>
            </div>

            <div className="flex items-center gap-2">
                {post.status == 'draft' && <PublishDialog
                    post={post}
                    variant={'secondary'}/>}
                <PreviewPostLinkIcon post={post}/>
                <PostActionsDropdown post={post}/>
            </div>
        </div>
    );
};