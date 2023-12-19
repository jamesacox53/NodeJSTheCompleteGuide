const path = require('path');
// const Sequelize = require('sequelize');

const rootDirectoryStr = path.dirname(require.main.filename);
// const sequelize = require(path.join(rootDirectoryStr, 'util', 'mySqlDatabaseCreds.js'));
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
}


/*
const productFieldAttributesObj = {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imageURL: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
};

const Product = sequelize.define('product', productFieldAttributesObj);
*/

module.exports = Product;