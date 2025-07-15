import {handleAuth} from "@kinde-oss/kinde-auth-nextjs/server";
import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest, response: NextResponse) {
    const handler = handleAuth();
    return handler(request, response);
}