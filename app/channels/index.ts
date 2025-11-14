export type ChannelMode = "raw" | "matrix";

export type ChannelPayload = {
    type: ChannelMode;
    data: unknown;
    ts: number;
};

export type Channel = {
    id: string;
    mode: ChannelMode;
    createdAt: number;
    expireAt: number;
    version: number;
    payload: ChannelPayload | null;
    hash: string;
};