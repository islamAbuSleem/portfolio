import { Request, Response, NextFunction } from 'express';

/**
 * Sanitizes user input to prevent XSS attacks
 * Removes potentially dangerous HTML/script tags and entities
 */
const sanitizeString = (str: string): string => {
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/<\/?[^>]+(>|$)/g, ''); // Remove remaining HTML tags
};

/**
 * Recursively sanitize an object, array, or string
 */
const sanitizeValue = (value: any): any => {
  if (typeof value === 'string') {
    return sanitizeString(value);
  }
  
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  
  if (value !== null && typeof value === 'object') {
    const sanitized: Record<string, any> = {};
    for (const [key, val] of Object.entries(value)) {
      sanitized[key] = sanitizeValue(val);
    }
    return sanitized;
  }
  
  return value;
};

/**
 * Middleware to sanitize request body, query, and params
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }
  
  next();
};

/**
 * Middleware to prevent NoSQL injection
 * Removes MongoDB operators from input (defense in depth, even though using PostgreSQL)
 */
export const preventNoSQLInjection = (req: Request, res: Response, next: NextFunction) => {
  const hasMongoOperators = (obj: any): boolean => {
    if (typeof obj !== 'object' || obj === null) return false;
    
    return Object.keys(obj).some(key => {
      if (key.startsWith('$')) return true;
      return hasMongoOperators(obj[key]);
    });
  };

  if (hasMongoOperators(req.body) || hasMongoOperators(req.query)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid input detected'
    });
  }

  next();
};

/**
 * Middleware to trim string values in request body
 */
export const trimInput = (req: Request, res: Response, next: NextFunction) => {
  const trimValue = (value: any): any => {
    if (typeof value === 'string') {
      return value.trim();
    }
    
    if (Array.isArray(value)) {
      return value.map(trimValue);
    }
    
    if (value !== null && typeof value === 'object') {
      const trimmed: Record<string, any> = {};
      for (const [key, val] of Object.entries(value)) {
        trimmed[key] = trimValue(val);
      }
      return trimmed;
    }
    
    return value;
  };

  if (req.body) {
    req.body = trimValue(req.body);
  }

  next();
};
