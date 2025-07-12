import {db, postsTable} from "@/lib/drizzle";
import {eq} from "drizzle-orm";

export async function GET(_request: Request,
                          { params }: { params: Promise<{ postId: string }> }) {
    const postId = parseInt((await params).postId);
    const [post] = await db.select().from(postsTable).where(eq(postsTable.id, postId));
    return new Response(JSON.stringify(post), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function DELETE(_request: Request,
                             { params }: { params: Promise<{ postId: string }> }) {
    const postId = parseInt((await params).postId);
    await db.delete(postsTable).where(eq(postsTable.id, postId)).returning();
    return new Response(null, { status: 204 });
}