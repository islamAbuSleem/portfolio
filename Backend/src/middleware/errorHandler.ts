import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { env } from '../config/env';
import * as Sentry from '@sentry/node';

export const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let status = 'error';
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    status = err.status;
    message = err.message;
  } else {
    console.error('UNHANDLED ERROR 💥', err);
    
    // Send error to Sentry in production
    if (env.NODE_ENV === 'production' && env.SENTRY_DSN) {
      Sentry.captureException(err);
    }
    
    if (env.NODE_ENV === 'development') {
        message = err.message;
    }
  }

  res.status(statusCode).json({
    status,
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
