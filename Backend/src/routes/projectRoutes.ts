import { Router } from 'express';
import * as projectController from '../controllers/projectController';
import { protect, restrictTo } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProject);

// Protected routes (Admin only)
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', projectController.createProject);
router.patch('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

export default router;
