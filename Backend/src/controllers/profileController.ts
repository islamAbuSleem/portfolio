import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { profile } from '../db/schema';
import { eq } from 'drizzle-orm';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { z } from 'zod';

const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  title: z.string().min(1, 'Title is required'),
  tagline: z.string().optional(),
  bio: z.string().min(1, 'Bio is required'),
  location: z.string().optional(),
  email: z.string().email('Invalid email').optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
  resumeUrl: z.string().optional(),
  website: z.string().optional(),
  socialLinks: z.object({
    github: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    youtube: z.string().optional(),
    dev: z.string().optional(),
  }).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoImage: z.string().optional(),
  metaKeywords: z.string().optional(),
  themeColor: z.string().default('#3b82f6'),
  showResume: z.boolean().default(true),
  showContact: z.boolean().default(true),
});

// Get or create profile
export const getProfile = catchAsync(async (req: Request, res: Response) => {
  let profileData = await db.select().from(profile).limit(1);
  
  // If no profile exists, create default one
  if (profileData.length === 0) {
    const newProfile = await db.insert(profile).values({
      fullName: 'Your Name',
      title: 'Software Engineer',
      bio: 'Write a compelling bio about yourself here...',
      updatedAt: new Date(),
    }).returning();
    profileData = newProfile;
  }

  res.status(200).json({
    status: 'success',
    data: {
      profile: profileData[0],
    },
  });
});

// Update profile
export const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validation = profileSchema.safeParse(req.body);
  if (!validation.success) {
    return next(new AppError(JSON.stringify(validation.error.format()), 400));
  }

  // Check if profile exists
  const existingProfile = await db.select().from(profile).limit(1);
  
  let updatedProfile;
  if (existingProfile.length === 0) {
    // Create new profile
    updatedProfile = await db.insert(profile).values({
      ...validation.data,
      updatedAt: new Date(),
    }).returning();
  } else {
    // Update existing
    updatedProfile = await db.update(profile)
      .set({
        ...validation.data,
        updatedAt: new Date(),
      })
      .where(eq(profile.id, existingProfile[0].id))
      .returning();
  }

  res.status(200).json({
    status: 'success',
    data: {
      profile: updatedProfile[0],
    },
  });
});

// Upload resume
export const uploadResume = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(new AppError('No file provided', 400));
  }

  // Note: In production, you'd upload to S3/Cloudinary here
  // For now, return the file path
  const resumeUrl = `/uploads/${req.file.filename}`;

  res.status(200).json({
    status: 'success',
    data: {
      resumeUrl,
    },
  });
});
