import {db, subscribersTable} from "@/lib/drizzle";
import { desc} from "drizzle-orm";
import z from "zod";
import {resend} from "@/lib/resend";

export async function GET() {
    const subscribers = await db.select()
        .from(subscribersTable)
        .orderBy(desc(subscribersTable.createdAt));

    return new Response(JSON.stringify(subscribers), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}


const  createSubscriberBodySchema = z.object({
    email: z.string(),
})

export async function POST(request: Request) {
    const bodyRaw = await request.json();
    try {
        const body = createSubscriberBodySchema.parse(bodyRaw);

        const result = await resend.contacts.create({
            email: body.email,
            unsubscribed: false,
            audienceId: process.env.RESEND_AUDIENCE_ID!,
        });

        if (!result.data?.id) {
            return new Response(JSON.stringify({
                message: 'Failed to create contact'
                }

            ), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        const [subscriber] = await db.insert(subscribersTable)
            .values({
                email: body.email,
                kindeId: 'anonymous',
                resendContactId: result.data.id,
            })
            .returning();

        return new Response(JSON.stringify(subscriber), {
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