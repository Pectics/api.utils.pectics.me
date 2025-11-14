import { NextRequest, NextResponse } from "next/server";
import { ErrorDTO } from "./dto";

export class ApiError extends Error {
    status: number;
    details?: Record<string, unknown>;

    constructor(message: string, status: number, details?: Record<string, unknown>) {
        super(message);
        this.status = status;
        this.details = details;
    }

    toResponse() {
        const dto: ErrorDTO = {
            ok: false,
            status: this.status,
            message: this.message,
            details: this.details,
        }
        return NextResponse.json(dto, { status: this.status });
    }
}

export function $safe(fn: (req: NextRequest, ctx?: any) => Promise<Response>) {
    return async(req: NextRequest, ctx?: any) => {
        try {
            return await fn(req, ctx);
        } catch (err) {
            if (err instanceof ApiError) {
                return err.toResponse();
            } else {
                const dto: ErrorDTO = {
                    ok: false,
                    status: 500,
                    message: "Internal Server Error",
                }
                console.error("Unhandled error:", err);
                return NextResponse.json(dto, { status: 500 });
            }
        }
    }
}
