"use client";

export type Provider = 'google' | 'instagram' | 'facebook' | 'twitter';

export interface AccountConnection {
  provider: Provider;
  connected: boolean;
  username?: string;
  email?: string;
  lastSyncedAt?: string | null;
}

interface AccountDto {
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

export const PROVIDERS: Provider[] = ['google', 'instagram', 'facebook', 'twitter'];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const ensureApiBaseUrl = (): string => {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL must be configured for backend requests.");
  }

  return API_BASE_URL;
};

const resolveBackendUrl = (endpoint: string): string => {
  if (endpoint.startsWith("http")) {
    return endpoint;
  }

  const baseUrl = ensureApiBaseUrl();
  if (endpoint.startsWith("/")) {
    return `${baseUrl}${endpoint}`;
  }

  return `${baseUrl}/${endpoint}`;
};

const accountsEndpoint = () => `${ensureApiBaseUrl()}/accounts`;
const oauthRedirectEndpoint = (provider: Provider) => `${ensureApiBaseUrl()}/auth/${provider}/redirect`;
const accountDisconnectEndpoint = (provider: Provider) => `${ensureApiBaseUrl()}/accounts/${provider}/disconnect`;
const syncProviderEndpoint = (provider: Provider) => `${ensureApiBaseUrl()}/sync/${provider}`;
const syncAllEndpoint = () => `${ensureApiBaseUrl()}/sync/all`;

const asJson = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

const request = async <TResponse>(endpoint: string, init: RequestInit = {}): Promise<TResponse> => {
  const url = resolveBackendUrl(endpoint);

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

    throw new Error(message || `Request to ${endpoint} failed with status ${response.status}`);
  }

  return asJson<TResponse>(response);
};

const normalizeAccount = (account: AccountDto): AccountConnection => ({
  provider: account.provider,
  connected: account.connected,
  username: account.username,
  email: account.email,
  lastSyncedAt: account.last_synced_at ?? null,
});

export const getAccounts = async (): Promise<AccountConnection[]> => {
  const response = await request<AccountDto[]>(accountsEndpoint());
  const accountMap = new Map<Provider, AccountConnection>(response.map((account) => [account.provider, normalizeAccount(account)]));

  return PROVIDERS.map(
    (provider) =>
      accountMap.get(provider) ?? {
        provider,
        connected: false,
        lastSyncedAt: null,
      }
  );
};

export const getOAuthRedirectUrl = async (provider: Provider): Promise<string> => {
  const payload = await request<OAuthRedirectResponse>(oauthRedirectEndpoint(provider));
  return payload.authorization_url ?? payload.url ?? "";
};

export const disconnectAccount = (provider: Provider): Promise<void> =>
  request(accountDisconnectEndpoint(provider), { method: "POST" });

export const syncProvider = (provider: Provider): Promise<void> =>
  request(syncProviderEndpoint(provider), { method: "POST" });

export const syncAll = (): Promise<void> => request(syncAllEndpoint(), { method: "POST" });

