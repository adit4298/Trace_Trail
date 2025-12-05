// src/lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  token?: string;
  headers?: Record<string, string>;
  isFormData?: boolean;
}

async function apiRequest<TResponse = unknown, TBody = unknown>(
  path: string,
  options: ApiOptions<TBody> = {}
): Promise<TResponse> {
  const url = `${API_BASE_URL ?? ''}${path}`;

  const headers: Record<string, string> = {
    ...(options.isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    ...(options.headers ?? {})
  };

  let body: BodyInit | undefined;
  if (options.isFormData && options.body instanceof FormData) {
    body = options.body;
  } else if (!options.isFormData && typeof options.body !== 'undefined') {
    body = JSON.stringify(options.body);
  }

  const fetchOptions: RequestInit = {
    method: options.method ?? 'GET',
    headers,
    ...(body ? { body } : {})
  };

  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`API Error ${res.status}: ${errorText}`);
  }

  try {
    return (await res.json()) as TResponse;
  } catch {
    return (await res.text()) as TResponse;
  }
}

export const apiGet = <TResponse = unknown>(path: string, token?: string) =>
  apiRequest<TResponse>(path, { method: 'GET', token });

export const apiPost = <TResponse = unknown, TBody = unknown>(path: string, body: TBody, token?: string) =>
  apiRequest<TResponse, TBody>(path, { method: 'POST', body, token });

export const apiPut = <TResponse = unknown, TBody = unknown>(path: string, body: TBody, token?: string) =>
  apiRequest<TResponse, TBody>(path, { method: 'PUT', body, token });

export const apiPatch = <TResponse = unknown, TBody = unknown>(path: string, body: TBody, token?: string) =>
  apiRequest<TResponse, TBody>(path, { method: 'PATCH', body, token });

export const apiDelete = <TResponse = unknown>(path: string, token?: string) =>
  apiRequest<TResponse>(path, { method: 'DELETE', token });

export const apiFileUpload = <TResponse = unknown>(path: string, formData: FormData, token?: string) =>
  apiRequest<TResponse, FormData>(path, {
    method: 'POST',
    body: formData,
    token,
    isFormData: true
  });
