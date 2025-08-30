import {postsTable, resendContactsTable} from "@/lib/schema";
import { getDb } from "@/lib/db";
import {count, desc, eq} from "drizzle-orm";

export async function GET() {
    const [{total: totalSubscribers}] = await getDb().select({ total: count() })
        .from(resendContactsTable);

    const [{total: totalPosts}] = await getDb().select({ total: count() })
        .from(postsTable)
        .where(eq(postsTable.status, "published"));

    const recentPublishedPosts = await getDb().select()
        .from(postsTable)
        .where(eq(postsTable.status, "published"))
        .orderBy(desc(postsTable.publishedAt))
        .limit(5);

    const recentDraftPosts = await getDb().select()
        .from(postsTable)
        .where(eq(postsTable.status, "draft"))
        .orderBy(desc(postsTable.createdAt))
        .limit(3);

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