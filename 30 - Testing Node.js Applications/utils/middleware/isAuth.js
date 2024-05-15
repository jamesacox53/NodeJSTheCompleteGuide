import jsonwebtoken from  'jsonwebtoken';

import jsonWebTokenSecretStr from '../../sensitive/jsonWebTokenSecretStr.js';

export default (request, response, next) => {
    _isAuth();

    function _isAuth() {
        const authHeaderStr = request.get('Authorization');
        if (!authHeaderStr) return _authHeaderDoesntExist();

        // authHeaderStr should be 'Bearer jwtStr'
        const jwtStr = authHeaderStr.split(' ')[1];
        if(!jwtStr) return _authHeaderIncorrect();

        const decodedToken = _verifyJWTStr(jwtStr);
        if (!decodedToken) return _notAuthenticated();

        request.userID = decodedToken.userId;
        return next();
    }
    
    function _authHeaderDoesntExist() {
        const error = new Error("Authorization header doesn't exist.");
        error.u_statusCode = 401;

        throw error;
    }

    function _authHeaderIncorrect() {
        const error = new Error("Authorization header should be in the format of 'Bearer jwtStr'.");
        error.u_statusCode = 401;

        throw error;
    }

    function _verifyJWTStr(jwtStr) {
        try {
            return jsonwebtoken.verify(jwtStr, jsonWebTokenSecretStr);
        
        } catch (err) {
            err.u_statusCode = 500;

            throw err;
        }
    }

    function _notAuthenticated() {
        const error = new Error('Not Authenticated.');
        error.u_statusCode = 401;

        throw error;
    }
};