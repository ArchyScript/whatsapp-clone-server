import { Router } from 'express';
import { signup } from '../controller/auth-controller.js';

const router = Router();

// const verifyToken = require('../middleware/auth-middleware')
// const multer = require('multer')

// const upload = multer({ dest: 'uploads/profiles/' })

router.post('/signup', signup);
// router.post('/login', login)
// router.get('/user-info', verifyToken, getUserInfo)
// router.put('/update-profile', verifyToken, updateProfile)
// router.post('/add-profile-image', verifyToken, upload.single('profile-image'), addProfileImage)
// router.delete('/remove-profile-image', verifyToken, removeProfileImage)

// module.exports = router
