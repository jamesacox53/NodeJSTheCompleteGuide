const fs = require('fs');
const path = require('path');

const rootDirectoryStr = path.dirname(require.main.filename);
const cartFilePath = path.join(rootDirectoryStr, 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(product, callbackFunc) {
        this.fetchCart((cartObj) => {
            this._addProduct(product, cartObj, callbackFunc);
        });
    }

    static fetchCart(callbackFunc) {
        fs.readFile(cartFilePath, (error, fileContent) => {
            return this._fileReadForFetchCart(callbackFunc, error, fileContent);
        });
    }

    static _fileReadForFetchCart(callbackFunc, error, fileContent) {
        let cartObj;
        
        if (error) {
            cartObj = {
                productsArr: [],
                totalPrice: 0
            };
        } else {
            cartObj = JSON.parse(fileContent);
        }

        callbackFunc(cartObj);
    }

    static _addProduct(product, cartObj, callbackFunc) {
        this._addProductToCart(product, cartObj);
        
        var cartObjJSONStr = JSON.stringify(cartObj);
        fs.writeFile(cartFilePath, cartObjJSONStr, callbackFunc);
    }

    static _addProductToCart(product, cartObj) {
        const productsArr = cartObj.productsArr;
        const productID = product.id;
        const productPrice = parseFloat(product.price);

        const productObj = this._getProductObjFromArr(productsArr, productID);

        if (productObj) {
            const currQuantity = parseFloat(productObj['quantity']);
            const currPrice = parseFloat(productObj['price']);

            productObj['quantity'] = currQuantity + 1;
            productObj['price'] = currPrice + productPrice;
        
        } else {
            const newProductObj = {
                id: productID,
                quantity: 1,
                price: productPrice
            };

            productsArr.push(newProductObj);
        }

        const currTotalPrice = cartObj['totalPrice'];
        cartObj['totalPrice'] = currTotalPrice + productPrice;
    }

    static _getProductObjFromArr(productsArr, productID) {
        for (let i = 0; i < productsArr.length; i++) {
            const product = productsArr[i];

            if (product.id == productID)
                return product;
        }
    }

    static deleteProductByID(id, callbackFunc) {
        this.fetchCart((cartObj) => {
            this._deleteProductByID(id, cartObj, callbackFunc);
        });
    }

    static _deleteProductByID(id, cartObj, callbackFunc) {
        const newCartObj = this._createCartObjWithoutProduct(id, cartObj);

        var newCartObjJSONStr = JSON.stringify(newCartObj);
        fs.writeFile(cartFilePath, newCartObjJSONStr, callbackFunc);
    }

    static _createCartObjWithoutProduct(id, cartObj) {
        const productsArr = cartObj.productsArr;
        const newProductsArr = [];
        let newTotalPrice = 0;

        for (let i = 0; i < productsArr.length; i++) {
            const product = productsArr[i];

            if (product.id != id) {
                newProductsArr.push(product);
                newTotalPrice += product.price;
            }
        }

        var newCartObj = {
            productsArr: newProductsArr,
            totalPrice: newTotalPrice
        };

        return newCartObj;
    }
}