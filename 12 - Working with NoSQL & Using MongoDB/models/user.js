const path = require('path');
const mongodb = require('mongodb');

const rootDirectoryStr = path.dirname(require.main.filename);
const mongoDatabase = require(path.join(rootDirectoryStr, 'util', 'mongoDBCreds.js'));
const getDB = mongoDatabase.getDB;

class User {
    constructor(argsObj) {
        this.username = argsObj.username;
        this.email = argsObj.email;
        
        if (argsObj._id)
            this._id = argsObj._id;

        if (argsObj.cart) {
            this.cart = argsObj.cart;
        
        } else {
            this.cart = {
                products: []
            };
        }
    }

    save() {
        const db = getDB();
        const argsObj = this._getArgsObj();

        if (argsObj._id) {
            return this.constructor._updateUser(db, argsObj);
        
        } else {
            return this.constructor._insertUser(db, argsObj);
        }
    }

    _getArgsObj() {
        const argsObj = {
            username: this.username,
            email: this.email,
            cart: this.cart
        };

        if (this._id)
            argsObj['_id'] = this._id;

        return argsObj;
    }

    static _updateUser(db, argsObj) {
        const mongoIDObj = new mongodb.ObjectId(argsObj._id);
        const filterObj = { _id: mongoIDObj };
        const updateObj = { $set: argsObj };

        return db.collection('users').updateOne(filterObj, updateObj);
    }

    static _insertUser(db, argsObj) {
        return db.collection('users').insertOne(argsObj);
    }

    static findById(userID) {
        const db = getDB();
        const mongoIDObj = new mongodb.ObjectId(userID);
        
        return db.collection('users')
        .findOne({ _id: mongoIDObj })
        .then(mongoUser => this._getUser(mongoUser));
    }

    static _getUser(mongoUser) {
        if (!mongoUser) return null;
        
        const argsObj = {
            username: mongoUser.username,
            email: mongoUser.email,
            cart: mongoUser.cart
        };

        if (mongoUser._id)
            argsObj['_id'] = mongoUser._id;

        return new User(argsObj);
    }

    static deleteById(userID) {
        const db = getDB();
        const mongoIDObj = new mongodb.ObjectId(userID);
        
        return db.collection('users').deleteOne({ _id: mongoIDObj });
    }

    getCart() {
        return this.constructor
        ._getProducts(this.cart)
        .toArray()
        .then(products => this.constructor._getProductObjArr(products, this.cart));
    }

    static _getProducts(cart) {
        const db = getDB();
        const productIDArr = this._getCartProductIDArr(cart);

        
        return db.collection('products').find({ _id: { $in: productIDArr } });
    }

    static _getCartProductIDArr(cart) {
        const productIDArr = [];
        const productsArr = cart.products;
        
        for (let i = 0; i < productsArr.length; i++) {
            const productObj = productsArr[i];
            const productID = productObj.productID;

            productIDArr.push(productID);
        }

        return productIDArr;
    }

    static _getProductObjArr(products, cart) {
        const productObjArr = [];
        const cartProductsArr = cart.products;
        const productsObj = this._getObjFromArr(products);

        for(let i = 0; i < cartProductsArr.length; i++) {
            const cartProduct = cartProductsArr[i];
            const product = productsObj[cartProduct.productID.toString()];

            const productObj = {
                product: product,
                quantity: cartProduct.quantity
            };

            productObjArr.push(productObj);
        }

        return productObjArr;
    }

    static _getObjFromArr(arr) {
        const retObj = {};

        for(let i = 0; i < arr.length; i++) {
            const elem = arr[i];
            
            retObj[elem._id.toString()] = elem;
        }

        return retObj;
    }

    addToCart(product) {
        const productsArr = this.cart.products;
        const productIndex = this.constructor._getProductIndex(product, productsArr);

        if (productIndex == -1) {
            return this.constructor._addProductToCart(this._id, product, this.cart);
        
        } else {
            return this.constructor._updateProductQuantityInCart(this._id, productIndex, this.cart);
        }
    }

    static _getProductIndex(product, productsArr) {
        const productIDStr = product._id.toString();
        
        for (let i = 0; i < productsArr.length; i++) {
            const prodObj = productsArr[i];
            const prodIDStr = prodObj.productID.toString();
            
            if (prodIDStr == productIDStr)
                return i;
        }

        return -1;
    }

    static _addProductToCart(_id, product, cart) {
        const productsArr = cart.products;
        const productObj = {
            productID: product._id,
            quantity: 1
        };

        productsArr.push(productObj);

        return this._updateUserCartInDatabase(_id, cart);
    }

    static _updateUserCartInDatabase(_id, cart) {
        const db = getDB();
        const mongoIDObj = new mongodb.ObjectId(_id);
        const filterObj = { _id: mongoIDObj };
        const updateObj = {
            $set: {
                cart: cart
            }
        };

        return db.collection('users').updateOne(filterObj, updateObj);
    }

    static _updateProductQuantityInCart(_id, productIndex, cart) {
        const productsArr = cart.products;
        const productObj = productsArr[productIndex];
        
        const oldQuantity = parseInt(productObj['quantity'], 10);
        const newQuantity = oldQuantity + 1; 
        
        productObj['quantity'] = newQuantity;

        return this._updateUserCartInDatabase(_id, cart);
    }

    deleteCartItem(productID) {
        this.constructor._removeCartItem(this.cart, productID);

        return this.constructor._updateUserCartInDatabase(this._id, this.cart);
    }

    static _removeCartItem(cart, productID) {
        const newProductsArr = [];
        const products = cart.products;
        const productIDStr = productID.toString();

        for(let i = 0; i < products.length; i++) {
            const prod = products[i];
            const prodIDStr = prod.productID.toString();

            if (productIDStr != prodIDStr)
                newProductsArr.push(prod);
        }

        cart.products = newProductsArr;
    }

    addOrder() {
        return this.getCart()
        .then(productObjArr => this.constructor._addOrder(this._id, productObjArr))
        .then(err => this.constructor._resetCart(this));
    }

    static _addOrder(_id, productObjArr) {
        const db = getDB();
        const orderObj = {
            userID: _id,
            cart: productObjArr
        }

        return db.collection('orders').insertOne(orderObj);
    }

    static _resetCart(user) {
        const newCart = {
            products: []
        };

        user.cart = newCart;
        
        return this._updateUserCartInDatabase(user._id, user.cart);
    }
}

module.exports = User;