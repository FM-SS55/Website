const config = require('./config');
const migrate = require('./utils/migrate');
const app = require('./app');

// Migrations are idempotent, so running them on every start means hosts without
// shell access (e.g. cPanel) never need a separate migrate step.
migrate()
  .then(() => {
    app.listen(config.port, () => console.log(`Mandafia Services running on port ${config.port}`));
  })
  .catch((err) => {
    console.error('Startup failed:', err);
    process.exit(1);
  });