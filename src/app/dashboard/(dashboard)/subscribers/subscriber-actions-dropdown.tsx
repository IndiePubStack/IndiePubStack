"use client"
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Ellipsis} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import {Subscriber} from "@/app/dashboard/(dashboard)/types";

export default function SubscriberActionsDropdown({subscriber} : {subscriber: Subscriber}) {
    const queryClient = useQueryClient();

    const deleteSubscriberMutation = useMutation({
        mutationFn: async () => {
            return await fetch(`/api/subscribers/${subscriber.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        },
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['subscribers'] }),
                queryClient.invalidateQueries({ queryKey: ['homeStats'] }),
            ]);
        }
    });

    const handleDelete = () => {
        deleteSubscriberMutation.mutate();
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
                    <DropdownMenuItem asChild variant={'destructive'}>
                        <AlertDialogTrigger className={'block w-full'}>
                            Delete
                        </AlertDialogTrigger>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete subscriber?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this subscriber from your audience.
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
