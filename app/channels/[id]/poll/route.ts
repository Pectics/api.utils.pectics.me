import { NextRequest } from "next/server";
import { kv } from "@vercel/kv";
import { Channel } from "../..";
import { ApiError, $safe } from "@/lib/error";
import { $data } from "@/lib/result";

type Context = { params: Promise<{ id: string }> };

export const GET = $safe(GET_impl);

async function GET_impl(req: NextRequest, { params }: Context) {

    const { id } = await params;
    const url = new URL(req.url);
    const since = Number(url.searchParams.get("since") ?? "0") || 0;

    const key = `channel:${id}`;
    const channel = await kv.get<Channel>(key);

    if (!channel)
        throw new ApiError("Channel not found", 404);

    const now = Math.floor(Date.now() / 1000);
    if (channel.expireAt && channel.expireAt < now)
        throw new ApiError("Channel expired", 410);

    if ((channel.version || 0) > since && channel.payload)
        return $data({
            updated: true,
            version: channel.version,
            payload: channel.payload
        });

    return $data({
        updated: false,
        version: channel.version || 0
    });
}
