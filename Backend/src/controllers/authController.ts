import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { env } from '../config/env';

const signToken = (id: number, role: string) => {
  return jwt.sign({ userId: id, role }, env.JWT_SECRET, {
    expiresIn: '90d',
  });
};

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Check if user exists & password is correct
  const result = await db.select().from(users).where(eq(users.email, email));
  const user = result[0];

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken(user.id, user.role);

  // Remove password from output
  const { passwordHash, ...userData } = user;

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: userData,
    },
  });
});

// Helper to create admin user (for dev/seeding)
export const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    const passwordHash = await bcrypt.hash(password, 12);
    
    const newUser = await db.insert(users).values({
        email,
        passwordHash,
        name,
        role: 'admin'
    }).returning();

    res.status(201).json({
        status: 'success',
        data: {
            user: newUser[0]
        }
    });
});
