const num1Elem = document.getElementById('num1') as HTMLInputElement;
const num2Elem = document.getElementById('num2') as HTMLInputElement;
const buttonElem = document.querySelector('button')!;

const numResults: number[] = [];
const textResults: string[] = [];

type NumORString = number | string;
type Result = { val: number; timestamp: Date };

interface ResultObj {
    val: number;
    timestamp: Date
};

function myAdd(num1: NumORString, num2: NumORString) {
    if (typeof num1 === 'number' && typeof num2 === 'number') {
        return num1 + num2;

    } else if(typeof num1 === 'string' && typeof num2 === 'string') {
        return num1 + ' ' + num2;
    
    } else {
        return (+num1 + +num2);
    }
}

function printResult(resultObj: ResultObj) {
    console.log(resultObj.val);
}

buttonElem.addEventListener('click', () => {
    const num1 = num1Elem.value;
    const num2 = num2Elem.value;

    const res = myAdd(+num1, +num2);
    numResults.push(res as number);

    const text = myAdd(num1, num2);
    textResults.push(text as string);

    console.log(res);
    console.log(printResult({ val: res as number, timestamp: new Date() }));
    console.log(numResults, textResults);
});

console.log(myAdd(1, 6));
console.log(myAdd('1', '6'));