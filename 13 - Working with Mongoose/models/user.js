const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productID: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
});

userSchema.methods.addToCart = function(product) {
    const itemsArr = this.cart.items;
    const productIndex = this._getProductIndex(product, itemsArr);

    if (productIndex == -1) {
        return this._addProductToCart(this._id, product, this.cart);
        
    } else {
        return this._updateProductQuantityInCart(this._id, productIndex, this.cart);
    }
}

userSchema.methods._getProductIndex = function(product, itemsArr) {
    const productIDStr = product._id.toString();
        
    for (let i = 0; i < itemsArr.length; i++) {
        const prodObj = itemsArr[i];
        const prodIDStr = prodObj.productID.toString();
            
        if (prodIDStr == productIDStr)
            return i;
    }

    return -1;
}

userSchema.methods._addProductToCart = function(_id, product, cart) {
    const itemsArr = cart.items;
    const productObj = {
        productID: product._id,
        quantity: 1
    };

    itemsArr.push(productObj);

    return this.save();
}

userSchema.methods._updateProductQuantityInCart = function(_id, productIndex, cart) {
    const itemsArr = cart.items;
    const productObj = itemsArr[productIndex];
        
    const oldQuantity = parseInt(productObj['quantity'], 10);
    const newQuantity = oldQuantity + 1; 
        
    productObj['quantity'] = newQuantity;

    return this.save();
}

userSchema.methods.getCart = function() {
    return this.populate('cart.items.productID')
    .then(user => user.cart);
}

userSchema.methods.deleteCartItem = function(productID) {
    this._removeCartItem(this.cart, productID);

    return this.save();
}

userSchema.methods._removeCartItem = function(cart, productID) {
    const newItemsArr = [];
    const items = cart.items;
    const productIDStr = productID.toString();

    for(let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemIDStr = item.productID.toString();

        if (productIDStr != itemIDStr)
            newItemsArr.push(item);
    }

    cart.items = newItemsArr;
}

module.exports = mongoose.model('User', userSchema);