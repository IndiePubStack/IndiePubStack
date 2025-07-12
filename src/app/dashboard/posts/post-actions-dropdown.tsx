"use client"
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Ellipsis} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {Button, buttonVariants} from "@/components/ui/button";
import {Post} from "@/app/dashboard/types";
import Link from "next/link";

export default function PostActionsDropdown({post} : {post: Post}) {
    const queryClient = useQueryClient();
    const republishPostMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/posts/${post.id}/republish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) {
                throw new Error('Failed to republish post');
            }
            return await res.json();
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['posts']});
        },
    });

    const unpublishPostMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/posts/${post.id}/unpublish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) {
                throw new Error('Failed to unpublish post');
            }
            return await res.json();
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['posts']});
        },
    });

    const deletePostMutation = useMutation({
        mutationFn: async () => {
            return await fetch(`/api/posts/${post.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['posts']});
        }
    });

    const handleDelete = () => {
        deletePostMutation.mutate();
    };

    const handleUnpublish = () => {
        unpublishPostMutation.mutate();
    };

    const handleRepublish = () => {
        republishPostMutation.mutate();
    };
    return (
        <AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size={'icon'}>
                        <Ellipsis size={16}/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">

                    <Link href={`/dashboard/posts/${post.id}`}><DropdownMenuItem>
                        Edit
                    </DropdownMenuItem></Link>

                    {/*<DropdownMenuSeparator />*/}
                    {/*{post.status == 'draft' && <DropdownMenuItem>Publish</DropdownMenuItem>}*/}
                    {post.status == 'unpublished' && <DropdownMenuItem
                        onPointerDown={handleRepublish}>Republish</DropdownMenuItem>}
                    <DropdownMenuSeparator/>
                    {post.status == 'published' && <DropdownMenuItem
                        onPointerDown={handleUnpublish}
                        variant={'destructive'}>
                        Unpublish
                    </DropdownMenuItem>}
                    <DropdownMenuItem asChild variant={'destructive'}>
                        <AlertDialogTrigger className={'block w-full'}>
                            Delete
                        </AlertDialogTrigger>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your post.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex md:justify-between">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className={buttonVariants({variant: "destructive"})}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}
