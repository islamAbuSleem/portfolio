import { Router } from 'express';
import * as messageController from '../controllers/messageController';
import { protect, restrictTo } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = Router();

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 create message requests per windowMs
    message: 'Too many messages sent from this IP, please try again after an hour'
});

// Public - with rate limit
router.post('/', limiter, messageController.createMessage);

// Protected routes
router.use(protect);
router.use(restrictTo('admin'));

router.get('/', messageController.getAllMessages);
router.patch('/:id/read', messageController.markAsRead);
router.delete('/:id', messageController.deleteMessage);

export default router;
