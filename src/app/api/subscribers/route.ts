import {db, subscribersTable} from "@/lib/drizzle";
import { desc} from "drizzle-orm";
import z from "zod";
import {resend} from "@/lib/resend";
import {getSettings} from "@/lib/settings";

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
    const settings = getSettings();
    try {
        const body = createSubscriberBodySchema.parse(bodyRaw);

        const result = await resend.contacts.create({
            email: body.email,
            unsubscribed: false,
            audienceId: settings.resendAudienceId!
        });

        if (!result.data?.id) {
            return Response.json({ message: 'Failed to create contact'}, {status: 400})
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