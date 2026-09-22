// PM2 process definition for the backend. `pm2 startOrRestart` is idempotent —
// safe to run on every deploy whether the app is already running or not.
// App secrets (DATABASE_URL, CLIENT_ORIGIN, RESEND_API_KEY, ...) come from
// Backend/.env on the server via `dotenv/config` (see src/index.ts) — this
// file is intentionally never touched by the deploy workflow.
module.exports = {
  apps: [
    {
      name: 'boat-brokers-backend',
      script: 'dist/index.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
