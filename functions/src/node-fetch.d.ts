declare module "node-fetch" {
    export interface Response {
        json(): Promise<any>;
        text(): Promise<string>;
        arrayBuffer(): Promise<ArrayBuffer>;
        blob(): Promise<any>;
        status: number;
        statusText: string;
        ok: boolean;
        headers: Headers;
    }

    export interface RequestInit {
        method?: string;
        headers?: Record<string, string> | Headers;
        body?: string | Buffer;
        redirect?: "follow" | "manual" | "error";
        signal?: AbortSignal;
        // Add other properties as needed
    }

    export interface Headers {
        append(name: string, value: string): void;
        delete(name: string): void;
        get(name: string): string | null;
        has(name: string): boolean;
        set(name: string, value: string): void;
        forEach(callback: (value: string, name: string) => void): void;
    }

    export interface Request {
        url: string;
        method?: string;
        headers?: Headers;
        body?: any;
    }

    export default function fetch(url: string | Request, init?: RequestInit): Promise<Response>;
}
