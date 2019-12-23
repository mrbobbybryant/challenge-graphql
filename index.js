import throng from 'throng';
import startServer from './start-server';

const Sentry = require('@sentry/node');

if (process.env.SENTRY_TOKEN) {
  Sentry.init({
    dsn: process.env.SENTRY_TOKEN,
  });
}

const WORKERS = process.env.WEB_CONCURRENCY || 1;

throng(
  {
    workers: WORKERS,
    lifetime: Infinity,
  },
  startServer,
);
