const path = require('path');
const fs = require('fs');
const { validationResult } = require('express-validator');

const Post = require(path.join('..', 'models', 'post.js'));
const User = require(path.join('..', 'models', 'user.js'));
const controllerUtils = require(path.join('..', 'utils', 'controllerUtils', 'controllerUtils.js'));
const socket = require(path.join('..', 'utils', 'sockets', 'socket.js'));

const ITEMS_PER_PAGE = 2;

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
        return Post.find()
        .countDocuments()
        .then(totalNumPosts => _getPagePosts(totalNumPosts))
        .catch(err => _handleError(err));   
    }
        
    function _getPagePosts(totalNumPosts) {
        const page = controllerUtils.getPageNum(request, ITEMS_PER_PAGE, totalNumPosts);

        return Post.find()
        .populate('creator')
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .then(postsArr => _sendResponse(postsArr, totalNumPosts))
        .catch(err => _handleError(err));
    }

    function _sendResponse(postsArr, totalNumPosts) {
        return response.status(200).json({
            posts: postsArr,
            totalItems: totalNumPosts
        });
    }

    function _handleError(err) {
        if (!err.u_statusCode)
            err.u_statusCode = 500;

        return next(err);
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

        return User.findById(request.userID)
        .then(user => _createPost(user))
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

    function _createPost(user) {
        if (!user) {
            const error = new Error("User doens't exist.")
            error.u_statusCode = 401;

            throw error;
        }
        
        const post = new Post({
            title: request.body.title,
            content: request.body.content,
            imageURL: request.file.path,
            creator: user._id,
        });

        return post.save()
        .then(result => _updateUserAndSendResponse(result, user))
        .catch(err => _handleError(err));
    }

    function _updateUserAndSendResponse(post, user) {
        if (!post) {
            const error = new Error("Post couldn't be saved.")
            error.u_statusCode = 401;

            throw error;
        }

        user.posts.push(post._id);
        return user.save()
        .then(result => _sendResponse(result, post));
    }

    function _sendResponse(user, post) {
        const io = socket.getIO();
        const socketPayloadObj = _createSocketPayloadObj(user, post);

        io.emit('posts', socketPayloadObj);

        return response.status(201).json({
            message: 'Post created successfully!',
            post: post,
            userId: user._id.toString(),
            userName: user.name.toString()
        });
    }

    function _createSocketPayloadObj(user, post) {
        const socketPayloadObj = {
            action: 'create',
            post: {
                ...post._doc,
            },
        };

        socketPayloadObj.post.creator = {
            _id: user._id.toString(),
            userName: user.name.toString()
        };

        return socketPayloadObj;
    }

    function _handleError(err) {
        if (!err.u_statusCode)
            err.u_statusCode = 500;

        return next(err);
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
        
        return Post.findById(postID).populate('creator')
        .then(post => _checkPostAndEdit(post, postID))
        .catch(err => _handleError(err));
    }

    function _checkPostAndEdit(post, postID) {
        if (!post) {
            const error = new Error(`Can't find post with ID ${postID}`);
            error.u_statusCode = 422;

            throw error;
        }

        const creatorID = post.creator._id.toString();
        const userID = request.userID.toString();

        if (creatorID !== userID) {
            const error = new Error(`User with ID ${userID} didn't create post.`);
            error.u_statusCode = 403;

            throw error;
        }

        return _afterCheckEditPost(post);
    }

    function _afterCheckEditPost(post) {
        const newImageURL = _getNewImageURL();
        let oldImageURL = post.imageURL;

        return _editPostAndSave(post, newImageURL)
        .then(editedPost => _cleanUpFilesAndSendResponse(editedPost, newImageURL, oldImageURL));
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

    function _cleanUpFilesAndSendResponse(editedPost, newImageURL, oldImageURL) {
        if (newImageURL !== oldImageURL)
            _deleteFile(oldImageURL);

        return response.status(200).json({
            message: 'Post successfully updated.',
            post: editedPost
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

exports.deletePost = (request, response, next) => {
    _deletePost();
  
    function _deletePost() {
        const postID = request.params.postID;
        
        return Post.findById(postID)
        .then(post => _checkPostAndDelete(post, postID))
        .catch(err => _handleError(err));
    }

    function _checkPostAndDelete(post, postID) {
        if (!post) {
            const error = new Error(`Can't find post with ID ${postID}`);
            error.u_statusCode = 422;

            throw error;
        }

        const creatorID = post.creator.toString();
        const userID = request.userID.toString();

        if (creatorID !== userID) {
            const error = new Error(`User with ID ${userID} didn't create post.`);
            error.u_statusCode = 403;

            throw error;
        }

        return _afterCheckDeletePost(post);
    }

    function _afterCheckDeletePost(post) {
        const creatorID = post.creator.toString();
        const postID = post._id.toString();
        const imageURL = post.imageURL;
        
        return Post.deleteOne({ _id: post._id })
        .then(err => User.findById(creatorID))
        .then(user => _removePostFromCreator(user, postID))
        .then(err => _cleanUpFilesAndSendResponse(imageURL))
        .catch(err => _handleError(err));
    }

    function _removePostFromCreator(user, postID) {
        user.posts.pull(postID);

        return user.save();
    }

    function _cleanUpFilesAndSendResponse(imageURL) {
        _deleteFile(imageURL);

        return response.status(200).json({
            message: 'Post successfully deleted.'
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