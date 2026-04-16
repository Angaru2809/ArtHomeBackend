/**
 * Escalado horizontal por procesos (Twelve-Factor VIII).
 * Uso: npm run build && npm run start:cluster
 */
module.exports = {
  apps: [
    {
      name: 'arthome-api',
      script: './dist/index.js',
      instances: 2,
      exec_mode: 'cluster',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '512M',
    },
  ],
};
