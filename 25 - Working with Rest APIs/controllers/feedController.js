const path = require('path');
const { validationResult } = require('express-validator');

const Post = require(path.join('..', 'models', 'post.js'));

exports.getPosts = (request, response, next) => {
    response.status(200).json({
        posts: [
            {
                _id: '1',
                title: 'First Post',
                content: 'This is the first post!',
                creator: {
                    name: 'James'
                },
                date: new Date()
            }
        ]
    });
};

exports.createPost = (request, response, next) => {
    _validateAndCreatePost();
    
    function _validateAndCreatePost() {
        const errors = validationResult(request);
        if (!errors.isEmpty())
            return _validationError(errors);

        return _createPost();
    }

    function _validationError(errors) {
        const errorsArr = errors.array();
        const body = {
            message: 'Validation failed, entered data is incorrect.',
            errors: errorsArr
        }

        return response.status(422).json(body);
    }

    function _createPost() {
        const post = new Post({
            title: request.body.title,
            content: request.body.content,
            imageURL: request.body.imageURL,
            creator: {
                name: 'James'
            },
        });

        return post.save()
        .then(result => _sendResponse(result))
        .catch(err => console.log(err));
    }

    function _sendResponse(result) {
        return response.status(201).json({
            message: 'Post created successfully!',
            post: result
        });
    }
};