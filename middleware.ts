// middleware.ts at project root
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const origin = req.headers.get('origin') ?? '*';

    res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set('Vary', 'Origin');
    res.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // 预检请求直接放行
    if (req.method === 'OPTIONS') {
        return new NextResponse(null, { status: 204, headers: res.headers });
    }
    return res;
}

// 只对 /channels API 生效（可选）
export const config = {
    matcher: ['/channels/:path*'],
};
