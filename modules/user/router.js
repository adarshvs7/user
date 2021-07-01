const { Router } = require('express');
const router = Router();
const ctrl = require('./ctrl')

router.post('/update', ctrl.validate('update'), ctrl.update);
module.exports = router;
