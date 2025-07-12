import {getSettings} from "@/lib/settings";

export async function GET() {
    return Response.json(getSettings());
}
