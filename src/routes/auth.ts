import { Router } from 'express';
import { signup, login } from '../controller/auth';
import { verifyToken } from '../middleware/auth';

const router: Router = Router();

// const verifyToken = require('../middleware/auth-middleware')
// const multer = require('multer')

router.post('/signup', signup);
router.post('/login', login); 
router.get('/test', (req: any, res: any) => {
  res.send('Welcome to test');
}); 

export default router;
