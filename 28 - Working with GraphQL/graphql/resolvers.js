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

    createPost: async function(args, req) {
        return _createPost(args, req);

        async function _createPost(args, req) {
            _validateInput(args, req);

            const postInput = args.postInput;

            const user = await User.findById(req.userID);
            if (!user)
                throw new Error('Invalid User');

            const post = new Post({
                title: postInput.title,
                content: postInput.content,
                imageURL: postInput.imageURL,
                creator: user
            });

            const createdPost = await post.save();
            user.posts.push(createdPost);
            await user.save();

            return { 
                ...createdPost._doc,
                _id: createdPost._id.toString(),
                createdAt: createdPost.createdAt.toISOString(),
                updatedAt: createdPost.updatedAt.toISOString()
            };
        }

        function _validateInput(args, req) {
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

            if (!req.isAuth) {
                throw new Error("Not Authenticated");
            }
        }
    },

    posts: async function(args, req)  {
        _validateInput(args, req);
        
        const perPage = 2;
        const page = args.page;
        if (!page) page = 1;

        const totalPosts = await Post.find().countDocuments();
        const posts = await Post.find()
            .sort({createdAt: -1})
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate('creator');
        
        return {
            posts: posts.map(p => {
                return {
                    ...p._doc,
                    _id: p._id.toString(),
                    createdAt: p.createdAt.toISOString(),
                    updatedAt: p.updatedAt.toISOString()
                }
            }),
            totalPosts: totalPosts
        };

        function _validateInput(args, req) {
            if (!args)
                throw new Error('No args object.');

            if (!req.isAuth) {
                throw new Error("Not Authenticated");
            }
        }
    },

    post: async function({ id }, req) {
        if (!req.isAuth) {
            throw new Error("Not Authenticated");
        }

        const post = await Post.findById(id).populate('creator');
        if (!post)
            throw new Error('No post found');
        
        return {
            ...post._doc,
            _id: post._id.toString(),
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString()
        }
    },

    updatePost: async function(args, req) {
        _validateInput(args, req);

        const post = await Post.findById(args.id).populate('creator');
        if (!post)
            throw new Error('No post found');

        if (post.creator._id.toString() !== req.userID.toString())
            throw new Error('Not authorized')

        const postInput = args.postInput;

        post.title = postInput.title;
        post.content = postInput.content;
        if (postInput.imageURL !== 'undefined')
            post.imageURL = postInput.imageURL;

        const updatePost = await post.save();

        return {
            ...updatePost._doc,
            _id: updatePost._id.toString(),
            createdAt: updatePost.createdAt.toISOString(),
            updatedAt: updatePost.updatedAt.toISOString()
        }
        
        function _validateInput(args, req) {
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

            if (!req.isAuth) {
                throw new Error("Not Authenticated");
            }
        }
    }
}