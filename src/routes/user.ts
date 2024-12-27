import { Router } from 'express';
import { updateUserStatus } from '../controller/user';
import { validateToken } from '../middleware/auth';

const router: Router = Router();

// const validateToken = require('../middleware/auth-middleware')
// const multer = require('multer')

router.post('/update-user', updateUserStatus); 
router.get('/test', (req: any, res: any) => {
  res.send('Welcome to test');
}); 

export default router;
