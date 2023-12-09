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
            this.id = null;
        }
    }

    save() {
        // Update Product 
        if (this.id) {
            return database.execute('UPDATE products SET title = ?, price = ?, imageURL = ?, description = ? WHERE id = ?', 
            [this.title, this.price, this.imageURL, this.description, this.id]);
            
        // Create Product    
        } else {
            return database.execute('INSERT INTO products (title, price, imageURL, description) VALUES (?, ?, ?, ?)',
                [this.title, this.price, this.imageURL, this.description]);
        }
    }

    static fetchAll() {
        return database.execute('SELECT * FROM products');
    }

    static getProductByID(id) {
        return database.execute('SELECT * FROM products WHERE products.id = ?', [id])
        .then(arr => _getIndividualProduct(arr));

        function _getIndividualProduct(arr) {
            const prodObj = arr[0][0];
            const product = new Product(prodObj);
            
            return product;
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