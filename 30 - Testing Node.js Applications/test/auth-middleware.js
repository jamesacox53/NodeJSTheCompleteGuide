import { expect } from 'chai';
import isAuth from '../utils/middleware/isAuth.js';

describe('Auth Middleware', function() {
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
        
        isAuth(req, {}, () => {});

        expect(req).to.have.property.userID;
    });
});

