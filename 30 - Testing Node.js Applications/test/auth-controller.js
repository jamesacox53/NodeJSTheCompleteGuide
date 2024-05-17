import { expect } from 'chai';
import sinon from 'sinon';

import LoginController from '../controllers/authControllers/loginController.js';
import SignUpController from '../controllers/authControllers/signUpController.js';

import User from '../models/user.js';

describe('Auth Login Controller', function() {
    it('should throw an error with code 500 if accessing the database fails', function() {
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        expect(LoginController.postLogin);

        User.findOne.restore();
    });
    
    
    
    it ('should throw an error if no Authorization header is present', function() {
        const req = {
            get: function() {
                return null;
            }
        };
    
        expect(isAuth.bind(this, req, {}, () => {})).to.throw("Authorization header doesn't exist.");
    });
    
    it ('should throw an error if the Authorization header is only one string', function() {
        const req = {
            get: function() {
                return 'xyz';
            }
        };
    
        expect(isAuth.bind(this, req, {}, () => {})).to.throw("Authorization header should be in the format of 'Bearer jwtStr'.");
    });

    it ('should throw an error if the token cannot be verified', function() {
        const req = {
            get: function() {
                return 'Bearer xyz';
            }
        };
    
        expect(isAuth.bind(this, req, {}, () => {})).to.throw("jwt malformed");
    });

    it ('should yield a userID after decoding the token', function() {
        const req = {
            get: function() {
                return 'Bearer xyz';
            }
        };
        
        sinon.stub(jwt, 'verify');
        jwt.verify.returns({ userId: 'abc' });

        isAuth(req, {}, () => {});
        expect(req).to.have.property('userID');
        expect(req).to.have.property('userID', 'abc');
        expect(jwt.verify.called).to.be.true;
        jwt.verify.restore();
    });
});

