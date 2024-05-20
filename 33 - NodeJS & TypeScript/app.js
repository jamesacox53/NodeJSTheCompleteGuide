"use strict";
const num1Elem = document.getElementById('num1');
const num2Elem = document.getElementById('num2');
const buttonElem = document.querySelector('button');
const numResults = [];
const textResults = [];
;
function myAdd(num1, num2) {
    if (typeof num1 === 'number' && typeof num2 === 'number') {
        return num1 + num2;
    }
    else if (typeof num1 === 'string' && typeof num2 === 'string') {
        return num1 + ' ' + num2;
    }
    else {
        return (+num1 + +num2);
    }
}
function printResult(resultObj) {
    console.log(resultObj.val);
}
buttonElem.addEventListener('click', () => {
    const num1 = num1Elem.value;
    const num2 = num2Elem.value;
    const res = myAdd(+num1, +num2);
    numResults.push(res);
    const text = myAdd(num1, num2);
    textResults.push(text);
    console.log(res);
    console.log(printResult({ val: res, timestamp: new Date() }));
    console.log(numResults, textResults);
});
console.log(myAdd(1, 6));
console.log(myAdd('1', '6'));
