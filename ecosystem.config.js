module.exports = {
  apps: [{
    name: 'canta-management',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/canta-management',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      DATABASE_URL: 'file:/opt/canta-management/data/production.db',
      UPLOAD_DIR: '/opt/canta-management/uploads'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      DATABASE_URL: 'file:/opt/canta-management/data/production.db',
      UPLOAD_DIR: '/opt/canta-management/uploads'
    }
  }]
}
