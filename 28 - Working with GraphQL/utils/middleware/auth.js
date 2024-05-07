const path = require('path');
const jsonwebtoken = require('jsonwebtoken');
const jsonWebTokenSecretStr = require(path.join('..', '..', 'sensitive', 'jsonWebTokenSecretStr.js'));

module.exports = (request, response, next) => {
    auth();

    function auth() {
        const authHeaderStr = request.get('Authorization');
        if (!authHeaderStr) {
            request.isAuth = false;
            return next();
        }
        
        // authHeaderStr should be 'Bearer jwtStr'
        const jwtStr = authHeaderStr.split(' ')[1];
        if(!jwtStr) {
            request.isAuth = false;
            return next();
        }

        const decodedToken = _verifyJWTStr(jwtStr);
        if (!decodedToken) {
            request.isAuth = false;
            return next();
        }

        request.userID = decodedToken.userId;
        request.isAuth = true;
        return next();
    }

    function _verifyJWTStr(jwtStr) {
        try {
            return jsonwebtoken.verify(jwtStr, jsonWebTokenSecretStr);
        
        } catch (err) {
            return null;
        }
    }
};