import * as Sentry from '@sentry/node';
import { env } from './env';

/**
 * Initialize Sentry for error tracking and performance monitoring
 */
export const initSentry = () => {
  if (!env.SENTRY_DSN) {
    console.log('⚠️  SENTRY_DSN not configured. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
    beforeSend(event) {
      // Don't send events in development unless explicitly enabled
      if (env.NODE_ENV === 'development' && !process.env.SENTRY_ENABLED_IN_DEV) {
        console.log('🐛 Sentry event (dev):', event.message);
        return null;
      }
      return event;
    },
  });

  console.log('✅ Sentry initialized successfully');
};

/**
 * Capture an error with optional context
 */
export const captureError = (error: Error, context?: Record<string, any>) => {
  if (env.SENTRY_DSN) {
    Sentry.captureException(error, {
      contexts: context ? { extra: context } : undefined,
    });
  }
};

/**
 * Set user context for Sentry
 */
export const setSentryUser = (user: { id: string | number; email?: string; username?: string }) => {
  if (env.SENTRY_DSN) {
    Sentry.setUser({
      id: String(user.id),
      email: user.email,
      username: user.username,
    });
  }
};

/**
 * Clear user context from Sentry
 */
export const clearSentryUser = () => {
  if (env.SENTRY_DSN) {
    Sentry.setUser(null);
  }
};
