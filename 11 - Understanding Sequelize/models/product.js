const path = require('path');
const Sequelize = require('sequelize');

const rootDirectoryStr = path.dirname(require.main.filename);
const sequelize = require(rootDirectoryStr, 'util', 'mySqlDatabaseCreds.js');

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

module.exports = Product;