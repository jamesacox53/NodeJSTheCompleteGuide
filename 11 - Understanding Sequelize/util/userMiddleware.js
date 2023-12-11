const path = require('path');

const rootDirectoryStr = path.dirname(require.main.filename);
const User = require(path.join(rootDirectoryStr, 'models', 'user.js'));

module.exports = (request, response, next) => {
    User.findByPk(1)
    .then(user => _ifDoesntExistThenCreateUser(user))
    .then(user => _addUserToRequest(user, request, next))
    .catch(err => console.log(err));

    function _ifDoesntExistThenCreateUser(user) {
        if (!user) {
            const dummyUserObj = {
                name: 'James',
                email: 'test123@gmail.com'
            };
            
            return User.create(dummyUserObj);
        
        } else {
            return user;
        }
    }

    function _addUserToRequest(user, request, next) {
        request.user = user;

        next();
    }
};