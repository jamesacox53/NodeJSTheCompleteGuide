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

    save() {
        return database.execute('INSERT INTO products (title, price, imageURL, description) VALUES (?, ?, ?, ?)',
        [this.title, this.price, this.imageURL, this.description]);
    }

    static fetchAll() {
        return database.execute('SELECT * FROM products');
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