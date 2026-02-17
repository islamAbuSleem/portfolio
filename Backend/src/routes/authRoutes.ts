import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

router.post('/login', authController.login);
// router.post('/create-admin', authController.createAdmin); // Uncomment to create initial admin

export default router;
