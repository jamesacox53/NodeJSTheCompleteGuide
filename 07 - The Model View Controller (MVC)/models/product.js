const fs = require('fs');
const path = require('path');

const rootDirectoryStr = require(path.join('..', 'util', 'rootDirectory.js'));
const productsFilePath = path.join(rootDirectoryStr, 'data', 'products.json');

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        fs.readFile(productsFilePath, (error, fileContent) => {
            return this._readFileForSave(this, error, fileContent);
        });
    }

    static fetchAll() {
        fs.readFile(productsFilePath, (error, fileContent) => {
            return this._readFileForFetchAll(error, fileContent);
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

    _readFileForFetchAll(error, fileContent) {
        if (error) return [];
        
        const productsArr = JSON.parse(fileContent);
        return productsArr;
    }
}