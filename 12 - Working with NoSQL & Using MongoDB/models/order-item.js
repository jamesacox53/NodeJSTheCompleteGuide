const path = require('path');
const Sequelize = require('sequelize');

const rootDirectoryStr = path.dirname(require.main.filename);
const sequelize = require(path.join(rootDirectoryStr, 'util', 'mySqlDatabaseCreds.js'));

const orderItemFieldAttributesObj = {
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

const OrderItem = sequelize.define('orderItem', orderItemFieldAttributesObj);

module.exports = OrderItem;