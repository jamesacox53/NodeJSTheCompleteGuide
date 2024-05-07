const path = require('path');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require(path.join('..', 'models', 'user.js'));
const Post = require(path.join('..', 'models', 'post.js'));
const jwtSecretStr = require(path.join('..', 'sensitive', 'jsonWebTokenSecretStr.js'));

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
                !validator.isLength(userInput.password, { min: 5 }))
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
    },

    login: async function(args) {
        return _login(args);

        async function _login(args) {
            const user = await User.findOne({ email: args.email });
            
            if (!user) {
                const error = new Error("User doesn't exists");
                throw error;
            }

            return _loginUser(args, user);
        }

        async function _loginUser(args, user) {
            const isEqual = await bcrypt.compare(args.password, user.password);
            if (!isEqual)
                throw new Error('Password is incorrect.');

            const token = jwt.sign({
                userId: user._id.toString(),
                email: user.email,
            }, jwtSecretStr, { expiresIn: '1hr' });

            return { token: token, userID: user._id.toString() };
        }
    },

    createPost: async function(args) {
        return _createPost(args);

        async function _createPost(args) {
            _validateArgs(args);

            const postInput = args.postInput;

            const post = new Post({
                title: postInput.title,
                content: postInput.content,
                imageURL: postInput.imageURL
            });

            const createdPost = await post.save();
            // Add post to users' post

            return { 
                ...createdPost._doc,
                _id: createdPost._id.toString(),
                createdAt: createdPost.createdAt.toISOString(),
                updatedAt: createdPost.updatedAt.toISOString()
            };
        }

        function _validateArgs(args) {
            if (!args)
                throw new Error('No args object.');

            const postInput = args.postInput;
            if (!postInput)
                throw new Error('No postInput object.');
            
            if (validator.isEmpty(postInput.title) ||
            !validator.isLength(postInput.title, { min: 5 }))
                throw new Error("Title isn't valid");

            if (validator.isEmpty(postInput.content) ||
                !validator.isLength(postInput.content, { min: 5 }))
                throw new Error("Content isn't valid.");
        }
    }
}