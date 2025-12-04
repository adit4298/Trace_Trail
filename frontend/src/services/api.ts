// src/lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiOptions {
    method?: HttpMethod;
    body?: any;
    token?: string;
    headers?: Record<string, string>;
    isFormData?: boolean;
}

async function apiRequest(path: string, options: ApiOptions = {}) {
    const url = `${API_BASE_URL}${path}`;

    const headers: Record<string, string> = {
        ...(options.isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        ...(options.headers || {})
    };

    const fetchOptions: RequestInit = {
        method: options.method || "GET",
        headers,
        body: options.isFormData ? options.body : JSON.stringify(options.body),
    };

    const res = await fetch(url, fetchOptions);

    // Handle non-2xx responses
    if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        throw new Error(`API Error ${res.status}: ${errorText}`);
    }

    // Try parsing JSON, fallback to text
    try {
        return await res.json();
    } catch {
        return await res.text();
    }
}

// Shorthand helpers
export const apiGet = (path: string, token?: string) =>
    apiRequest(path, { method: "GET", token });

export const apiPost = (path: string, body: any, token?: string) =>
    apiRequest(path, { method: "POST", body, token });

export const apiPut = (path: string, body: any, token?: string) =>
    apiRequest(path, { method: "PUT", body, token });

export const apiPatch = (path: string, body: any, token?: string) =>
    apiRequest(path, { method: "PATCH", body, token });

export const apiDelete = (path: string, token?: string) =>
    apiRequest(path, { method: "DELETE", token });

// File upload
export const apiFileUpload = (path: string, formData: FormData, token?: string) =>
    apiRequest(path, {
        method: "POST",
        body: formData,
        token,
        isFormData: true
    });
