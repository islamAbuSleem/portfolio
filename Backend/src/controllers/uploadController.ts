import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { uploadImage, deleteImage } from '../utils/cloudinary';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import fs from 'fs';

// Configure multer for temporary file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter for images only
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'));
  }
};

// Configure multer upload
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 5, // Max 5 files per request
  },
});

/**
 * Upload single image
 * POST /api/upload/image
 */
export const uploadSingleImage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(new AppError('No image file provided', 400));
  }

  const { folder = 'general' } = req.body;

  try {
    const result = await uploadImage(req.file.path, folder);
    
    // Clean up temporary file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      status: 'success',
      data: {
        url: result.url,
        publicId: result.publicId,
      },
    });
  } catch (error) {
    // Clean up temporary file on error
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    throw error;
  }
});

/**
 * Upload multiple images
 * POST /api/upload/images
 */
export const uploadMultipleImages = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as Express.Multer.File[];
  
  if (!files || files.length === 0) {
    return next(new AppError('No image files provided', 400));
  }

  const { folder = 'general' } = req.body;

  try {
    const uploadPromises = files.map(file => uploadImage(file.path, folder));
    const results = await Promise.all(uploadPromises);

    // Clean up temporary files
    files.forEach(file => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });

    res.status(200).json({
      status: 'success',
      results: results.length,
      data: {
        images: results.map(r => ({
          url: r.url,
          publicId: r.publicId,
        })),
      },
    });
  } catch (error) {
    // Clean up temporary files on error
    files.forEach(file => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
    throw error;
  }
});

/**
 * Delete image from Cloudinary
 * DELETE /api/upload/image/:publicId
 */
export const deleteImageController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { publicId } = req.params;

  if (!publicId) {
    return next(new AppError('Public ID is required', 400));
  }

  await deleteImage(publicId);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
