import { app } from './app';
import { env } from './config/env';

const server = app.listen(env.PORT, () => {
  console.log(`====================================================`);
  console.log(`🏛️  ContraBoard Backend Service Active`);
  console.log(`📡  Listening on: http://localhost:${env.PORT}`);
  console.log(`⚡  Environment: ${env.NODE_ENV}`);
  console.log(`🗄️  Database: ${env.DB_PATH}`);
  console.log(`====================================================`);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down gracefully...');
  server.close(() => {
    console.log('ContraBoard HTTP server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down gracefully...');
  server.close(() => {
    console.log('ContraBoard HTTP server closed.');
    process.exit(0);
  });
});
