"use client"
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Post} from "@/app/dashboard/types";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

export function NewPostButton() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const createPostMutation = useMutation({
        mutationFn: async () => {
            const emptyPost = {
                title: '',
                subTitle: '',
                content: ''
            };

            return await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emptyPost),
            }).then(res => {
                if (!res.ok) {
                    throw new Error('Failed to create post');
                }
                return res.json();
            });
        },
        onSuccess: async (post: Post) => {
            await queryClient.invalidateQueries({queryKey: ['posts']});
            router.push(`/dashboard/posts/${post.id}`);
        },
    });

    const handleCreateNewPost = () => {
        createPostMutation.mutate();
    };

    return ( <Button
        size={'lg'}
        onClick={handleCreateNewPost}
        disabled={createPostMutation.isPending}
        className={'cursor-pointer'}
    >
        {createPostMutation.isPending ? 'Creating...' : 'New post'}
    </Button>)
}