import {Resend} from "resend";
import {getSettings} from "@/lib/settings";

let resend: Resend | null = null;

export function getResendClient() {
    if (!resend) {
        if (!process.env.RESEND_API_KEY) {
            throw new Error('RESEND_API_KEY is not set');
        }

        resend = new Resend(process.env.RESEND_API_KEY);
    }
    return resend;
}

export async function createContact(email: string,
                                    firstName: string | undefined,
                                    lastName: string | undefined) {
    return getResendClient().contacts.create({
        email: email,
        firstName: firstName,
        lastName: lastName ,
        unsubscribed: false,
        audienceId: getSettings().resendAudienceId!
    });
}

