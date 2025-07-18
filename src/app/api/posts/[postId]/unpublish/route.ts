import {postsTable} from "@/lib/schema";
import { getDb } from "@/lib/db";
import {eq} from "drizzle-orm";

export async function POST(_request: Request,
                          { params }: { params: Promise<{ postId: string }> }) {
    const postId = parseInt((await params).postId);
    const [post] = await getDb().update(postsTable).set({
        status: "unpublished"
    }).where(eq(postsTable.id, postId)).returning();

    return new Response(JSON.stringify(post), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
