const path = require('path');

const rootDirectoryStr = path.dirname(require.main.filename);
const User = require(path.join(rootDirectoryStr, 'models', 'user.js'));

module.exports = (request, response, next) => {
    User.findById('658adc8b6b3c20594cdbac51')
    .then(user => _ifUserDoesntExistThenCreateUser(user))
    .then(user => _addUserToRequest(user, request))
    // .then(err => _getUserCart(request))
    // .then(cart => _createCartForUserIfDoesntExist(cart, request))
    .then(err => _gotoNextMiddleware(next))
    .catch(err => console.log(err));

    function _ifUserDoesntExistThenCreateUser(user) {
        if (!user) {
            const dummyUserObj = {
                username: 'James',
                email: 'test123@gmail.com',
                cart: {
                    items: []
                }
            };

            const dummyUser = new User(dummyUserObj);
            
            return dummyUser.save(dummyUserObj);
        
        } else {
            return user;
        }
    }

    function _addUserToRequest(user, request) {
        request.user = user;
    }

    function _getUserCart(request) {
        return request.user.getCart();
    }

    function _createCartForUserIfDoesntExist(cart, request) {
        if (cart) return cart;
                
        return request.user.createCart();
    }

    function _gotoNextMiddleware(next) {
        next();
    }
};