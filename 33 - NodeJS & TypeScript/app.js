var num1Elem = document.getElementById('num1');
var num2Elem = document.getElementById('num2');
var buttonElem = document.querySelector('button');
function myAdd(num1, num2) {
    return num1 + num2;
}
buttonElem === null || buttonElem === void 0 ? void 0 : buttonElem.addEventListener('click', function () {
    var num1 = num1Elem.value;
    var num2 = num2Elem.value;
    var res = myAdd(+num1, +num2);
    console.log(res);
});
console.log(myAdd(1, 6));
// console.log(myAdd('1', '6'));
