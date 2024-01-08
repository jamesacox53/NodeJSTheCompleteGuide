const path = require('path');

const rootDirectoryStr = path.dirname(require.main.filename);
const User = require(path.join(rootDirectoryStr, 'models', 'user.js'));

module.exports = (request, response, next) => {
    if (!request.session.user) {
        return next();
    }
    
    User.findById(request.session.user._id)
    .then(user => _addUserToRequest(user, request))
    .then(err => _gotoNextMiddleware(next))
    .catch(err => console.log(err));

    function _addUserToRequest(user, request) {
        request.user = user;
    }

    function _gotoNextMiddleware(next) {
        next();
    }
};