const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [
        {
            productID: { 
                type: Object,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    user: {
        username: {
            type: String,
            required: true
        },
        userID: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    }
});

orderSchema.statics.getOrderConstructorObj = function(user) {
    const productsArr = user.cart.items;

    const userObj = {
        username: user.username,
        userID: user._id
    };

    const orderObj = {
        products: productsArr,
        user: userObj
    };

    return orderObj;
}

module.exports = mongoose.model('Order', orderSchema);