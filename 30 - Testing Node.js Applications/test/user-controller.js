import http from 'http';
import { expect } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';

import mongooseTestDBConnectionStr from '../sensitive/mongooseTestDBConnectionStr.js';
import UserController from '../controllers/userController.js';

import User from '../models/user.js';

describe('User Controller', function() {
    it('should send a response with a valid user status for an existing user', function(done) {
        mongoose.connect(mongooseTestDBConnectionStr)
        .then(res => {
            const user = new User({
                email: 'test@test.com',
                password: 'testertester',
                name: 'Test',
                post: []
            });

            return user.save();
        })
        .then(() => {
            
        })
        .catch(err => console.log(err));
    });
});