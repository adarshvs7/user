var jwt = require('jsonwebtoken');

function verifyToken(token, secretOrPem, ignore = false) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretOrPem, { ignoreExpiration: ignore }, function (err, payload) {
            if (err) {
                reject(err)
            } else {
                resolve(payload);
            }
        });
    });
}

function generateToken(payload, secretOrPem) {
    let token;
    token = jwt.sign({...payload}, secretOrPem, { expiresIn: '8h' });
    console.log(token)
    return token;
}

module.exports = {
    verifyToken,
    generateToken
}