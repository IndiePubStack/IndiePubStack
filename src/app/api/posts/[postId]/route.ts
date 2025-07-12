import {db, postsTable} from "@/lib/drizzle";
import {desc, eq} from "drizzle-orm";

export async function DELETE(request: Request,
                             { params }: { params: Promise<{ postId: string }> }) {
    const postId = parseInt((await params).postId);
    await db.delete(postsTable).where(eq(postsTable.id, postId)).returning();
    return new Response(null, { status: 204 });
}