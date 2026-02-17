import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { messages } from '../db/schema';
import { eq, desc, count } from 'drizzle-orm';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { getPaginationParams, createPaginatedResponse, buildPaginationLinks } from '../utils/pagination';
import { z } from 'zod';

const messageSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(1),
});

export const createMessage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validation = messageSchema.safeParse(req.body);
  if (!validation.success) {
      return next(new AppError(JSON.stringify(validation.error.format()), 400));
  }

  const newMessage = await db.insert(messages).values(validation.data).returning();

  res.status(201).json({
    status: 'success',
    data: {
      message: newMessage[0],
    },
  });
});

export const getAllMessages = catchAsync(async (req: Request, res: Response) => {
  const pagination = getPaginationParams(req);
  
  // Get total count for pagination
  const totalCountResult = await db.select({ count: count() }).from(messages);
  const totalItems = totalCountResult[0].count;
  
  // Get paginated results
  const result = await db
    .select()
    .from(messages)
    .orderBy(desc(messages.createdAt))
    .limit(pagination.limit)
    .offset(pagination.skip);
  
  const paginatedResponse = createPaginatedResponse(result, totalItems, pagination);
  const links = buildPaginationLinks(`${req.protocol}://${req.get('host')}${req.baseUrl}`, pagination, totalItems);
  
  res.status(200).json({
    status: 'success',
    data: {
      messages: paginatedResponse.data,
      pagination: paginatedResponse.pagination,
      links,
    },
  });
});

export const markAsRead = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updated = await db.update(messages)
        .set({ isRead: true })
        .where(eq(messages.id, id))
        .returning();

    if (!updated.length) {
        return next(new AppError('No message found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            message: updated[0]
        }
    });
});

export const deleteMessage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const deleted = await db.delete(messages).where(eq(messages.id, id)).returning();

    if (!deleted.length) {
        return next(new AppError('No message found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
