"use client"
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useMutation, useQueryClient} from "@tanstack/react-query";

export function AddSubscriberDialog({ variant }: { variant?: 'default' | 'secondary' | 'outline' }) {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const resetDialogState = () => {
        setEmail("");
        setEmailError("");
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError("Email is required");
            return false;
        } else if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email address");
            return false;
        }
        setEmailError("");
        return true;
    };

    const addSubscriberMutation = useMutation({
        mutationFn: async () => {
            if (!validateEmail(email)) {
                return;
            }

            const response = await fetch('/api/subscribers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error('Failed to add subscriber');
            }

            return await response.json();
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['subscribers'] });
            setOpen(false);
            resetDialogState();
        },
        onError: (error) => {
            console.error('Error adding subscriber:', error);
        }
    });

    const handleSubmit = () => {
        addSubscriberMutation.mutate();
    };

    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            setOpen(newOpen);
            if (!newOpen) {
                resetDialogState();
            }
        }}>
            <DialogTrigger asChild>
                <Button variant={variant}
                        className={'cursor-pointer font-mono'}>Add subscriber</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a new subscriber</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="subscriber-email">Email</Label>
                        <Input
                            id="subscriber-email"
                            type="email"
                            placeholder="subscriber@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                    </div>
                </div>

                <DialogFooter className="mt-6 flex sm:justify-between">
                    <Button variant="outline" className={'font-mono cursor-pointer'} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit}
                            className={'font-mono cursor-pointer'}
                            disabled={addSubscriberMutation.isPending}>
                        {addSubscriberMutation.isPending
                            ? "Processing..."
                            : "Add subscriber"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}