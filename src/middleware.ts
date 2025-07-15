import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { isAdmin } from "./lib/utils";
import {NextRequest, NextResponse} from "next/server";
import {KindeRoles} from "@kinde-oss/kinde-auth-nextjs/types";

export default withAuth(
    async function middleware(req: NextRequest) {
        const path = req.nextUrl.pathname;
        if (!path.startsWith("/api/auth/") && !path.startsWith("/api/webhooks")) {
            if (path.startsWith('/api/') || path.startsWith('/dashboard/')) {

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                const roles = req.kindeAuth.token.roles as KindeRoles

                if (!isAdmin(roles)) {
                    return NextResponse.redirect(new URL('/', req.url));
                }
            }
        }

    },
    {
        publicPaths: ["/", "/posts/", "/api/webhooks/kinde", '/api/webhooks/resend'],
    }
);

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    ]
};
