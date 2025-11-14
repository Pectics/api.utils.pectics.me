import z from "zod";

export const InfoSchema = z.object({
    ok: z.literal(true),
    status: z.number().int().positive().default(200),
    message: z.string().optional(),
}).strict();

export type InfoDTO = z.infer<typeof InfoSchema>;

export const DataSchema = z.object({
    ok: z.literal(true),
    status: z.number().int().positive().default(200),
    message: z.string().optional(),
    data: z.unknown(),
}).strict();

export type DataDTO<T> = Omit<z.infer<typeof DataSchema>, "data"> & { data: T };

export const ErrorSchema = z.object({
    ok: z.literal(false),
    status: z.number().int().positive().default(400),
    message: z.string(),
    details: z.record(z.string(), z.unknown()).optional(),
}).strict();

export type ErrorDTO = z.infer<typeof ErrorSchema>;