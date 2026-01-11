'use client';

import clsx from 'clsx';
import { RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import {
  PROVIDERS,
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
  // Demo mode: Always use initial state, no API calls
  const [accounts] = useState<AccountConnection[]>(initialState);
  const [loading] = useState(false);
  const [syncingAll] = useState(false);
  const [actions, setActions] = useState<Record<Provider, 'connect' | 'disconnect' | 'sync' | null>>(buildActionState);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Demo mode: Skip API calls
  const loadAccounts = useCallback(async () => {
    // Silent fallback - no API calls in demo mode
  }, []);

  useEffect(() => {
    // Demo mode: Skip initial load
  }, []);

  const setProviderAction = (provider: Provider, action: 'connect' | 'disconnect' | 'sync' | null) => {
    setActions((prev) => ({ ...prev, [provider]: action }));
  };

  // Demo mode: Show toast instead of API calls
  const handleConnect = async (provider: Provider) => {
    setProviderAction(provider, 'connect');
    setTimeout(() => {
      setProviderAction(provider, null);
      setInfoMessage(`OAuth flow disabled in demo mode. In production, this would redirect to ${providerLabels[provider]} OAuth.`);
      setTimeout(() => setInfoMessage(null), 5000);
    }, 800);
  };

  const handleDisconnect = async (provider: Provider) => {
    setProviderAction(provider, 'disconnect');
    setTimeout(() => {
      setProviderAction(provider, null);
      setInfoMessage(`${providerLabels[provider]} disconnect disabled in demo mode.`);
      setTimeout(() => setInfoMessage(null), 3000);
    }, 500);
  };

  const handleSyncProvider = async (provider: Provider) => {
    setProviderAction(provider, 'sync');
    setTimeout(() => {
      setProviderAction(provider, null);
      setInfoMessage(`${providerLabels[provider]} sync disabled in demo mode.`);
      setTimeout(() => setInfoMessage(null), 3000);
    }, 800);
  };

  const handleSyncAll = async () => {
    // Demo mode: No-op
    setInfoMessage('Sync all disabled in demo mode.');
    setTimeout(() => setInfoMessage(null), 3000);
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

      {/* Demo mode banner */}
      <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
        <span className="text-primary">ℹ️</span>
        <span className="text-muted">Demo mode: Account connections are simulated.</span>
      </div>

      {infoMessage ? (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">{infoMessage}</div>
      ) : null}

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
    </section>
  );
};


