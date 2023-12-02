const path = require('path');
const Product = require(path.join('..', 'models', 'product.js'));

exports.getAddProductPage = (request, response, next) => {
  const optionsObj = {
    path: path,
    pageTitle: 'Add Product',
    pathStr: '/admin/add-product'
  };
   
  response.render(path.join('admin', 'add-product.ejs'), optionsObj);
};
  
exports.postAddProduct = (request, response, next) => {
  const productArgsObj = {
    productTitleStr: request.body.title,
    imageURLStr: request.body.imageURL,
    priceStr: request.body.price,
    descriptionStr: request.body.description
  };

  const product = new Product(productArgsObj);
    
  console.log(productArgsObj.productTitleStr);
  product.save();
  
  response.redirect('/');
};

exports.getProducts = (request, response, next) => {
  const callbackFunc = (productsArr) => {
    const optionsObj = {
      path: path,
      pageTitle: 'Admin Products',
      pathStr: '/admin/products',
      prods: productsArr
    };
  
    response.render(path.join('admin', 'products.ejs'), optionsObj);
  }

  Product.fetchAll(callbackFunc);
};