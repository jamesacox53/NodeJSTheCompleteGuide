const path = require('path');
const Sequelize = require('sequelize');

const rootDirectoryStr = path.dirname(require.main.filename);
const sequelize = require(path.join(rootDirectoryStr, 'util', 'mySqlDatabaseCreds.js'));

const cartItemFieldAttributesObj = {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
    },
};

const CartItem = sequelize.define('cartItem', cartItemFieldAttributesObj);

module.exports = CartItem;