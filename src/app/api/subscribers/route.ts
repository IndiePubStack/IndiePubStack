import {db, resendContactsTable} from "@/lib/drizzle";
import { desc} from "drizzle-orm";
import z from "zod";
import {getResendClient} from "@/lib/resend";
import {getSettings} from "@/lib/settings";

export async function GET() {
    const resendContacts = await db.select()
        .from(resendContactsTable)
        .orderBy(desc(resendContactsTable.createdAt));

    return Response.json(resendContacts)
}


const  createSubscriberBodySchema = z.object({
    email: z.string(),
})

export async function POST(request: Request) {
    const bodyRaw = await request.json();
    const settings = getSettings();
    try {
        const body = createSubscriberBodySchema.parse(bodyRaw);

        const result = await getResendClient().contacts.create({
            email: body.email,
            unsubscribed: false,
            audienceId: settings.resendAudienceId!
        });

        if (!result.data?.id) {
            return Response.json({ message: 'Failed to create contact'}, {status: 400})
        }

        const [subscriber] = await db.insert(resendContactsTable)
            .values({
                email: body.email,
                resendId: result.data.id,
                audienceId: settings.resendAudienceId!,
                createdAt: new Date()
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