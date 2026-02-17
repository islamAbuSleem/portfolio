import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { skills } from '../db/schema';
import { eq, count } from 'drizzle-orm';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { getPaginationParams, createPaginatedResponse, buildPaginationLinks } from '../utils/pagination';
import { z } from 'zod';

const skillSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  level: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export const getAllSkills = catchAsync(async (req: Request, res: Response) => {
  const pagination = getPaginationParams(req);
  
  // Get total count for pagination
  const totalCountResult = await db.select({ count: count() }).from(skills);
  const totalItems = totalCountResult[0].count;
  
  // Get paginated results
  const result = await db
    .select()
    .from(skills)
    .limit(pagination.limit)
    .offset(pagination.skip);
  
  const paginatedResponse = createPaginatedResponse(result, totalItems, pagination);
  const links = buildPaginationLinks(`${req.protocol}://${req.get('host')}${req.baseUrl}`, pagination, totalItems);
  
  res.status(200).json({
    status: 'success',
    data: {
      skills: paginatedResponse.data,
      pagination: paginatedResponse.pagination,
      links,
    },
  });
});

export const createSkill = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validation = skillSchema.safeParse(req.body);
  if (!validation.success) {
      return next(new AppError(JSON.stringify(validation.error.format()), 400));
  }

  const newSkill = await db.insert(skills).values(validation.data).returning();

  res.status(201).json({
    status: 'success',
    data: {
      skill: newSkill[0],
    },
  });
});

export const updateSkill = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const validation = skillSchema.partial().safeParse(req.body);
  if (!validation.success) {
      return next(new AppError(JSON.stringify(validation.error.format()), 400));
  }

  const updatedSkill = await db.update(skills)
    .set(validation.data)
    .where(eq(skills.id, id))
    .returning();

  if (!updatedSkill.length) {
    return next(new AppError('No skill found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      skill: updatedSkill[0],
    },
  });
});

export const deleteSkill = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const deleted = await db.delete(skills).where(eq(skills.id, id)).returning();

  if (!deleted.length) {
    return next(new AppError('No skill found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
