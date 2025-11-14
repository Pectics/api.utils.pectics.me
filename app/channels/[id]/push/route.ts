import { NextRequest } from "next/server";
import { kv } from "@vercel/kv";
import crypto from "crypto";
import { ApiError, $safe } from "@/lib/error";
import { Channel } from "../..";
import { $data } from "@/lib/result";

type Context = { params: Promise<{ id: string }> };

export const POST = $safe(POST_impl);

async function POST_impl(req: NextRequest, { params }: Context) {

    const { id } = await params;
    const { secret, type, data } = await req.json();

    if (!secret || !data)
        throw new ApiError("Missing params in request body", 400);

    // 获取频道信息
    const key = `channel:${id}`;
    const channel = await kv.get<Channel>(key);

    if (!channel)
        throw new ApiError("Channel not found", 404);

    const now = Math.floor(Date.now() / 1000);
    if (channel.expireAt && channel.expireAt < now)
        throw new ApiError("Channel expired", 410);

    const hash = crypto.createHash("sha256").update(secret).digest("hex");
    if (hash !== channel.hash)
        throw new ApiError("Forbidden", 403);

    const version = (channel.version || 0) + 1;

    const updated: Channel = {
        ...channel,
        version,
        payload: {
            type: type || channel.mode || "raw",
            data,
            ts: now
        }
    };

    // 续期 TTL，保证会话 Alive
    const ttl = channel.expireAt - now;
    await kv.set(key, updated, ttl > 0 ? { ex: ttl } : undefined);

    return $data({ version });
}
