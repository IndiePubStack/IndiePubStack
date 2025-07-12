import {handleAuth} from "@kinde-oss/kinde-auth-nextjs/server";
import {NextRequest} from "next/server";

export async function GET(request: NextRequest, params: { params: Promise<{ kindeAuth: string }> } ) {

    const handler = handleAuth();
    return handler(request, params);
}