import { Request } from 'express';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * Extract and validate pagination parameters from request query
 */
export const getPaginationParams = (req: Request): PaginationParams => {
  const parsedPage = parseInt(req.query.page as string);
  const parsedLimit = parseInt(req.query.limit as string);
  
  // Handle page: use 1 if not provided, NaN, or less than 1
  const page = Math.max(1, isNaN(parsedPage) ? 1 : parsedPage);
  
  // Handle limit: use 10 if not provided or NaN, enforce minimum of 1 and maximum of 100
  let limit = isNaN(parsedLimit) ? 10 : parsedLimit;
  limit = Math.min(100, Math.max(1, limit));
  
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Create a paginated response object
 */
export const createPaginatedResponse = <T>(
  data: T[],
  totalItems: number,
  paginationParams: PaginationParams
): PaginatedResponse<T> => {
  const { page, limit } = paginationParams;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Build pagination links for API responses
 */
export const buildPaginationLinks = (
  baseUrl: string,
  paginationParams: PaginationParams,
  totalItems: number
): { self: string; first: string; last: string; next?: string; prev?: string } => {
  const { page, limit } = paginationParams;
  const totalPages = Math.ceil(totalItems / limit);

  const buildUrl = (p: number) => `${baseUrl}?page=${p}&limit=${limit}`;

  const links: any = {
    self: buildUrl(page),
    first: buildUrl(1),
    last: buildUrl(totalPages),
  };

  if (page < totalPages) {
    links.next = buildUrl(page + 1);
  }

  if (page > 1) {
    links.prev = buildUrl(page - 1);
  }

  return links;
};
