const { Router } = require('express');
const router = Router();
const ctrl = require('./ctrl')

router.post('/update', ctrl.validate('signup'), ctrl.update);
module.exports = router;
