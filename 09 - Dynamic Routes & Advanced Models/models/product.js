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

    save(callbackFunc) {
        fs.readFile(productsFilePath, (error, fileContent) => {
            return this._readFileForSave(error, fileContent, callbackFunc);
        });
    }

    static fetchAll(callbackFunc) {
        fs.readFile(productsFilePath, (error, fileContent) => {
            return this._readFileForFetchAll(callbackFunc, error, fileContent);
        });
    }

    _readFileForSave(error, fileContent, callbackFunc) {
        let productsArr;
        
        if (error) {
            productsArr = [];
        
        } else {
            productsArr = JSON.parse(fileContent);
        }

        this._updateProductsArr(productsArr);

        var productsArrJSONStr = JSON.stringify(productsArr);
        fs.writeFile(productsFilePath, productsArrJSONStr, callbackFunc);
    }

    _updateProductsArr(productsArr) {
        for (let i = 0; i < productsArr.length; i++) {
            const prod = productsArr[i];

            if (prod.id == this.id) {
                productsArr[i] = this;
                return;
            }
        }

        productsArr.push(this);
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
                const actualProduct = this._createProductFetchAll(product);

                callbackFunc(actualProduct);
                return;
            }
        }
    }

    static _createProductFetchAll(product) {
        const productArgs = {
            productTitleStr: product.title,
            imageURLStr: product.imageURL,
            descriptionStr: product.description,
            priceStr: product.price
        };

        const actualProduct = new Product(productArgs);
        actualProduct.id = product.id;
        
        return actualProduct;
    }
}