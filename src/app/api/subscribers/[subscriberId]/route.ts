import { resendContactsTable } from "@/lib/schema";
import { getDb } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getResendClient } from "@/lib/resend";
import {getSettings} from "@/lib/settings";

export async function DELETE(_request: Request,
                             { params }: { params: Promise<{ subscriberId: string }> }) {
    const id = parseInt((await params).subscriberId);

    const [subscriber] = await getDb().select().from(resendContactsTable).where(eq(resendContactsTable.id, id));
    if (!subscriber) {
        return new Response(null, { status: 404 });
    }

    try {
        const resend = getResendClient()
        await resend.contacts.remove(
            {
                audienceId: getSettings().resendAudienceId!,
                id: subscriber.resendId
            }
        );
    } catch (e) {
        console.warn('Failed to delete contact in Resend, continuing to delete locally', e);
    }

    await getDb().delete(resendContactsTable).where(eq(resendContactsTable.id, id)).returning();
    return new Response(null, { status: 204 });
}
