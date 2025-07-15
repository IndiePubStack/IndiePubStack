import {Resend} from "resend";

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

