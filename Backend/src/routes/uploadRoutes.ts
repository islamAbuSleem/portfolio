import { Router } from 'express';
import { 
  upload, 
  uploadSingleImage, 
  uploadMultipleImages, 
  deleteImageController 
} from '../controllers/uploadController';
import { protect, restrictTo } from '../middleware/auth';

const router = Router();

// Protect all upload routes
router.use(protect);
router.use(restrictTo('admin'));

// Upload single image
router.post('/image', upload.single('image'), uploadSingleImage);

// Upload multiple images
router.post('/images', upload.array('images', 5), uploadMultipleImages);

// Delete image
router.delete('/image/:publicId', deleteImageController);

export default router;
