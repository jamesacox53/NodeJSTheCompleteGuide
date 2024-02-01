const path = require('path');
const fs = require('fs');
const { validationResult } = require('express-validator');

const Post = require(path.join('..', 'models', 'post.js'));

exports.getPost = (request, response, next) => {
    _getPost();

    function _getPost() {
        const postID = request.params.postID;

        return Post.findById(postID)
        .then(post => _ifPostExistsSendResponse(post))
        .catch(err => _error(err));
    }

    function _ifPostExistsSendResponse(post) {
        if (!post) {
            const error = new Error('Could not find post.');
            error.u_statusCode = 404;

            throw error;
        }

        return _sendResponse(post);
    }

    function _sendResponse(post) {
        return response.status(200).json({
            message: 'Post fetched.',
            post: post
        });
    }

    function _error(err) {
        if (!err.u_statusCode)
            err.u_statusCode = 500;

        next(err);
    }
};

exports.getPosts = (request, response, next) => {
    _getPosts();

    function _getPosts() {
        Post.find()
        .then(posts => _sendResponse(posts))
        .catch(err => _error(err));
    }

    function _sendResponse(posts) {
        return response.status(200).json({
            posts: posts
        });
    }

    function _error(err) {
        if (!err.u_statusCode)
            err.u_statusCode = 500;

        next(err);
    }
};

exports.createPost = (request, response, next) => {
    _validateAndCreatePost();
    
    function _validateAndCreatePost() {
        const errors = validationResult(request);
        if (!errors.isEmpty())
            return _validationError(errors);

        if (!request.file)
            return _noImageError();

        return _createPost();
    }

    function _validationError(errors) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.u_statusCode = 422;
        
        throw error;
    }
    
    function _noImageError() {
        const error = new Error('No image provided.');
        error.u_statusCode = 422;

        throw error;
    }

    function _createPost() {
        const post = new Post({
            title: request.body.title,
            content: request.body.content,
            imageURL: request.file.path,
            creator: {
                name: 'James'
            },
        });

        return post.save()
        .then(result => _sendResponse(result))
        .catch(err => _saveError(err));
    }

    function _sendResponse(result) {
        return response.status(201).json({
            message: 'Post created successfully!',
            post: result
        });
    }

    function _saveError(err) {
        if (!err.u_statusCode)
            err.u_statusCode = 500;

        next(err);
    }
};

exports.putEditPost = (request, response, next) => {
    _putEditPost();
  
    function _putEditPost() {
      const errors = validationResult(request);
      
      if (!errors.isEmpty())
        return _validationError(errors);
      
      return _editPost();
    }

    function _validationError(errors) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.u_statusCode = 422;
        
        throw error;
    }
    
    function _editPost() {
        const postID = request.params.postID;
        const newImageURL = _getNewImageURL();
        let oldImageURL;
        let post;
        
        return Post.findById(postID)
        .then(userPost => { post = userPost })
        .then(err => { oldImageURL = post.imageURL })
        .then(err => _editPostAndSave(post, newImageURL))
        .then(userPost => _cleanUpFilesAndSendResponse(userPost, newImageURL, oldImageURL))
        .catch(err => _handleError(err));
    }

    function _getNewImageURL() {
        const bodyImageURL = request.body.imageURL;
        if (bodyImageURL) return bodyImageURL;

        const fileImageURL = request.file.path;
        if (fileImageURL) return fileImageURL;

        const error = new Error('Error with file.');
        error.u_statusCode = 422;

        throw error;
    }

    function _editPostAndSave(post, newImageURL) {
        post.title = request.body.title;
        post.imageURL = newImageURL;
        post.content = request.body.content;

        return post.save();
    }

    function _cleanUpFilesAndSendResponse(userPost, newImageURL, oldImageURL) {
        if (newImageURL !== oldImageURL)
            _deleteFile(oldImageURL);

        return response.status(200).json({
            message: 'Post successfully updated.',
            post: userPost
        });
    }

    function _deleteFile(path) {
        if (!path) return;

        const pathStr = path.toString();
        if (!pathStr) return;

        fs.unlink(pathStr, (err) => {
        if (err) {
            throw err;
        }
        });
    }

    function _handleError(err) {
        if (!err.u_statusCode)
            err.u_statusCode = 500;

        return next(err);
    }
};