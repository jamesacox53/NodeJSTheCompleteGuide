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
            return User.findById('5c0f66b979af55031b34728a')
            .then(user => {
                if (user) return user;

                return new User({
                    _id: '5c0f66b979af55031b34728a',
                    email: 'test@test.com',
                    password: 'testertester',
                    name: 'Test',
                    status: 'Test Status',
                    post: []
                }).save();
            });
        })
        .then(() => {
            const req = { 
                params: {
                    userID: '5c0f66b979af55031b34728a'
                }
            };

            const res = {
                statusCode: 500,
                userStatus: null,
                status: function (code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.userStatus = data.status;
                }
            };

            UserController.getStatus(req, res, () => {}).then(() => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.userStatus).to.be.equal('Test Status');

                done();
            });
        })
        .catch(err => console.log(err));
    });
});