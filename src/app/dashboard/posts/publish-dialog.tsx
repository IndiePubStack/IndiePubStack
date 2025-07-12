"use client"
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Post} from "@/app/dashboard/types";

export function PublishDialog({ post, variant }: { post: Post, variant?: 'default' | 'secondary' | 'outline' }) {
    const queryClient = useQueryClient();
    // const navigate = useNavigate();
    const [open, setOpen] = useState(false)
    const [schedule, setSchedule] = useState(false)
    const [scheduledAt, setScheduledAt] = useState<string | null>(null)

    const resetDialogState = () => {
        setSchedule(false);
        setScheduledAt(null);
    };

    const publishMutation = useMutation({
        mutationFn: async () => {
            const requestBody: { scheduledAt?: string } = {};

            if (schedule && scheduledAt) {
                requestBody.scheduledAt = scheduledAt;
            }

            const response = await fetch(`/api/posts/${post.id}/publish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error('Failed to schedule post');
            }

            return await response.json();
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['posts'] });
            await queryClient.invalidateQueries({ queryKey: ['post', post.id] });
            setOpen(false);
            resetDialogState();
            // navigate('/dashboard/posts');
        },
        onError: (error) => {
            console.error('Error publishing/scheduling post:', error);
        }
    });

    const handlePublish = () => {
        publishMutation.mutate();
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={variant}
                        className={'cursor-pointer font-mono'}>Publish</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you ready to publish the post?</DialogTitle>
                </DialogHeader>


                <DialogFooter className="mt-6 flex sm:justify-between">
                    <Button variant="outline" className={'font-mono cursor-pointer'} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handlePublish}
                            className={'font-mono cursor-pointer'}
                            disabled={publishMutation.isPending || (schedule && !scheduledAt)}>
                        {publishMutation.isPending 
                            ? "Processing..." 
                            : (schedule ? "Schedule" : "Publish now")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
