var express = require('express');
var router = express.Router();

router.use('/', require('./user'));
router.use('/administrator', require('./administrator'));
router.use('/auth', require('./auth'));
router.use('/writer', require('./writer'));

module.exports = router;