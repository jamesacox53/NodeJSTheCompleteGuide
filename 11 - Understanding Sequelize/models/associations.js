const path = require('path');

const rootDirectoryStr = path.dirname(require.main.filename);

const Product = require(path.join(rootDirectoryStr, 'models', 'product.js'));
const User = require(path.join(rootDirectoryStr, 'models', 'user.js'));

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);