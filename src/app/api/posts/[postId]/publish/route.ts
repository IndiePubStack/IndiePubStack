import {db, postsTable} from "@/lib/drizzle";
import {eq} from "drizzle-orm";
import {resend} from "@/lib/resend";
import {broadcastEmail} from "@/lib/email";
import slugify from "slugify";

export async function POST(_request: Request,
                          { params }: { params: Promise<{ postId: string }> }) {
    const postId = parseInt((await params).postId);

    const [post] = await db.select().from(postsTable).where(eq(postsTable.id, postId));

    const slug = slugify(post.title!, {
        lower: true,
        strict: true,
    });

    const broadcast = await broadcastEmail(resend, post);

    if (!broadcast.data) {
        throw new Error("broadcast is not created");
    }

    const [updatedPost] = await db.update(postsTable).set({
        slug: slug,
        broadcastId: broadcast.data?.id,
        publishedAt: new Date(),
        status: 'published'
    }).where(eq(postsTable.id, postId)).returning();

    await resend.broadcasts.send(broadcast.data.id);

    return Response.json(updatedPost);
}