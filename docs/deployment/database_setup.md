# Database Setup

Trace Trail uses PostgreSQL as the primary datastore. Follow this guide to spin
up a local instance or provision managed infrastructure for staging/production.

---

## Local Development

### Option 1 — Docker

```bash
docker run --name tracetrail-postgres \
  -e POSTGRES_USER=tracetrail \
  -e POSTGRES_PASSWORD=tracetrail \
  -e POSTGRES_DB=tracetrail \
  -p 5432:5432 \
  -d postgres:14
```

Update `backend/.env` with the matching credentials:

```
DATABASE_URL=postgresql+psycopg://tracetrail:tracetrail@localhost:5432/tracetrail
```

### Option 2 — Local install

- Install PostgreSQL via package manager (Homebrew/Chocolatey).
- Create database & user:

```sql
CREATE DATABASE tracetrail;
CREATE USER tracetrail WITH ENCRYPTED PASSWORD 'tracetrail';
GRANT ALL PRIVILEGES ON DATABASE tracetrail TO tracetrail;
```

---

## Managed Environments

- **Staging:** Use managed Postgres (e.g. Azure Database for PostgreSQL, AWS
  RDS). Enable automated backups and point-in-time recovery.
- **Production:** Enforce SSL connections, private networking, and monitoring
  (CPU, IOPS, connection count).

Apply migrations (`alembic upgrade head`) during deployment pipelines with
credentials stored in secret managers (Key Vault, Secret Manager, etc.).

---

## Maintenance Tasks

- **Backups:** Daily automated snapshots + manual before major releases.
- **Vacuum/Analyze:** Schedule `VACUUM (ANALYZE)` weekly for large tables.
- **Monitoring:** Track slow queries via pg_stat_statements; tune indexes based
  on actual workload.

---

## Disaster Recovery

1. Restore from latest snapshot.
2. Replay WAL logs if point-in-time restore is enabled.
3. Update application `DATABASE_URL` to point to the restored instance.

Document recovery tests at least once per quarter.


