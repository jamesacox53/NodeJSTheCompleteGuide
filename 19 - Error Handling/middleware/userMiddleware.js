const path = require('path');

const rootDirectoryStr = path.dirname(require.main.filename);
const User = require(path.join(rootDirectoryStr, 'models', 'user.js'));

module.exports = (request, response, next) => {
    if (!request.session.user) {
        return next();
    }
    
    User.findById(request.session.user._id)
    .then(user => _userMiddleware(user))
    .catch(err => _handleError(err));

    function _userMiddleware(user) {
        if (!user)
            return next();

        request.user = user;
        next();
    }

    function _handleError(err) {
        throw new Error(err);
    }
};