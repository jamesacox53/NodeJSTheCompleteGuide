const fs = require('fs');
const path = require('path');

const rootDirectoryStr = path.dirname(require.main.filename);
const Cart = require(path.join(rootDirectoryStr, 'models', 'cart.js'));
const productsFilePath = path.join(rootDirectoryStr, 'data', 'products.json');

const database = require(path.join(rootDirectoryStr, 'util', 'mySqlDatabaseCreds.js'));

module.exports = class Product {
    constructor(productArgsObj) {
        this.title = productArgsObj.title;
        this.imageURL = productArgsObj.imageURL;
        this.description = productArgsObj.description;
        this.price = productArgsObj.price;
        
        if (productArgsObj.id) {
            this.id = productArgsObj.id;
        
        } else {
            this.id = Math.random().toString();
        }
    }

    save(callbackFunc) {
        fs.readFile(productsFilePath, (error, fileContent) => {
            return this._readFileForSave(error, fileContent, callbackFunc);
        });
    }

    static fetchAll() {
        return database.execute('SELECT * FROM products');
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
                const actualProduct = new Product(product);

                callbackFunc(actualProduct);
                return;
            }
        }
    }

    static deleteByID(id, callbackFunc) {
        this.fetchAll((productsArr) => {
            this._deleteProductByIDFetchAll(id, productsArr, callbackFunc);
        });
    }

    static _deleteProductByIDFetchAll(id, productsArr, callbackFunc) {
        const newProductsArr = [];
        
        for (let i = 0; i < productsArr.length; i++) {
            const product = productsArr[i];

            if (product.id != id)
                newProductsArr.push(product);
        }

        var productsArrJSONStr = JSON.stringify(newProductsArr);
        fs.writeFile(productsFilePath, productsArrJSONStr, (error) => {
            Cart.deleteProductByID(id, callbackFunc);
        });
    }
}