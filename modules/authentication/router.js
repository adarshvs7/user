const { Router } = require('express');
const router = Router();
const ctrl = require('./ctrl')

router.post('/signup', ctrl.validate('signup'), ctrl.signup);
router.post('/login', ctrl.validate('login'), ctrl.login);
module.exports = router;
