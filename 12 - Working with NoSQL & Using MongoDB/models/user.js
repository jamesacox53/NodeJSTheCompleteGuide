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
}

module.exports = User;