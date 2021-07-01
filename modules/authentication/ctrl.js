const { validationResult, body } = require('express-validator');
const APIError = require('../errors/APIError');
const db = require('../db');
const jwtAuth = require('./jwt-auth');
const { apiFmt } = require('../services/formatter');
const bcrypt = require('bcryptjs');



async function signup(req, res, next) {
    try {
        validateRequest(req);
        const user = req.body;
        let userQuery = db.getQueryBuilder('user')
            .where({ username: user.username }).orWhere({ email: user.email }).first()
        let userCheck = await db.executeQuery(userQuery)
        if (userCheck) throw new APIError(409, 'User Already exists');
        user.password = await generateSalt(user.password);
        const response = await db.insertDoc('user', user)
        res.json(apiFmt(response, "Signup Success"));
    } catch (e) {
        console.log(e);
        next(e);
    }
}

async function login(req, res, next) {
    try {
        validateRequest(req);
        const user = req.body;
        let userQuery = db.getQueryBuilder('user')
            .where({ username: user.username }).first()
        let userCheck = await db.executeQuery(userQuery)
        if (!userCheck) throw new APIError(400, 'User does not exists');
        let userValid = await bcrypt.compare(user.password, userCheck.password)
        if(!userValid) throw new APIError(401,'Invalid password');
        console.log(userCheck)
        const idToken = jwtAuth.generateToken(userCheck, process.env.JWT_KEY);
        res.json(apiFmt({user: userCheck,idToken}, "login Success"));
    } catch (e) {
        console.log(e);
        next(e);
    }
}
async function generateSalt(password) {
    let salt = await bcrypt.genSalt();
    return await bcrypt.hash(password.toString(), salt);
}

function validateRequest(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new APIError(400, "Invalid request", errors);
    }
}

function validate(method) {

    switch (method) {
        case 'signup': {
            return [
                body('username', 'username is a required field').exists().isString(),
                body('email', 'Invalid email').isEmail().exists(),
                body('password', 'password is a required field').exists().isString().isLength({ min: 6 }),
            ]
        }
        case 'login': {
            return [
                body('username', 'username required').exists(),
                body('password', 'password is a required field').exists().isString().isLength({ min: 6 })
            ]
        }
        case 'verify_email': {
            return [
                body('code', "Invalid Code").exists()

            ]
        }
    }
}

module.exports = {
    validate,
    signup,
    login
}
