const fs = require('fs');
const path = require('path');

const rootDirectoryStr = path.dirname(require.main.filename);
const productsFilePath = path.join(rootDirectoryStr, 'data', 'products.json');

module.exports = class Product {
    constructor(productArgsObj) {
        this.title = productArgsObj.productTitleStr;
        this.imageURL = productArgsObj.imageURLStr;
        this.description = productArgsObj.descriptionStr;
        this.price = productArgsObj.priceStr;
        this.id = Math.random().toString();
    }

    save() {
        fs.readFile(productsFilePath, (error, fileContent) => {
            return this._readFileForSave(error, fileContent);
        });
    }

    static fetchAll(callbackFunc) {
        fs.readFile(productsFilePath, (error, fileContent) => {
            return this._readFileForFetchAll(callbackFunc, error, fileContent);
        });
    }

    _readFileForSave(error, fileContent) {
        let productsArr;
        
        if (error) {
            productsArr = [];
        
        } else {
            productsArr = JSON.parse(fileContent);
        }

        productsArr.push(this);

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

    static getProductByID(id, callbackFunc) {
        this.fetchAll((productsArr) => {
            this._getProductByIDFetchAll(id, productsArr, callbackFunc);
        });
    }

    static _getProductByIDFetchAll(id, productsArr, callbackFunc) {
        for (let i = 0; i < productsArr.length; i++) {
            const product = productsArr[i];

            if (product.id == id) {
                callbackFunc(product);
                return;
            }
        }
    }
}