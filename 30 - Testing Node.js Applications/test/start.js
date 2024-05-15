import { expect } from 'chai';

it('should add numbers correctly', function() {
    const num1 = 2;
    const num2 = 3;

    const result = num1 + num2;

    expect(result).to.equal(5);
});

it('should not give a result of 6', function() {
    const num1 = 2;
    const num2 = 3;

    const result = num1 + num2;

    expect(result).not.to.equal(6);
});