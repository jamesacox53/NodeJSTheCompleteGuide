const num1Elem = document.getElementById('num1') as HTMLInputElement;
const num2Elem = document.getElementById('num2') as HTMLInputElement;
const buttonElem = document.querySelector('button');

function myAdd(num1: number, num2: number) {
    return num1 + num2;
}

buttonElem?.addEventListener('click', () => {
    const num1 = num1Elem.value;
    const num2 = num2Elem.value;

    const res = myAdd(+num1, +num2);

    console.log(res);
});

console.log(myAdd(1, 6));

// console.log(myAdd('1', '6'));