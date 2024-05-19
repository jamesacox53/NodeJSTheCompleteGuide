import http from 'http';
import { expect } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';

import mongooseTestDBConnectionStr from '../sensitive/mongooseTestDBConnectionStr.js';
import FeedController from '../controllers/feedController.js';

import User from '../models/user.js';
import Post from '../models/post.js';

describe('Feed Controller', function() {
    before(function(done) {
        mongoose.connect(mongooseTestDBConnectionStr)
        .then(res => {
            const user = new User({
                _id: '5c0f66b979af55031b34728a',
                email: 'test@test.com',
                password: 'testertester',
                name: 'Test',
                status: 'Test Status',
                post: []
            });

            return user.save();
        })
        .then(() => done());
    });

    it('should add a created post to the posts of the creator', function(done) {
        const req = { 
            body: {
                title: 'Test Post',
                content: 'A Test Post'
            },
            file: {
                path: 'abc'
            },
            userID: '5c0f66b979af55031b34728a'
        };

        const res = {
            status: function () {
                return this;
            },
            json: function() {}
        };

        FeedController.createPost(req, res, () => {}).then((savedUser) => {
            expect(savedUser).to.have.property('posts');
            expect(savedUser.posts).to.have.length(1);
            
            done();
        }).catch(err => console.log(err));
    });

    after(function(done) {
        User.deleteMany({})
        .then(() => Post.deleteMany({}))
        .then(() => mongoose.disconnect())
        .then(() => done());
    });
});