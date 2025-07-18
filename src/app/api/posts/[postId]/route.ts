import { postsTable} from "@/lib/schema";
import { getDb } from "@/lib/db";
import {eq} from "drizzle-orm";
import z from "zod";

export async function GET(_request: Request,
                          { params }: { params: Promise<{ postId: string }> }) {
    const postId = parseInt((await params).postId);
    const [post] = await getDb().select().from(postsTable).where(eq(postsTable.id, postId));
    return new Response(JSON.stringify(post), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

const updatePostBodySchema = z.object({
    title: z.string(),
    subTitle: z.string(),
    content: z.string(),
})

export async function PUT(request: Request,
                          { params }: { params: Promise<{ postId: string }> }) {
    const postId = parseInt((await params).postId);
    const bodyRaw = await request.json();
    try {
        const body = updatePostBodySchema.parse(bodyRaw);
        const [post] = await getDb().update(postsTable).set({
            title: body.title,
            subTitle: body.subTitle,
            content: body.content,
        }).where(eq(postsTable.id, postId)).returning()

        return Response.json(post);
    } catch (e) {
        if (e instanceof z.ZodError) {
            return Response.json(e, {status: 400});
        }
    }
}

export async function DELETE(_request: Request,
                             { params }: { params: Promise<{ postId: string }> }) {
    const postId = parseInt((await params).postId);
    await getDb().delete(postsTable).where(eq(postsTable.id, postId)).returning();
    return new Response(null, { status: 204 });
}