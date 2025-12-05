"use client";

export type Provider = "google" | "instagram" | "facebook" | "twitter";

export interface AccountConnection {
  provider: Provider;
  connected: boolean;
  username?: string;
  email?: string;
  last_synced_at?: string | null;
}

interface OAuthRedirectResponse {
  authorization_url?: string;
  url?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const asJson = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

const request = async <TResponse>(path: string, init: RequestInit = {}): Promise<TResponse> => {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const body = await response.json();
      message = body?.message ?? message;
    } catch {
      // ignore JSON parsing errors
    }

    throw new Error(message || `Request to ${path} failed with status ${response.status}`);
  }

  return asJson<TResponse>(response);
};

export const getAccounts = async (): Promise<AccountConnection[]> => request<AccountConnection[]>("/accounts");

export const getOAuthRedirectUrl = async (provider: Provider): Promise<string> => {
  const payload = await request<OAuthRedirectResponse>(`/auth/${provider}/redirect`);
  return payload.authorization_url ?? payload.url ?? "";
};

export const disconnectAccount = (provider: Provider): Promise<void> =>
  request(`/accounts/${provider}/disconnect`, { method: "POST" });

export const syncProvider = (provider: Provider): Promise<void> =>
  request(`/sync/${provider}`, { method: "POST" });

export const syncAll = (): Promise<void> => request("/sync/all", { method: "POST" });

