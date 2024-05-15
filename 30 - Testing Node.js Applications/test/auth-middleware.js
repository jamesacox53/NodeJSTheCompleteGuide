import { expect } from 'chai';
import isAuth from '../utils/middleware/isAuth.js';

it ('should throw an error if no Authorization header is present', function() {
    const req = {
        get: function() {
            return null;
        }
    };

    expect(isAuth.bind(this, req, {}, () => {})).to.throw("Authorization header doesn't exist.");
});