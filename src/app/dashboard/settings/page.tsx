"use client"
import {Button} from "@/components/ui/button";
import {useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {useState} from "react";
import z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {Loader2Icon} from "lucide-react";

export default function Page() {
    const queryClient = useQueryClient();
    const [isSaving, setIsSaving] = useState(false);

    const {data: settings} = useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const res = await fetch('/api/settings');
            if (!res.ok) throw new Error('Failed to fetch settings');
            return res.json();
        }
    });

    const settingsSchema = z.object({
        publicationName: z.string().min(1, "Publication name is required"),
        // codeHighlightTheme: z.string().min(1, "Code highlight theme is required"),
        // subscribeCtaText: z.string().min(1, "Subscribe CTA text is required")
    });

    type SettingsFormValues = z.infer<typeof settingsSchema>;

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        values: settings
    });

    const updateSettingsMutation = useMutation({
        mutationFn: async (data: SettingsFormValues) => {
            setIsSaving(true);
            return await fetch('/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }).then(res => {
                if (!res.ok) {
                    throw new Error('Failed to update settings');
                }
                return res.json();
            }).finally(() => {
                setTimeout(() => {
                    setIsSaving(false);
                }, 1000);
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['settings']});
        },
    });

    const onSubmit = (data: SettingsFormValues) => {
        updateSettingsMutation.mutate(data);
    };

    return (<>
        <div className={"flex justify-between items-center font-mono mt-10"}>
            <h1 className={"text-2xl font-bold"}>Settings</h1>

            <Button
                size={'lg'}
                onClick={form.handleSubmit(onSubmit)}
                disabled={updateSettingsMutation.isPending}
                className={'cursor-pointer'}
            >
                {isSaving ? (
                    <>
                        <Loader2Icon className="animate-spin mr-2"/>
                        Saving...
                    </>
                ) : 'Save'}
            </Button>
        </div>

        <Form {...form}>
            <form className="space-y-6 mt-10">
                <FormField
                    control={form.control}
                    name="publicationName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Publication Name</FormLabel>
                            <FormControl>
                                <Input placeholder="My Publication" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/*<FormField*/}
                {/*    control={form.control}*/}
                {/*    name="codeHighlightTheme"*/}
                {/*    render={({ field }) => (*/}
                {/*        <FormItem>*/}
                {/*            <FormLabel>Code Highlight Theme</FormLabel>*/}
                {/*            <Select*/}
                {/*                onValueChange={field.onChange}*/}
                {/*                defaultValue={field.value}*/}
                {/*            >*/}
                {/*                <FormControl>*/}
                {/*                    <SelectTrigger>*/}
                {/*                        <SelectValue placeholder="Select a theme" />*/}
                {/*                    </SelectTrigger>*/}
                {/*                </FormControl>*/}
                {/*                <SelectContent>*/}
                {/*                    <SelectItem value="github">GitHub</SelectItem>*/}
                {/*                    <SelectItem value="github-dark">GitHub Dark</SelectItem>*/}
                {/*                    <SelectItem value="one-light">One Light</SelectItem>*/}
                {/*                    <SelectItem value="one-dark">One Dark</SelectItem>*/}
                {/*                    <SelectItem value="solarized-light">Solarized Light</SelectItem>*/}
                {/*                    <SelectItem value="solarized-dark">Solarized Dark</SelectItem>*/}
                {/*                </SelectContent>*/}
                {/*            </Select>*/}
                {/*            <FormMessage />*/}
                {/*        </FormItem>*/}
                {/*    )}*/}
                {/*/>*/}

                {/*<FormField*/}
                {/*    control={form.control}*/}
                {/*    name="subscribeCtaText"*/}
                {/*    render={({ field }) => (*/}
                {/*        <FormItem>*/}
                {/*            <FormLabel>Subscribe Call to Action Text</FormLabel>*/}
                {/*            <FormControl>*/}
                {/*                <Textarea*/}
                {/*                    placeholder="Subscribe to receive the latest updates"*/}
                {/*                    {...field}*/}
                {/*                />*/}
                {/*            </FormControl>*/}
                {/*            <FormMessage />*/}
                {/*        </FormItem>*/}
                {/*    )}*/}
                {/*/>*/}
            </form>
        </Form>
    </>)
}