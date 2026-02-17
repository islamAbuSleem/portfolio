import app from './app';
import { env } from './config/env';
import { initSentry } from './config/sentry';

// Initialize Sentry before starting the server
initSentry();

const port = env.PORT;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port} in ${env.NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});
