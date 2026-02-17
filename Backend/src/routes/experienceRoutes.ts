import { Router } from 'express';
import * as experienceController from '../controllers/experienceController';
import { protect, restrictTo } from '../middleware/auth';

const router = Router();

router.get('/', experienceController.getAllExperiences);

router.use(protect);
router.use(restrictTo('admin'));

router.post('/', experienceController.createExperience);
router.patch('/:id', experienceController.updateExperience);
router.delete('/:id', experienceController.deleteExperience);

export default router;
