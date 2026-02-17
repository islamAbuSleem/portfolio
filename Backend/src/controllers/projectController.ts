import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { projects } from '../db/schema';
import { eq, desc, count } from 'drizzle-orm';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { getPaginationParams, createPaginatedResponse, buildPaginationLinks } from '../utils/pagination';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  techStack: z.array(z.string()),
  repoUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  imageUrls: z.array(z.string()).optional(),
  year: z.number().optional(),
  category: z.string().optional(),
});

export const getAllProjects = catchAsync(async (req: Request, res: Response) => {
  const pagination = getPaginationParams(req);
  
  // Get total count for pagination
  const totalCountResult = await db.select({ count: count() }).from(projects);
  const totalItems = totalCountResult[0].count;
  
  // Get paginated results
  const result = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.year))
    .limit(pagination.limit)
    .offset(pagination.skip);
  
  const paginatedResponse = createPaginatedResponse(result, totalItems, pagination);
  const links = buildPaginationLinks(`${req.protocol}://${req.get('host')}${req.baseUrl}`, pagination, totalItems);
  
  res.status(200).json({
    status: 'success',
    data: {
      projects: paginatedResponse.data,
      pagination: paginatedResponse.pagination,
      links,
    },
  });
});

export const getProject = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await db.select().from(projects).where(eq(projects.id, id));
  
  if (!result.length) {
    return next(new AppError('No project found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      project: result[0],
    },
  });
});

export const createProject = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validation = projectSchema.safeParse(req.body);
  if (!validation.success) {
      return next(new AppError(JSON.stringify(validation.error.format()), 400));
  }

  const newProject = await db.insert(projects).values(validation.data).returning();

  res.status(201).json({
    status: 'success',
    data: {
      project: newProject[0],
    },
  });
});

export const updateProject = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const validation = projectSchema.partial().safeParse(req.body);
  if (!validation.success) {
      return next(new AppError(JSON.stringify(validation.error.format()), 400));
  }

  const updatedProject = await db.update(projects)
    .set({ ...validation.data, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning();

  if (!updatedProject.length) {
    return next(new AppError('No project found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      project: updatedProject[0],
    },
  });
});

export const deleteProject = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const deleted = await db.delete(projects).where(eq(projects.id, id)).returning();

  if (!deleted.length) {
    return next(new AppError('No project found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
