import {NextRequest, NextResponse} from "next/server";
import {resendContactsTable} from "@/lib/schema";
import { getDb } from "@/lib/db";
import {Webhook} from "svix";

let webhook: Webhook | null = null;

function getWebhook() {
    if (!webhook) {
        if (!process.env.RESEND_WEBHOOK_SECRET) {
            throw new Error('RESEND_WEBHOOK_SECRET is not set');
        }
        webhook = new Webhook(process.env.RESEND_WEBHOOK_SECRET);
    }
    return webhook;
}

type ContactEventType = 'contact.created' | 'contact.updated';

interface ContactData {
    id: string;
    audience_id: string;
    created_at: string;
    updated_at: string;
    email: string;
    first_name?: string;
    last_name?: string;
    unsubscribed: boolean;
}

interface ContactWebhookEvent {
    type: ContactEventType;
    created_at: string;
    data: ContactData;
}

export async function POST(req: NextRequest) {
    try {
        const payload = await req.text();
        const headers = Object.fromEntries(req.headers);

        const event = getWebhook().verify(payload, headers) as ContactWebhookEvent;

        if (!event?.data) {
            return NextResponse.json({ message: "Invalid event data" }, { status: 400 });
        }

        const { 
            id: resendId, 
            audience_id: audienceId, 
            email, 
            first_name: firstName, 
            last_name: lastName,
            unsubscribed
        } = event.data;

        if (event.type === "contact.created" || event.type === "contact.updated") {
            await upsertResendContact(resendId, audienceId, email, unsubscribed, firstName, lastName);
        }

    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
            return NextResponse.json({ message: err.message }, { status: 400 });
        }
    }
    return NextResponse.json({ status: 200, statusText: "success" });
}

async function upsertResendContact(
    resendId: string, 
    audienceId: string, 
    email: string, 
    unsubscribed: boolean,
    firstName?: string, 
    lastName?: string
) {
    try {
        const [contact] = await getDb()
            .insert(resendContactsTable)
            .values({
                resendId,
                audienceId,
                email,
                firstName: firstName || null,
                lastName: lastName || null,
                unsubscribed,
                createdAt: new Date(),
            })
            .onConflictDoUpdate({
                target: resendContactsTable.resendId,
                set: {
                    audienceId,
                    email,
                    firstName: firstName || null,
                    lastName: lastName || null,
                    unsubscribed,
                }
            }).returning();

        console.log(`Upserted Resend contact: ${resendId}`);
        return contact;
    } catch (error) {
        console.error("Error upserting Resend contact:", error);
        throw error;
    }
}
