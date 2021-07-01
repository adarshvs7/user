const APIError = require('./APIError');
const { apiFmt } = require('../services/formatter')


module.exports = (err, req, res, next) => {
    if (err instanceof APIError) {
        res.status(err.httpCode).json(apiFmt({}, err.message, true, err.details))
    }
    else if (err) {
        console.log(err)
        message = err.message
        res.status(500).json(apiFmt({}, message, true, err.detail));
    }
};