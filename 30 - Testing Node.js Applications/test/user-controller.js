import http from 'http';
import { expect } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';

import mongooseTestDBConnectionStr from '../sensitive/mongooseTestDBConnectionStr.js';
import UserController from '../controllers/userController.js';

import User from '../models/user.js';

describe('User Controller', function() {
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

    it('should send a response with a valid user status for an existing user', function(done) {
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
        }).catch(err => console.log(err));
    });

    after(function(done) {
        User.deleteMany({})
        .then(() => mongoose.disconnect())
        .then(() => done());
    });
});