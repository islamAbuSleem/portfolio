import { Router } from 'express';
import * as skillController from '../controllers/skillController';
import { protect, restrictTo } from '../middleware/auth';

const router = Router();

router.get('/', skillController.getAllSkills);

router.use(protect);
router.use(restrictTo('admin'));

router.post('/', skillController.createSkill);
router.patch('/:id', skillController.updateSkill);
router.delete('/:id', skillController.deleteSkill);

export default router;
