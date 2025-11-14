import { NextRequest } from "next/server";
import { kv } from "@vercel/kv";
import crypto from "crypto";
import { Channel } from ".";
import { $data } from "@/lib/result";
import { $safe } from "@/lib/error";

/**
 * 创建频道
 * 
 * 请求体参数:
 * - ttl: 频道存活时间，单位秒，默认60秒
 * - mode: 频道模式，"raw"或"matrix"，默认"raw"
 * 
 * 响应体参数:
 * - id: 频道ID
 * - secret: 频道隔离密钥
 * - ttl: 频道存活时间，单位秒
 */
export const POST = $safe(POST_impl);

async function POST_impl(req: NextRequest) {

    const {
        ttl = 60,    // 秒
        mode = "raw", // "raw" | "matrix"
    } = await req.json().catch(() => ({}));

    const id = crypto.randomBytes(8).toString("hex");

    // 频道隔离密钥
    const secret = crypto.randomBytes(16).toString("hex");
    const hash = crypto.createHash("sha256").update(secret).digest("hex");

    const now = Math.floor(Date.now() / 1000);
    const expireAt = now + ttl;

    // 频道信息缓存
    const key = `channel:${id}`;
    const value: Channel = {
        id,
        mode,
        createdAt: now,
        expireAt,
        version: 0,
        payload: null,
        hash
    };
    await kv.set(key, value, { ex: ttl });

    return $data({ id, secret, ttl });
}
