const { validationResult, body } = require('express-validator');
const APIError = require('../errors/APIError');
const db = require('../db');
const jwtAuth = require('./jwt-auth');
const { apiFmt } = require('../services/formatter');
const bcrypt = require('bcryptjs');



async function update(req, res, next) {
    try {
        validateRequest(req);
        const user = req.user;
        const response = await db.updateWithCondition('user', {id:user.id},{...req.body})
        userUpdate = {...user,...req.body}
        const idToken = jwtAuth.generateToken(userUpdate, process.env.JWT_KEY);
        res.json(apiFmt({user:userUpdate,idToken}, "update Success"));
    } catch (e) {
        console.log(e);
        next(e);
    }
}
function validateRequest(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new APIError(400, "Invalid request", errors);
    }
}

function validate(method) {

    switch (method) {
        case 'update': {
            return [
                body('username', 'username is a required field').exists().isString(),
                body('password', 'password is a required field').exists().isString().isLength({ min: 6 }),
            ]
        }
    }
}

module.exports = {
    validate,
    update
}
