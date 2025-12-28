/* eslint-disable tailwindcss/classnames-order */
'use client';

import clsx from 'clsx';
import {
  Facebook,
  Instagram,
  Mail,
  RefreshCw,
  Share2,
  Twitter,
  type LucideIcon
} from 'lucide-react';

import type { Provider } from '@/services/accountService';

const providerConfig: Record<
  Provider,
  {
    label: string;
    icon: LucideIcon;
    accent: string;
    description: string;
  }
> = {
  google: {
    label: 'Google',
    icon: Mail,
    accent: 'text-[#DB4437]',
    description: 'Gmail, Workspace, and device security signals'
  },
  instagram: {
    label: 'Instagram',
    icon: Instagram,
    accent: 'text-[#E4405F]',
    description: 'Followers, media insights, and login telemetry'
  },
  facebook: {
    label: 'Facebook',
    icon: Facebook,
    accent: 'text-[#1877F2]',
    description: 'Page activity, audience quality, and auth state'
  },
  twitter: {
    label: 'X',
    icon: Twitter,
    accent: 'text-[#1D9BF0]',
    description: 'Profile footprint, reach, and session history'
  }
};

const formatSyncedAt = (value?: string | null) => {
  if (!value) return 'Never synced';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Pending sync';
  return `Last synced ${date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  })} · ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
};

export interface ProviderCardProps {
  provider: Provider;
  connected: boolean;
  username?: string;
  email?: string;
  lastSyncedAt?: string | null;
  isConnecting?: boolean;
  isDisconnecting?: boolean;
  isSyncing?: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onSync?: () => void;
}

export const ProviderCard = ({
  provider,
  connected,
  username,
  email,
  lastSyncedAt,
  isConnecting,
  isDisconnecting,
  isSyncing,
  onConnect,
  onDisconnect,
  onSync
}: ProviderCardProps) => {
  const config = providerConfig[provider];
  const Icon = config.icon;
  const statusLabel = connected ? `Connected as ${username ?? email ?? '—'}` : 'Not connected';
  // Check if API is available - NEXT_PUBLIC_ vars are available at build time in client components
  const apiAvailable = Boolean(process.env.NEXT_PUBLIC_API_URL);

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-surface p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center gap-3">
        <span
          className={clsx(
            'flex h-12 w-12 items-center justify-center rounded-2xl border border-border/60 bg-background/80 text-[1.4rem]',
            config.accent
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-base font-semibold text-foreground">{config.label}</p>
          <p className={clsx('text-sm', connected ? 'text-success' : 'text-muted')}>{statusLabel}</p>
        </div>
      </div>

      <p className="text-xs text-muted">{config.description}</p>
      <p className="text-xs text-muted">{formatSyncedAt(lastSyncedAt)}</p>

      <div className="mt-auto flex flex-wrap gap-2">
        {!connected ? (
          <button
            type="button"
            onClick={apiAvailable ? onConnect : undefined}
            disabled={isConnecting || !apiAvailable}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary/90 px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary disabled:opacity-60 disabled:cursor-not-allowed"
            title={!apiAvailable ? 'Integration coming soon - API not configured' : undefined}
          >
            <Share2 className="h-4 w-4" />
            {isConnecting ? 'Opening...' : apiAvailable ? 'Connect' : 'Coming Soon'}
          </button>
        ) : (
          <>
            {onSync ? (
              <button
                type="button"
                onClick={onSync}
                disabled={isSyncing}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border/70 px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-surface-muted disabled:opacity-60"
              >
                <RefreshCw className={clsx('h-4 w-4', isSyncing && 'animate-spin')} />
                {isSyncing ? 'Syncing' : 'Sync now'}
              </button>
            ) : null}
            <button
              type="button"
              onClick={onDisconnect}
              disabled={isDisconnecting}
              className={clsx(
                'bg-surface-muted disabled:opacity-60 flex-1 font-semibold gap-2 hover:bg-surface inline-flex items-center justify-center px-3 py-2 rounded-xl text-muted-foreground text-sm transition'
              )}
            >
              {isDisconnecting ? 'Disconnecting' : 'Disconnect'}
            </button>
          </>
        )}
      </div>
    </article>
  );
};

/* eslint-enable tailwindcss/classnames-order */
