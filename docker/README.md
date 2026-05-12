# Docker assets

Files in this directory support the Docker compose stacks at the repo root.

| File                | Purpose                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------- |
| `postgres-init.sql` | Runs once when the Postgres container is first created. Enables `pgcrypto`, `citext`, `unaccent`, `pg_trgm`. |
| `nginx.conf`        | Reverse proxy config for the self-host production stack (`docker-compose.prod.yml`).      |

Top-level files:

- `docker-compose.yml` — local dev (postgres + app)
- `docker-compose.prod.yml` — self-host production (nginx + postgres + app)
- `Dockerfile` — production multi-stage build (Next.js standalone)
- `Dockerfile.dev` — dev image with hot-reload
