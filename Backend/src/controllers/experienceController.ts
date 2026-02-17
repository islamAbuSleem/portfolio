import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { experiences } from '../db/schema';
import { eq, asc, count } from 'drizzle-orm';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { getPaginationParams, createPaginatedResponse, buildPaginationLinks } from '../utils/pagination';
import { z } from 'zod';

const experienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  period: z.string().min(1),
  description: z.string().min(1),
  technologies: z.array(z.string()),
  order: z.number().optional(),
});

export const getAllExperiences = catchAsync(async (req: Request, res: Response) => {
  const pagination = getPaginationParams(req);
  
  // Get total count for pagination
  const totalCountResult = await db.select({ count: count() }).from(experiences);
  const totalItems = totalCountResult[0].count;
  
  // Get paginated results
  const result = await db
    .select()
    .from(experiences)
    .orderBy(asc(experiences.order))
    .limit(pagination.limit)
    .offset(pagination.skip);
  
  const paginatedResponse = createPaginatedResponse(result, totalItems, pagination);
  const links = buildPaginationLinks(`${req.protocol}://${req.get('host')}${req.baseUrl}`, pagination, totalItems);
  
  res.status(200).json({
    status: 'success',
    data: {
      experiences: paginatedResponse.data,
      pagination: paginatedResponse.pagination,
      links,
    },
  });
});

export const createExperience = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validation = experienceSchema.safeParse(req.body);
  if (!validation.success) {
      return next(new AppError(JSON.stringify(validation.error.format()), 400));
  }

  const newExperience = await db.insert(experiences).values(validation.data).returning();

  res.status(201).json({
    status: 'success',
    data: {
      experience: newExperience[0],
    },
  });
});

export const updateExperience = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const validation = experienceSchema.partial().safeParse(req.body);
  if (!validation.success) {
      return next(new AppError(JSON.stringify(validation.error.format()), 400));
  }

  const updatedExperience = await db.update(experiences)
    .set(validation.data)
    .where(eq(experiences.id, id))
    .returning();

  if (!updatedExperience.length) {
    return next(new AppError('No experience found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      experience: updatedExperience[0],
    },
  });
});

export const deleteExperience = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const deleted = await db.delete(experiences).where(eq(experiences.id, id)).returning();

  if (!deleted.length) {
    return next(new AppError('No experience found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
