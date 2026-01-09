'use client';

import { apiFetch } from './api';

export type Provider = 'google' | 'instagram' | 'facebook' | 'twitter';

const accountsEndpoint = () => '/accounts';
const oauthRedirectEndpoint = (provider: Provider) => `/auth/${provider}/redirect`;
const accountDisconnectEndpoint = (provider: Provider) => `/accounts/${provider}/disconnect`;
const syncProviderEndpoint = (provider: Provider) => `/sync/${provider}`;
const syncAllEndpoint = () => '/sync/all';

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
    const response = await apiFetch<AccountDto[]>(accountsEndpoint());
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
    const response = await apiFetch<{ authorization_url?: string; url?: string }>(oauthRedirectEndpoint(provider));
    const redirectUrl = response.authorization_url ?? response.url;
    if (!redirectUrl) {
        throw new Error('No redirect URL returned from OAuth endpoint');
    }
    return redirectUrl;
};

export const disconnectAccount = async (provider: Provider): Promise<void> => {
    await apiFetch(accountDisconnectEndpoint(provider), { method: 'POST', body: JSON.stringify({}) });
};

export const syncProvider = async (provider: Provider): Promise<void> => {
    await apiFetch(syncProviderEndpoint(provider), { method: 'POST', body: JSON.stringify({}) });
};

export const syncAll = async (): Promise<void> => {
    await apiFetch(syncAllEndpoint(), { method: 'POST', body: JSON.stringify({}) });
};


