const router = require('express').Router()
const {   searchContacts } = require('../controller/contact-controller')
const verifyToken = require('../middleware/auth')
const multer = require('multer')

const upload = multer({ dest: 'uploads/profiles/' })
 
router.get('/search-contacts', verifyToken, searchContacts) 

module.exports = router