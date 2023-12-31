const path = require('path');

const rootDirectoryStr = path.dirname(require.main.filename);
const Product = require(path.join(rootDirectoryStr, 'models', 'product.js'));
const User = require(path.join(rootDirectoryStr, 'models', 'user.js'));
const Cart = require(path.join(rootDirectoryStr, 'models', 'cart.js'));
const CartItem = require(path.join(rootDirectoryStr, 'models', 'cart-item.js'));
const Order = require(path.join(rootDirectoryStr, 'models', 'order.js'));
const OrderItem = require(path.join(rootDirectoryStr, 'models', 'order-item.js'));

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });