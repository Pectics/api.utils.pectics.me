import { NextResponse } from "next/server";
import { DataDTO, InfoDTO } from "./dto";

export function $info(message?: string, status: number = 200) {
    const dto: InfoDTO = {
        ok: true,
        status,
        message,
    };
    return NextResponse.json(dto, { status });
}

export function $data<T>(data: T, message?: string, status: number = 200) {
    const dto: DataDTO<T> = {
        ok: true,
        status,
        message,
        data,
    };
    return NextResponse.json(dto, { status });
}
