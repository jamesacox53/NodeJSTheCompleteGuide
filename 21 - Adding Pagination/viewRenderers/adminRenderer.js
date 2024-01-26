const path = require('path');

exports.renderAddProductPage = (inputsObj) => {
  _renderAddProductPage(inputsObj);

  function _renderAddProductPage(inputsObj) {
    const status = inputsObj.status;
    const response = inputsObj.response;
    const optionsObj = {
        path: path,
        pageTitle: 'Add Product',
        pathStr: '/admin/add-product',
        errorMessage: _getErrorMessage(inputsObj),
        oldInput: _getOldInputObj(inputsObj),
        fieldErrorsObj: _getFieldErrorsObj(inputsObj)
    };
    
    if (status) {
        response.status(status).render(path.join('admin', 'add-product.ejs'), optionsObj);

    } else {
        response.render(path.join('admin', 'add-product.ejs'), optionsObj);
    }
  }

  function _getErrorMessage(inputsObj) {
    const errorsArr = inputsObj.errorsArr;
    if (!errorsArr) return '';
    
    const messagesArr = [];
    
    for(let i = 0; i < errorsArr.length; i++) {
      const messageStr = errorsArr[i].msg;
    
      if (!messageStr) continue;

      messagesArr.push(messageStr);
    }
    
    return messagesArr.join('. ');
  }

  function _getOldInputObj(inputsObj) {
    const oldInputObj = {
        title: '',
        imageURL: '',
        price: 0,
        description: ''
    };

    const request = inputsObj.request;
    if (!request) return oldInputObj;

    if (request.body.title)
        oldInputObj.title = request.body.title;

    if (request.body.imageURL)
        oldInputObj.imageURL = request.body.imageURL;
    
    if (request.body.price)
        oldInputObj.price = request.body.price;

    if (request.body.description)
        oldInputObj.description = request.body.description;
    
    return oldInputObj;
  }

  function _getFieldErrorsObj(inputsObj) {
    const fieldErrorsObj = {
        title: false,
        imageURL: false,
        price: false,
        description: false
      };

      const errorsArr = inputsObj.errorsArr;
      if (!errorsArr) return fieldErrorsObj;
    
      for (let i = 0; i < errorsArr.length; i++) {
        const errorObj = errorsArr[i];
        const path = errorObj['path'];
    
        fieldErrorsObj[path] = true;
      }
    
      return fieldErrorsObj;
    }
};

exports.renderEditProductPage = (inputsObj) => {
    _renderEditProductPage(inputsObj);
    
    function _renderEditProductPage(inputsObj) {
        const status = inputsObj.status;
        const response = inputsObj.response;
        const optionsObj = {
            path: path,
            pageTitle: 'Edit Product',
            pathStr: '/admin/edit-product',
            errorMessage: _getErrorMessage(inputsObj),
            product: _getProductObj(inputsObj),
            fieldErrorsObj: _getFieldErrorsObj(inputsObj)
          };

        if (status) {
            response.status(status).render(path.join('admin', 'edit-product.ejs'), optionsObj);
          
        } else {
            response.render(path.join('admin', 'edit-product.ejs'), optionsObj);
        }
    }

    function _getErrorMessage(inputsObj) {
      const errorsArr = inputsObj.errorsArr;
      if (!errorsArr) return '';  

        const messagesArr = [];
        
        for(let i = 0; i < errorsArr.length; i++) {
          const messageStr = errorsArr[i].msg;
        
          if (!messageStr) continue;
    
          messagesArr.push(messageStr);
        }
        
        return messagesArr.join('. ');
      }
    
      function _getProductObj(inputsObj) {
        if (inputsObj.product)
          return inputsObj.product;
        
        const productObj = {
            _id: '',
            title: '',
            imageURL: '',
            price: 0,
            description: '',
            userID: '',
        };

        const request = inputsObj.request;
        if (!request) return productObj;

        if (request.body.productID)
            productObj._id = request.body.productID;
    
        if (request.body.title)
            productObj.title = request.body.title;
        
        if (request.body.imageURL)
            productObj.imageURL = request.body.imageURL;
        
        if (request.body.price)
            productObj.price = request.body.price;
        
        if (request.body.description)
            productObj.description = request.body.description;
        
        if (request.user._id)
            productObj.userID = request.user._id;

        return productObj;
      }
    
      function _getFieldErrorsObj(inputsObj) {
        const fieldErrorsObj = {
            title: false,
            imageURL: false,
            price: false,
            description: false
          };
    
          const errorsArr = inputsObj.errorsArr;
          if (!errorsArr) return fieldErrorsObj;
        
          for (let i = 0; i < errorsArr.length; i++) {
            const errorObj = errorsArr[i];
            const path = errorObj['path'];
        
            fieldErrorsObj[path] = true;
          }
        
          return fieldErrorsObj;
        }
};

exports.renderAdminProductsPage = (inputsObj) => {
    const response = inputsObj.response;
    const arr = inputsObj.arr;
    const optionsObj = {
      path: path,
      pageTitle: 'Admin Products',
      pathStr: '/admin/products',
      prods: arr
    };
  
    response.render(path.join('admin', 'products.ejs'), optionsObj);
};