'use client';

import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import type { Connection } from '@/lib/types';

interface ConnectionCardProps {
  connection: Connection;
}

export const ConnectionCard = ({ connection }: ConnectionCardProps) => {
  const [avatarError, setAvatarError] = useState(false);
  
  return (
    <article className="focus-ring flex flex-col gap-3 rounded-2xl border border-border/60 bg-surface p-4 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
          {connection.avatarUrl && !avatarError ? (
            <Image
              src={connection.avatarUrl}
              alt={`${connection.name} logo`}
              fill
              sizes="48px"
              className="object-cover"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-foreground">
              {connection.name.substring(0, 2).toUpperCase()}
            </span>
          )}
          <span
            className={clsx(
              'absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border border-surface',
              connection.isOnline ? 'bg-success' : 'bg-muted'
            )}
          >
            <span className="sr-only">
              {connection.isOnline ? 'Connection online' : 'Connection offline'}
            </span>
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{connection.name}</p>
          <p className="text-xs text-muted">{connection.title}</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          {connection.trustScore}%
        </span>
      </div>
      <div className="text-xs text-muted">
        <p>{connection.organization}</p>
        <p>
          Last signal{' '}
          {formatDistanceToNow(new Date(connection.lastActive), {
            addSuffix: true
          })}
        </p>
      </div>
    </article>
  );
};

