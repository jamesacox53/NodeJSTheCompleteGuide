const path = require('path');
const Sequelize = require('sequelize');

const rootDirectoryStr = path.dirname(require.main.filename);
const sequelize = require(path.join(rootDirectoryStr, 'util', 'mySqlDatabaseCreds.js'));

const cartFieldAttributesObj = {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
};

const Cart = sequelize.define('cart', cartFieldAttributesObj);

module.exports = Cart;