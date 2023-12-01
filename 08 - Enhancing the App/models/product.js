const fs = require('fs');
const path = require('path');

const rootDirectoryStr = require(path.join('..', 'util', 'rootDirectory.js'));
const productsFilePath = path.join(rootDirectoryStr, 'data', 'products.json');

module.exports = class Product {
    constructor(productArgsObj) {
        this.title = productArgsObj.productTitleStr;
        this.imageURL = productArgsObj.imageURLStr;
        this.description = productArgsObj.descriptionStr;
        this.price = productArgsObj.priceStr;
    }

    save() {
        fs.readFile(productsFilePath, (error, fileContent) => {
            return this._readFileForSave(this, error, fileContent);
        });
    }

    static fetchAll(callbackFunc) {
        fs.readFile(productsFilePath, (error, fileContent) => {
            return this._readFileForFetchAll(callbackFunc, error, fileContent);
        });
    }

    _readFileForSave(product, error, fileContent) {
        let productsArr;
        
        if (error) {
            productsArr = [];
        
        } else {
            productsArr = JSON.parse(fileContent);
        }

        productsArr.push(product);

        var productsArrJSONStr = JSON.stringify(productsArr);
        fs.writeFile(productsFilePath, productsArrJSONStr, this._failedToWriteFileForSave);
    }

    _failedToWriteFileForSave(error) {
        if (!error) return;

        console.log(error);
    }

    static _readFileForFetchAll(callbackFunc, error, fileContent) {
        let productsArr;
        
        if (error) {
            productsArr = [];
        
        } else {
            productsArr = JSON.parse(fileContent);
        }

        callbackFunc(productsArr);
    }
}