import {NextRequest, NextResponse} from "next/server";
import jwksClient, {JwksClient} from "jwks-rsa";
import jwt from "jsonwebtoken";
import { kindeUsersTable } from "@/lib/schema";
import {createContact} from "@/lib/resend";
import {getDb} from "@/lib/db";

let client: JwksClient | null = null;

function getJwksClient() {
    if (!client) {
        if (!process.env.KINDE_ISSUER_URL) {
            throw new Error('KINDE_ISSUER_URL is not set');
        }

        client = jwksClient({
            jwksUri: `${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`,
        });
    }
    return client;
}

interface KindeUser {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    [key: string]: unknown;
}

interface KindeUserData {
    user: KindeUser;
}

interface KindeEvent {
    data: KindeUserData;
    type: string;
    event_id: string;
    source: string;
    timestamp: string;
    [key: string]: unknown;
}

export async function POST(req: NextRequest) {
    try {
        const token = await req.text();

        const decoded = jwt.decode(token, { complete: true });
        const { kid } = decoded?.header || {};

        const key = await getJwksClient().getSigningKey(kid);
        const event = jwt.verify(token, key.getPublicKey()) as KindeEvent;

        if (!event?.data?.user) {
            return NextResponse.json({ message: "Invalid event data" }, { status: 400 });
        }

        const { id: kindeId, email, first_name: firstName, last_name: lastName } = event.data.user;

        if (event?.type === "user.updated" || event?.type === "user.created") {
            await upsertKindeUser(kindeId, email, firstName, lastName);
        }

        if (event?.type === "user.created") {
            await createContact(email,  firstName, lastName);
        }
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
            return NextResponse.json({ message: err.message }, { status: 400 });
        }
    }
    return NextResponse.json({ status: 200, statusText: "success" });
}

async function upsertKindeUser(kindeId: string, email: string, firstName?: string, lastName?: string) {
    try {
        const [kindeUser] = await getDb()
            .insert(kindeUsersTable)
            .values({
                kindeId,
                email,
                firstName: firstName || null,
                lastName: lastName || null,
                createdAt: new Date(),
            })
            .onConflictDoUpdate({
                target: kindeUsersTable.kindeId,
                set: {
                    email,
                    firstName: firstName || null,
                    lastName: lastName || null,
                }
            }).returning();

        console.log(`Upserted Kinde user: ${kindeId}`);
        return kindeUser;
    } catch (error) {
        console.error("Error upserting Kinde user:", error);
        throw error;
    }
}
