'use client';

import clsx from 'clsx';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import {
  PROVIDERS,
  disconnectAccount,
  getAccounts,
  getOAuthRedirectUrl,
  syncAll,
  syncProvider,
  type AccountConnection,
  type Provider
} from '@/services/accountService';

import { ProviderCard } from './ProviderCard';

const providerLabels: Record<Provider, string> = {
  google: 'Google',
  instagram: 'Instagram',
  facebook: 'Facebook',
  twitter: 'X'
};

const initialState: AccountConnection[] = PROVIDERS.map((provider) => ({
  provider,
  connected: false,
  lastSyncedAt: null
}));

const buildActionState = () =>
  PROVIDERS.reduce(
    (acc, provider) => ({
      ...acc,
      [provider]: null as 'connect' | 'disconnect' | 'sync' | null
    }),
    {} as Record<Provider, 'connect' | 'disconnect' | 'sync' | null>
  );

export const ConnectedAccounts = () => {
  const [accounts, setAccounts] = useState<AccountConnection[]>(initialState);
  const [loading, setLoading] = useState(true);
  const [syncingAll, setSyncingAll] = useState(false);
  const [actions, setActions] = useState<Record<Provider, 'connect' | 'disconnect' | 'sync' | null>>(buildActionState);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAccounts();
      setAccounts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load accounts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAccounts();
  }, [loadAccounts]);

  const setProviderAction = (provider: Provider, action: 'connect' | 'disconnect' | 'sync' | null) => {
    setActions((prev) => ({ ...prev, [provider]: action }));
  };

  const handleConnect = async (provider: Provider) => {
    try {
      setProviderAction(provider, 'connect');
      const url = await getOAuthRedirectUrl(provider);
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to initiate OAuth flow');
      setProviderAction(provider, null);
    }
  };

  const handleDisconnect = async (provider: Provider) => {
    try {
      setProviderAction(provider, 'disconnect');
      await disconnectAccount(provider);
      await loadAccounts();
      setInfoMessage(`${providerLabels[provider]} disconnected.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to disconnect account');
    } finally {
      setProviderAction(provider, null);
    }
  };

  const handleSyncProvider = async (provider: Provider) => {
    try {
      setProviderAction(provider, 'sync');
      await syncProvider(provider);
      await loadAccounts();
      setInfoMessage(`${providerLabels[provider]} synced just now.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setProviderAction(provider, null);
    }
  };

  const handleSyncAll = async () => {
    try {
      setSyncingAll(true);
      await syncAll();
      await loadAccounts();
      setInfoMessage('Accounts queued for refresh.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sync all accounts');
    } finally {
      setSyncingAll(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-surface p-6 shadow-soft md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Integrations</p>
          <h1 className="mt-2 text-2xl font-semibold text-foreground">Connected accounts</h1>
          <p className="mt-1 text-sm text-muted">
            Keep Google, Instagram, Facebook, and X in sync so TraceTrail can fetch security and footprint signals.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSyncAll}
          disabled={syncingAll || loading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/70 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-surface-muted disabled:opacity-60"
        >
          <RefreshCw className={clsx('h-4 w-4', syncingAll && 'animate-spin')} />
          {syncingAll ? 'Syncing all' : 'Sync all now'}
        </button>
      </header>

      {error ? (
        <div className="flex items-center gap-3 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}

      {infoMessage ? (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">{infoMessage}</div>
      ) : null}

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/60 bg-surface p-8 text-sm text-muted">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading account status...
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {accounts.map((account) => (
            <ProviderCard
              key={account.provider}
              provider={account.provider}
              connected={account.connected}
              username={account.username}
              email={account.email}
              lastSyncedAt={account.lastSyncedAt}
              onConnect={() => handleConnect(account.provider)}
              onDisconnect={() => handleDisconnect(account.provider)}
              onSync={() => handleSyncProvider(account.provider)}
              isConnecting={actions[account.provider] === 'connect'}
              isDisconnecting={actions[account.provider] === 'disconnect'}
              isSyncing={actions[account.provider] === 'sync'}
            />
          ))}
        </div>
      )}
    </section>
  );
};


