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
  product.save((error) => {
    response.redirect('/');
  });
};

exports.getEditProductPage = (request, response, next) => {
  const callbackFunc = (product) => {
    const optionsObj = {
      path: path,
      pageTitle: 'Edit Product',
      pathStr: '/admin/edit-product',
      product: product
    };

    response.render(path.join('admin', 'edit-product.ejs'), optionsObj);
  };

  const productID = request.params.productID;
  Product.getProductByID(productID, callbackFunc);
};

exports.postEditProduct = (request, response, next) => {
  const productID = request.body.productID;
  const productTitleStr = request.body.title;
  const imageURLStr = request.body.imageURL;
  const priceStr = request.body.price;
  const descriptionStr = request.body.description;

  Product.getProductByID(productID, (product) => {
    product.title = productTitleStr;
    product.imageURL = imageURLStr;
    product.description = descriptionStr;
    product.price = priceStr;
  
    product.save((error) => {
      response.redirect('/admin/products');
    });
  });
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