'use client';

import { apiGet, apiPost } from './api';

export type Provider = 'google' | 'instagram' | 'facebook' | 'twitter';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

const ensureApiBaseUrl = (): string => {
    if (!API_BASE_URL) {
        throw new Error('NEXT_PUBLIC_API_URL must be configured for backend requests.');
    }

    return API_BASE_URL;
};

const accountsEndpoint = () => `${ensureApiBaseUrl()}/accounts`;
const oauthRedirectEndpoint = (provider: Provider) => `${ensureApiBaseUrl()}/auth/${provider}/redirect`;
const accountDisconnectEndpoint = (provider: Provider) => `${ensureApiBaseUrl()}/accounts/${provider}/disconnect`;
const syncProviderEndpoint = (provider: Provider) => `${ensureApiBaseUrl()}/sync/${provider}`;
const syncAllEndpoint = () => `${ensureApiBaseUrl()}/sync/all`;

interface AccountDto {
    provider: Provider;
    connected: boolean;
    username?: string;
    email?: string;
    last_synced_at?: string | null;
}

export interface AccountConnection {
    provider: Provider;
    connected: boolean;
    username?: string;
    email?: string;
    lastSyncedAt?: string | null;
}

export const PROVIDERS: Provider[] = ['google', 'instagram', 'facebook', 'twitter'];

const normalizeAccount = (dto: AccountDto): AccountConnection => ({
    provider: dto.provider,
    connected: dto.connected,
    username: dto.username,
    email: dto.email,
    lastSyncedAt: dto.last_synced_at ?? null
});

export const getAccounts = async (): Promise<AccountConnection[]> => {
    const response = await apiGet<AccountDto[]>(accountsEndpoint());
    const map = new Map<Provider, AccountConnection>(response.map((item) => [item.provider, normalizeAccount(item)]));

    return PROVIDERS.map(
        (provider) =>
            map.get(provider) ?? {
                provider,
                connected: false,
                lastSyncedAt: null
            }
    );
};

export const getOAuthRedirectUrl = async (provider: Provider): Promise<string> => {
    const response = await apiGet<{ authorization_url?: string; url?: string }>(oauthRedirectEndpoint(provider));
    const redirectUrl = response.authorization_url ?? response.url;
    if (!redirectUrl) {
        throw new Error('No redirect URL returned from OAuth endpoint');
    }
    return redirectUrl;
};

export const disconnectAccount = async (provider: Provider): Promise<void> => {
    await apiPost(accountDisconnectEndpoint(provider), {});
};

export const syncProvider = async (provider: Provider): Promise<void> => {
    await apiPost(syncProviderEndpoint(provider), {});
};

export const syncAll = async (): Promise<void> => {
    await apiPost(syncAllEndpoint(), {});
};


