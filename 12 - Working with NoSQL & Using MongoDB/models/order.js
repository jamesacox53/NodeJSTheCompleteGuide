const path = require('path');
const Sequelize = require('sequelize');

const rootDirectoryStr = path.dirname(require.main.filename);
const sequelize = require(path.join(rootDirectoryStr, 'util', 'mySqlDatabaseCreds.js'));

const orderFieldAttributesObj = {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
};

const Order = sequelize.define('order', orderFieldAttributesObj);

module.exports = Order;