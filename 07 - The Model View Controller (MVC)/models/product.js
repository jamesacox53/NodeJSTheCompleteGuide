const productsArr = require('../database/productsArr.js');

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        productsArr.push(this);
    }

    static fetchAll() {
        return productsArr;
    }
}