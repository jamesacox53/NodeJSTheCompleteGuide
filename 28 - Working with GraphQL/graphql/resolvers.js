const path = require('path');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const User = require(path.join('..', 'models', 'user.js'));

module.exports = {
    hello() {
        return {
            text: 'Hello World!',
            views: 12345
        }
    },

    createUser: async function(args, req) {
        return _createUser(args);

        async function _createUser(args) {
            _validateArgs(args);

            const userInput = args.userInput;
            const existingUser = await User.findOne({ email: userInput.email });
        
            if (existingUser) {
                const error = new Error('User already exists');
                throw error;
            }

            return _createNewUser(userInput);
        }

        function _validateArgs(args) {
            if (!args)
                throw new Error('No args object.');

            const userInput = args.userInput;
            if (!userInput)
                throw new Error('No userInput object.');
            
            if (!validator.isEmail(userInput.email))
                throw new Error("Email isn't valid");

            if (validator.isEmpty(userInput.password) ||
                validator.isLength(userInput.password, { min: 5 }))
                throw new Error("Password isn't valid.");
        }

        async function _createNewUser(userInput) {
            const hashedPasswordStr = await bcrypt.hash(userInput.password, 12);
        
            const user = new User({
                email: userInput.email,
                name: userInput.name,
                password: hashedPasswordStr,
                status: 'active'
            });

            const createdUser = await user.save();
            
            return {
                ...createdUser._doc,
                _id: createdUser._id.toString()
            };
        }
    }
}