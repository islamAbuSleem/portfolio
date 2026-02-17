import { Router } from 'express';
import { 
  getProfile, 
  updateProfile, 
  uploadResume 
} from '../controllers/profileController';
import { protect, restrictTo } from '../middleware/auth';
import { upload } from '../controllers/uploadController';

const router = Router();

// Public route - anyone can view profile
router.get('/', getProfile);

// Protected routes - admin only
router.use(protect);
router.use(restrictTo('admin'));

router.patch('/', updateProfile);
router.post('/resume', upload.single('resume'), uploadResume);

export default router;
