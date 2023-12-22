const path = require('path');
const mongodb = require('mongodb');

const rootDirectoryStr = path.dirname(require.main.filename);
const mongoDatabase = require(path.join(rootDirectoryStr, 'util', 'mongoDBCreds.js'));
const getDB = mongoDatabase.getDB;

class Product {
    constructor(argsObj) {
        this.title = argsObj.title;
        this.price = argsObj.price;
        this.description = argsObj.description;
        this.imageURL = argsObj.imageURL;

        if (argsObj._id)
            this._id = argsObj._id;
    }

    save() {
        const db = getDB();
        const argsObj = this._getArgsObj();

        if (argsObj._id) {
            return this.constructor._updateProduct(db, argsObj);
        
        } else {
            return this.constructor._insertProduct(db, argsObj);
        }
    }

    _getArgsObj() {
        const argsObj = {
            title: this.title,
            price: this.price,
            description: this.description,
            imageURL: this.imageURL
        };

        if (this._id)
            argsObj['_id'] = this._id;

        return argsObj;
    }

    static _updateProduct(db, argsObj) {
        const mongoIDObj = new mongodb.ObjectId(argsObj._id);
        const filterObj = { _id: mongoIDObj };
        const updateObj = { $set: argsObj };

        return db.collection('products').updateOne(filterObj, updateObj);
    }

    static _insertProduct(db, argsObj) {
        return db.collection('products').insertOne(argsObj);
    }

    static fetchAll() {
        const db = getDB();

        return db.collection('products').find().toArray()
        .then(mongoProductsArr => this._getProductsArr(mongoProductsArr));
    }

    static _getProductsArr(mongoProductsArr) {
        const productsArr = [];

        for(let i = 0; i < mongoProductsArr.length; i++) {
            const mongoProduct = mongoProductsArr[i];
            const product = this._getProduct(mongoProduct);
            productsArr.push(product);
        }

        return productsArr;
    }

    static _getProduct(mongoProduct) {
        if (!mongoProduct) return null;
        
        const argsObj = {
            title: mongoProduct.title,
            price: mongoProduct.price,
            description: mongoProduct.description,
            imageURL: mongoProduct.imageURL,
            _id: mongoProduct._id
        };

        return new Product(argsObj);
    }

    static findById(productID) {
        const db = getDB();
        const mongoIDObj = new mongodb.ObjectId(productID);
        
        return db.collection('products')
        .find({ _id: mongoIDObj }).next()
        .then(mongoProduct => this._getProduct(mongoProduct));
    }

    static deleteById(productID) {
        const db = getDB();
        const mongoIDObj = new mongodb.ObjectId(productID);
        
        return db.collection('products').deleteOne({ _id: mongoIDObj });
    }
}

module.exports = Product;