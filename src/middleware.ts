import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import {NextRequest} from "next/server";

// export default withAuth(
//     async function middleware(req) {
//         console.log("look at me", req.kindeAuth);
//     },
//     {
//         isReturnToCurrentPage: true,
//         loginPage: "/login",
//         publicPaths: ["/public", '/more'],
//         isAuthorized: ({token}) => {
//             // The user will be considered authorized if they have the permission 'eat:chips'
//             return token.permissions.includes("eat:chips");
//         }
//     }
// );

export default withAuth(
    async function middleware(_: NextRequest) {
    },
    {
        // Middleware still runs on all routes, but doesn't protect the blog route
        publicPaths: ["/", "/posts/"],
    }
);


export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    ]
};