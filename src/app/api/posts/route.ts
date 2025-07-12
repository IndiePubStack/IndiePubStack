import {postsTable} from "@/lib/schema";
import { getDb } from "@/lib/db";
import {desc} from "drizzle-orm";
import {z} from "zod";

export async function GET() {
    const posts = await getDb().select().from(postsTable).orderBy(desc(postsTable.createdAt));
    return new Response(JSON.stringify(posts), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

const  createPostBodySchema = z.object({
    title: z.string(),
    subTitle: z.string(),
    content: z.string(),
})

export async function POST(request: Request) {
    const bodyRaw = await request.json();
    try {
        const body = createPostBodySchema.parse(bodyRaw);
        const [post] = await getDb().insert(postsTable).values({
            title: body.title,
            subTitle: body.subTitle,
            content: body.content,
        }).returning();

        return new Response(JSON.stringify(post), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        if (e instanceof z.ZodError) {
            return new Response(JSON.stringify(e), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }
}