import { expect } from 'chai';
import sinon from 'sinon';

import LoginController from '../controllers/authControllers/loginController.js';
import SignUpController from '../controllers/authControllers/signUpController.js';

import User from '../models/user.js';

describe('Auth Login Controller', function() {
    it('should throw an error with code 500 if accessing the database fails', function(done) {
        sinon.stub(User, 'findOne').throws(new Error('Fake error'));
        
        const req = {
            body: {
                email: 'test@test.com',
                password: 'testertester'
            }
        };

        LoginController.postLogin(req, {}, (val) => val).then(result => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('u_statusCode', 500);
            
            User.findOne.restore();
            done();
        });   
    });
});