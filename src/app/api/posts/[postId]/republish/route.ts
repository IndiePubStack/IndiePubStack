import {db, postsTable} from "@/lib/drizzle";
import {eq} from "drizzle-orm";

export async function POST(_request: Request,
                          { params }: { params: Promise<{ postId: string }> }) {
    const postId = parseInt((await params).postId);
    const [post] = await db.update(postsTable).set({
        status: "published"
    }).where(eq(postsTable.id, postId)).returning();

    return Response.json(post);
}
