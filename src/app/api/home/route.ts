import {db, postsTable, resendContactsTable} from "@/lib/drizzle";
import {count, desc, eq} from "drizzle-orm";

export async function GET() {
    const [{total: totalSubscribers}] = await db.select({ total: count() })
        .from(resendContactsTable);

    const [{total: totalPosts}] = await db.select({ total: count() })
        .from(postsTable)
        .where(eq(postsTable.status, "published"));

    const recentPublishedPosts = await db.select()
        .from(postsTable)
        .where(eq(postsTable.status, "published"))
        .orderBy(desc(postsTable.publishedAt))
        .limit(3);

    const recentDraftPosts = await db.select()
        .from(postsTable)
        .where(eq(postsTable.status, "draft"))
        .orderBy(desc(postsTable.createdAt))
        .limit(1);

    return new Response(JSON.stringify({
        totalSubscribers,
        totalPosts,
        recentPublishedPosts,
        recentDraftPosts
    }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}