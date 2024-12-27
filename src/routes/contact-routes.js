const router = require('express').Router()
const { searchContacts } = require('../controller/contact-controller')
const validateToken = require('../middleware/auth')
const multer = require('multer')

const upload = multer({ dest: 'uploads/profiles/' })

router.get('/search-contacts', validateToken, searchContacts)

module.exports = router