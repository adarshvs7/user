const jwtAuth = require('./jwt-auth');
const APIError = require('../errors/APIError');

async function idMiddleware(req, res, next) {
    const ID = req.header('ID');
    if (ID) {
        try {
            const payload = await jwtAuth.verifyToken(ID, process.env.JWT_KEY);
            req.user = payload;
        } catch (e) {
            next(new APIError(401, 'Invalid ID token provided'));
        }
    }
    else {
        next(new APIError(401, 'ID Token required to access the route'));
    }
    next();
}

module.exports = { idMiddleware };