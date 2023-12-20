const path = require('path');

const rootDirectoryStr = path.dirname(require.main.filename);
const mongoDatabase = require(path.join(rootDirectoryStr, 'util', 'mongoDBCreds.js'));
const getDB = mongoDatabase.getDB;

class Product {
    constructor(argsObj) {
        this.title = argsObj.title;
        this.price = argsObj.price;
        this.description = argsObj.description;
        this.imageURL = argsObj.imageURL;
    }

    save() {
        const db = getDB();

        return db.collection('products').insertOne(this);
    }

    static fetchAll() {
        const db = getDB();

        return db.collection('products').find().toArray();
    }
}

module.exports = Product;