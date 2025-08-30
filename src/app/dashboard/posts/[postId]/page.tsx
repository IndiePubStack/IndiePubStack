"use client"
import {Post} from "@/app/dashboard/types";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useCallback, useEffect, useRef, useState} from "react";
import z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ArrowLeft, Loader2Icon} from "lucide-react";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {AutosizeTextarea} from "@/components/ui/autoresize-textarea";
import {useParams} from "next/navigation";
import {PreviewPostLink} from "@/app/dashboard/posts/preview-post-link";
import {PublishDialog} from "@/app/dashboard/posts/publish-dialog";

function PostEditor({post}: { post?: Post }) {
    const queryClient = useQueryClient();
    const [isSaving, setIsSaving] = useState(false);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSavedValuesRef = useRef<PostFormValues | null>(null);
    const controllerRef = useRef<AbortController | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // cleanup on unmount
        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (controllerRef.current) controllerRef.current.abort();
        };
    }, []);

    const postSchema = z.object({
        title: z.string().min(1, "Title is required"),
        subTitle: z.string().optional(),
        content: z.string().min(1, "Content is required")
    });

    type PostFormValues = z.infer<typeof postSchema>;

    const form = useForm<PostFormValues>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: post?.title || '',
            subTitle: post?.subTitle || '',
            content: post?.content || ''
        }
    });

    useEffect(() => {
        if (post) {
            const initialValues = {
                title: post.title || '',
                subTitle: post.subTitle || '',
                content: post.content || ''
            };
            form.reset(initialValues);
            lastSavedValuesRef.current = initialValues;
        }
    }, [post, form]);

    // cancelable save
    const savePost = useCallback(async (postData: PostFormValues) => {
        if (!post?.id) return Promise.reject('No post ID');
        // cancel in-flight
        if (controllerRef.current) controllerRef.current.abort();
        controllerRef.current = new AbortController();
        setIsSaving(true);
        try {
            const res = await fetch(`/api/posts/${post.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),
                signal: controllerRef.current.signal,
            });
            if (!res.ok) throw new Error('Failed to update post');
            const json = await res.json();
            lastSavedValuesRef.current = { ...postData };
            await queryClient.invalidateQueries({ queryKey: ['posts'] });
            await queryClient.invalidateQueries({ queryKey: ['post', post?.id] });
            return json;
        } finally {
            // brief delay so UI shows saving state
            setTimeout(() => setIsSaving(false), 300);
        }
    }, [post?.id, queryClient]);


    // debounced autosave on user input
    const autoSave = useCallback((data: PostFormValues) => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => {
            savePost(data);
        }, 800);
    }, [savePost]);

    const watchedValues = form.watch();
    // Debounce-driven save on changes
    useEffect(() => {
        if (!post?.id) return;
        if (!form.formState.isDirty) return;
        const lastValues = lastSavedValuesRef.current;
        const hasChanged = !lastValues || Object.keys(watchedValues).some(key =>
            watchedValues[key as keyof PostFormValues] !== lastValues[key as keyof PostFormValues]
        );
        if (hasChanged) {
            autoSave(watchedValues as PostFormValues);
        }
    }, [watchedValues, post?.id, form.formState.isDirty, autoSave]);

    // Interval fallback: save every 30s if there are unsaved changes
    useEffect(() => {
        if (!post?.id) return;
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            const current = form.getValues();
            const last = lastSavedValuesRef.current;
            if (JSON.stringify(current) !== JSON.stringify(last)) {
                savePost(current as PostFormValues);
            }
        }, 30000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [post?.id, form, savePost]);

    return (
        <div>
            <div className="flex justify-between items-center mt-10">
                <div className="flex items-center gap-2.5">
                    <Button variant={'secondary'} size={'icon'}>
                        <Link href="/dashboard/posts">
                            <ArrowLeft/>
                        </Link>
                    </Button>

                    <Button className={'font-mono'} variant={'secondary'} disabled={!isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2Icon className="animate-spin mr-2"/>
                                Saving changes...
                            </>
                        ) : <> <span className={'inline-block w-2 h-2 bg-green-600 rounded-full'}/> Saved</>}
                    </Button>
                </div>

                <div className="flex items-center gap-2.5">
                    <PreviewPostLink post={post!}/>
                    {post && post.status == 'draft' && <PublishDialog post={post!} variant={'default'}/>}
                </div>
            </div>

            <Form {...form}>
                <form className="mx-auto py-6 space-y-6 font-serif text-black">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <input
                                        {...field}
                                        placeholder="Title"
                                        className="w-full text-4xl font-bold  outline-none border-none focus:ring-0"
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="subTitle"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <input
                                        {...field}
                                        placeholder="Add a subtitle"
                                        className="w-full text-xl  outline-none border-none focus:ring-0"
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="content"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <AutosizeTextarea
                                        {...field}
                                        className="w-full text-xl outline-none border-none resize-none focus:ring-0 focus-visible:ring-0 p-0"
                                        placeholder="Start writing with markdown"
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </div>
    )
}

export default function Page() {
    const params = useParams<{ postId: string }>()
    const postId = parseInt(params.postId)

    const {isPending, error, data: post} = useQuery({
        queryKey: ['post', postId],
        queryFn: async () => {
            return await fetch(`/api/posts/${postId}`)
                .then((res) =>
                    res.json(),
                )
        },
    });

    if (isPending) return;

    if (error) return <div className="max-w-4xl mx-auto px-4 h-full">An error has occurred: {error.message}</div>;

    return (<>
        <PostEditor post={post}/>
    </>)
}
